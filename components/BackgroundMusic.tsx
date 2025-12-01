
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Calm Piano Configuration
  const TEMPO = 60; // Slow, relaxing tempo
  const LOOKAHEAD = 25.0; // ms
  const SCHEDULE_AHEAD_TIME = 0.1; // s

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopMusic();
    };
  }, []);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }
  };

  const playPianoNote = (freq: number, time: number, duration: number = 1.5) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Create 2 oscillators for a richer "electric piano" tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.value = freq;
    osc2.frequency.value = freq;
    
    // Slight detune for warmth
    osc2.detune.value = 4; 

    // Filter to make it soft
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // Muffled, soft sound

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Envelope: Soft attack, long gentle decay
    const attack = 0.05;
    const release = duration;
    
    // Low volume for background ambience (Max 0.08)
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + attack); 
    gain.gain.exponentialRampToValueAtTime(0.001, time + attack + release);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + attack + release);
    osc2.stop(time + attack + release);
  };

  const scheduleNote = (step: number, time: number) => {
    // Slow 16-step loop (4 bars of 4/4)
    // Progression: Cmaj7 - Am7 - Fmaj7 - Gadd9
    const loopStep = step % 32; // Longer loop

    // Helper to get frequencies
    // C4=261.6, D4=293.7, E4=329.6, F4=349.2, G4=392.0, A4=440.0, B4=493.9, C5=523.3
    
    let notes: number[] = [];

    // Chord Progression logic
    if (loopStep < 8) {
        // C Major 7 (C E G B)
        if (loopStep % 8 === 0) notes.push(130.81); // C3 (Bass)
        if (loopStep % 2 === 0) notes.push(261.63); // C4
        if (loopStep === 2) notes.push(329.63); // E4
        if (loopStep === 4) notes.push(392.00); // G4
        if (loopStep === 6) notes.push(493.88); // B4
    } else if (loopStep < 16) {
        // A Minor 7 (A C E G)
        if (loopStep % 8 === 0) notes.push(110.00); // A2 (Bass)
        if (loopStep % 2 === 0) notes.push(220.00); // A3
        if (loopStep === 10) notes.push(261.63); // C4
        if (loopStep === 12) notes.push(329.63); // E4
        if (loopStep === 14) notes.push(392.00); // G4
    } else if (loopStep < 24) {
        // F Major 7 (F A C E)
        if (loopStep % 8 === 0) notes.push(174.61); // F3 (Bass)
        if (loopStep % 2 === 0) notes.push(349.23); // F4
        if (loopStep === 18) notes.push(440.00); // A4
        if (loopStep === 20) notes.push(523.25); // C5
        if (loopStep === 22) notes.push(659.25); // E5
    } else {
        // G Major 9 (G B D F# A)
        if (loopStep % 8 === 0) notes.push(196.00); // G3 (Bass)
        if (loopStep % 2 === 0) notes.push(392.00); // G4
        if (loopStep === 26) notes.push(493.88); // B4
        if (loopStep === 28) notes.push(587.33); // D5
        if (loopStep === 30) notes.push(440.00); // A4
    }

    // Play all generated notes for this step
    notes.forEach(freq => playPianoNote(freq, time, 2.0));
  };

  const scheduler = () => {
    if (!audioContextRef.current) return;
    
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(stepRef.current, nextNoteTimeRef.current);
      const secondsPerBeat = 60.0 / TEMPO;
      const secondsPerStep = secondsPerBeat / 2; // 8th notes
      nextNoteTimeRef.current += secondsPerStep;
      stepRef.current++;
    }
    
    if (isPlayingRef.current) {
        timerIDRef.current = window.setTimeout(scheduler, LOOKAHEAD);
    }
  };

  const startMusic = () => {
    initAudioContext();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      setIsPlaying(true);
      
      // Reset timing if starting fresh
      if (audioContextRef.current) {
          nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
          scheduler();
      }
    }
  };

  const stopMusic = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerIDRef.current) {
      window.clearTimeout(timerIDRef.current);
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  // Autoplay handler (wait for interaction)
  useEffect(() => {
     const handleInteraction = () => {
         if (!isPlayingRef.current && !audioContextRef.current) {
             startMusic();
         }
         window.removeEventListener('click', handleInteraction);
     };
     
     window.addEventListener('click', handleInteraction);
     return () => window.removeEventListener('click', handleInteraction);
  }, []);

  return (
    <button
      onClick={toggleMusic}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md shadow-lg transition-all border border-white/10 z-50
        ${isPlaying ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-900/40 text-red-200 hover:bg-red-900/60'}
      `}
      title={isPlaying ? "Mute Music" : "Play Music"}
    >
      {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
};
