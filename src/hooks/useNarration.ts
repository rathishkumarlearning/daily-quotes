import { useState, useEffect, useCallback } from 'react';

export type NarrationState = 'idle' | 'playing' | 'paused';

export function useNarration() {
  const [state, setState] = useState<NarrationState>('idle');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    // Clean up on unmount
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, author: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const fullText = `${text}. — ${author}`;
    const utterance = new SpeechSynthesisUtterance(fullText);

    // Pick a good voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Daniel') ||
      v.name.includes('Google US English') ||
      v.name.includes('Karen') ||
      v.name.includes('Alex')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setState('playing');
    utterance.onpause = () => setState('paused');
    utterance.onresume = () => setState('playing');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');

    window.speechSynthesis.speak(utterance);
    setState('playing');
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setState('paused');
    }
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setState('playing');
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setState('idle');
    }
  }, []);

  return { state, supported, speak, pause, resume, stop };
}
