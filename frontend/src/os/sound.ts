// Tiny interface sounds, synthesised with the Web Audio API. Off by default; nothing plays
// until the visitor turns sound on, and the AudioContext is only created after that click.

export type Sound = 'open' | 'close' | 'click' | 'ding' | 'error' | 'startup' | 'shutdown' | 'pop' | 'empty'

let enabled = false
let ctx: AudioContext | null = null

export function setSoundEnabled(on: boolean) {
  enabled = on
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.06, slideTo?: number) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + start
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export function play(s: Sound) {
  if (!enabled) return
  switch (s) {
    case 'open':
      tone(520, 0, 0.09, 'triangle', 0.05, 780)
      break
    case 'close':
      tone(700, 0, 0.09, 'triangle', 0.045, 420)
      break
    case 'click':
      tone(1200, 0, 0.03, 'square', 0.02)
      break
    case 'pop':
      tone(500, 0, 0.08, 'sine', 0.08, 1400)
      break
    case 'ding':
      tone(880, 0, 0.35, 'sine', 0.06)
      tone(1320, 0.08, 0.4, 'sine', 0.04)
      break
    case 'error':
      tone(330, 0, 0.18, 'square', 0.035)
      tone(250, 0.12, 0.22, 'square', 0.035)
      break
    case 'empty':
      tone(300, 0, 0.25, 'sawtooth', 0.025, 80)
      break
    case 'startup':
      ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.7, 'sine', 0.045))
      tone(262, 0, 1.4, 'triangle', 0.03)
      break
    case 'shutdown':
      ;[1047, 784, 659, 523].forEach((f, i) => tone(f, i * 0.14, 0.6, 'sine', 0.04))
      break
  }
}
