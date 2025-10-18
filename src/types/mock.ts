export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase'

export type VocabularyItem = {
  id: string
  term: string
  translation: string
  partOfSpeech?: PartOfSpeech
  example?: string
  audioUrl?: string
}

export type VocabularySet = {
  id: string
  title: string
  description?: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  items: VocabularyItem[]
}

export type VocabularyPayload = {
  version: number
  sets: VocabularySet[]
}

export type MCOption = { id: string; text: string }

export type BaseQuestion = {
  id: string
  type: 'multiple_choice' | 'fill_in' | 'listening' | 'ordering'
  prompt: string
  relatedVocabId?: string
}

export type MultipleChoiceQuestion = BaseQuestion & {
  type: 'multiple_choice'
  options: MCOption[]
  correctOptionId: string
}

export type FillInQuestion = BaseQuestion & {
  type: 'fill_in'
  answer: string
}

export type ListeningQuestion = BaseQuestion & {
  type: 'listening'
  audioUrl: string
  answer: string
}

export type OrderingQuestion = BaseQuestion & {
  type: 'ordering'
  words: string[]
}

export type QuizQuestion = MultipleChoiceQuestion | FillInQuestion | ListeningQuestion | OrderingQuestion

export type Quiz = {
  id: string
  title: string
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  questions: QuizQuestion[]
}

export type AchievementCriteria =
  | { type: 'streak_days'; target: number }
  | { type: 'quizzes_completed'; target: number }
  | { type: 'words_mastered'; target: number }

export type Achievement = {
  id: string
  title: string
  description: string
  icon?: string
  criteria: AchievementCriteria
}

export type AchievementsPayload = {
  version: number
  achievements: Achievement[]
}

export type QuestionResult = {
  questionId: string
  correct: boolean
  userAnswer?: string
  selectedOptionId?: string
}

export type QuizAttempt = {
  id: string
  quizId: string
  timestamp: string
  durationSec?: number
  score: number
  results: QuestionResult[]
}

export type ProgressEntry = {
  id: string
  date: string
  wordsReviewed: number
  quizzesCompleted: number
}
