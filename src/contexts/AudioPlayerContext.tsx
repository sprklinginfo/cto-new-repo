import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type AudioPlayerValue = {
  isPlaying: boolean
  currentSrc: string | null
  play: (src: string) => Promise<void>
  pause: () => void
  stop: () => void
}

const AudioPlayerContext = createContext<AudioPlayerValue | undefined>(undefined)

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)

  const cleanupAudio = () => {
    if (!audioRef.current) return
    audioRef.current.onended = null
    audioRef.current.onpause = null
    audioRef.current.onplay = null
  }

  useEffect(() => {
    return () => {
      cleanupAudio()
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const play = useCallback(async (src: string) => {
    try {
      if (!audioRef.current || currentSrc !== src) {
        cleanupAudio()
        audioRef.current?.pause()
        const a = new Audio(src)
        audioRef.current = a
        setCurrentSrc(src)
        a.onended = () => setIsPlaying(false)
        a.onpause = () => setIsPlaying(false)
        a.onplay = () => setIsPlaying(true)
      }
      await audioRef.current!.play()
      setIsPlaying(true)
    } catch {
      // ignore failed playback
    }
  }, [currentSrc])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const stop = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsPlaying(false)
  }, [])

  const value: AudioPlayerValue = useMemo(
    () => ({ isPlaying, currentSrc, play, pause, stop }),
    [isPlaying, currentSrc, play, pause, stop],
  )

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

export const useAudio = (): AudioPlayerValue => {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error('useAudio must be used within AudioPlayerProvider')
  return ctx
}
