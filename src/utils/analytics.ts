import type { Achievement, Quiz, QuizAttempt } from '../types/mock'

export type ActivityPoint = {
  label: string
  date: string
  sessions: number
  correct: number
  total: number
}

export type Aggregation = 'daily' | 'weekly' | 'monthly'

const dateKey = (d: Date): string => d.toISOString().slice(0, 10)

const addDays = (d: Date, delta: number): Date => {
  const n = new Date(d)
  n.setDate(n.getDate() + delta)
  n.setHours(0, 0, 0, 0)
  return n
}

const startOfWeek = (d: Date): Date => {
  const n = new Date(d)
  // Make Monday the first day of week
  const day = n.getDay() // 0..6, Sun..Sat
  const diff = (day === 0 ? -6 : 1) - day
  return addDays(n, diff)
}

const startOfMonth = (d: Date): Date => {
  const n = new Date(d)
  n.setDate(1)
  n.setHours(0, 0, 0, 0)
  return n
}

const formatLabel = (d: Date, agg: Aggregation): string => {
  if (agg === 'daily') return `${d.getMonth() + 1}/${d.getDate()}`
  if (agg === 'weekly') {
    const s = startOfWeek(d)
    return `${s.getMonth() + 1}/${s.getDate()}`
  }
  // monthly
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const buildQuestionToVocabIndex = (quizzes: Quiz[]): Record<string, string | undefined> => {
  const map: Record<string, string | undefined> = {}
  quizzes.forEach((q) => {
    q.questions.forEach((qq) => {
      // relatedVocabId is optional
      map[qq.id] = qq.relatedVocabId
    })
  })
  return map
}

export const computeUniqueWordsMastered = (
  attempts: QuizAttempt[],
  q2v: Record<string, string | undefined>,
): number => {
  const words = new Set<string>()
  attempts.forEach((a) => {
    a.results.forEach((r) => {
      if (!r.correct) return
      const vocabId = q2v[r.questionId] ?? r.questionId
      words.add(vocabId)
    })
  })
  return words.size
}

export const computeDailyActivity = (attempts: QuizAttempt[], days = 14): ActivityPoint[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayKeys: string[] = []
  for (let i = days - 1; i >= 0; i--) dayKeys.push(dateKey(addDays(today, -i)))

  const byDay: Record<string, ActivityPoint> = {}
  dayKeys.forEach((k) => {
    const d = new Date(k)
    byDay[k] = { label: formatLabel(d, 'daily'), date: k, sessions: 0, correct: 0, total: 0 }
  })

  attempts.forEach((a) => {
    const k = a.timestamp.slice(0, 10)
    if (!byDay[k]) return
    byDay[k].sessions += 1
    byDay[k].correct += a.results.filter((r) => r.correct).length
    byDay[k].total += a.results.length
  })

  return dayKeys.map((k) => byDay[k])
}

export const computeWeeklyActivity = (attempts: QuizAttempt[], weeks = 8): ActivityPoint[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weeksArr: Date[] = []
  for (let i = weeks - 1; i >= 0; i--) weeksArr.push(addDays(startOfWeek(today), -7 * i))

  const byWeek: Record<string, ActivityPoint> = {}
  weeksArr.forEach((d) => {
    const k = dateKey(d)
    byWeek[k] = { label: formatLabel(d, 'weekly'), date: k, sessions: 0, correct: 0, total: 0 }
  })

  attempts.forEach((a) => {
    const ts = new Date(a.timestamp)
    const s = startOfWeek(ts)
    const k = dateKey(s)
    if (!byWeek[k]) return
    byWeek[k].sessions += 1
    byWeek[k].correct += a.results.filter((r) => r.correct).length
    byWeek[k].total += a.results.length
  })

  return weeksArr.map((d) => byWeek[dateKey(d)])
}

export const computeMonthlyActivity = (attempts: QuizAttempt[], months = 6): ActivityPoint[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const monthsArr: Date[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = startOfMonth(today)
    d.setMonth(d.getMonth() - i)
    monthsArr.push(d)
  }

  const byMonth: Record<string, ActivityPoint> = {}
  monthsArr.forEach((d) => {
    const k = dateKey(d)
    byMonth[k] = { label: formatLabel(d, 'monthly'), date: k, sessions: 0, correct: 0, total: 0 }
  })

  attempts.forEach((a) => {
    const ts = new Date(a.timestamp)
    const m = startOfMonth(ts)
    const k = dateKey(m)
    if (!byMonth[k]) return
    byMonth[k].sessions += 1
    byMonth[k].correct += a.results.filter((r) => r.correct).length
    byMonth[k].total += a.results.length
  })

  return monthsArr.map((d) => byMonth[dateKey(d)])
}

export const computeCurrentStreak = (attempts: QuizAttempt[]): number => {
  if (!attempts.length) return 0
  const active = new Set(attempts.map((a) => a.timestamp.slice(0, 10)))
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // If no activity today, still count from yesterday
  for (let i = 0; i < 365; i++) {
    const d = addDays(today, -i)
    const k = dateKey(d)
    if (i === 0 && !active.has(k)) continue
    if (active.has(k)) streak += 1
    else break
  }
  return streak
}

export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

export const averageAccuracy = (points: ActivityPoint[]): number => {
  const correct = sum(points.map((p) => p.correct))
  const total = sum(points.map((p) => p.total))
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export const evaluateAchievements = (
  achievements: Achievement[],
  stats: { streak: number; quizzesCompleted: number; wordsMastered: number },
): { id: string; title: string; description: string; icon?: string; unlocked: boolean }[] => {
  return achievements.map((a) => {
    const { criteria } = a
    let unlocked = false
    if (criteria.type === 'streak_days') unlocked = stats.streak >= criteria.target
    if (criteria.type === 'quizzes_completed') unlocked = stats.quizzesCompleted >= criteria.target
    if (criteria.type === 'words_mastered') unlocked = stats.wordsMastered >= criteria.target
    return { id: a.id, title: a.title, description: a.description, icon: a.icon, unlocked }
  })
}
