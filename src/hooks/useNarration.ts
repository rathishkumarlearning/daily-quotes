import { useState, useEffect, useRef, useCallback } from 'react';

export type NarrationState = 'idle' | 'loading' | 'playing' | 'paused';

export function useNarration(slug: string) {
  const [state, setState] = useState<NarrationState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on slug change or unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setState('idle');
    };
  }, [slug]);

  const play = useCallback(() => {
    const audio = new Audio(`/daily-quotes/audio/${slug}.mp3`);
    audioRef.current = audio;

    setState('loading');

    audio.oncanplaythrough = () => {
      audio.play();
      setState('playing');
    };

    audio.onended = () => setState('idle');
    audio.onerror = () => setState('idle');

    audio.load();
  }, [slug]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
    setState('playing');
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState('idle');
  }, []);

  const toggle = useCallback(() => {
    if (state === 'idle') play();
    else if (state === 'playing') pause();
    else if (state === 'paused') resume();
  }, [state, play, pause, resume]);

  return { state, toggle, stop };
}
