'use client';

// Simple Web Audio API sound effects — no external files needed
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
  if (!audioCtx) return;
  // Resume context if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}

export function playCommandSound() {
  playTone(800, 0.05, 'square', 0.03);
}

export function playErrorSound() {
  playTone(200, 0.15, 'sawtooth', 0.05);
}

export function playSuccessSound() {
  // Little ascending arpeggio
  playTone(523, 0.1, 'sine', 0.08); // C5
  setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 100); // E5
  setTimeout(() => playTone(784, 0.15, 'sine', 0.08), 200); // G5
  setTimeout(() => playTone(1047, 0.2, 'sine', 0.06), 300); // C6
}

export function playAchievementSound() {
  // Fanfare
  playTone(523, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 150);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 300);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.1), 450);
  setTimeout(() => playTone(1319, 0.4, 'sine', 0.08), 600);
}

export function playHintSound() {
  playTone(440, 0.1, 'triangle', 0.06);
  setTimeout(() => playTone(554, 0.15, 'triangle', 0.06), 100);
}

export function playTabCompleteSound() {
  playTone(1200, 0.03, 'sine', 0.02);
}
