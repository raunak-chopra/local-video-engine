"""
Procedural Sound Effects Synthesizer for Personal Video Engine.
Synthesizes deterministic UI audio cues (whooshes, pops, snaps, impacts, shimmers)
using pure mathematics (NumPy & SciPy) without external stock media.
Run via: uv run --with numpy --with scipy tools/sfx_synth.py
"""

import os
import wave
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")
os.makedirs(OUTPUT_DIR, exist_ok=True)
SAMPLE_RATE = 44100

def write_wav(filename: str, audio: np.ndarray):
    filepath = os.path.join(OUTPUT_DIR, filename)
    audio = np.clip(audio, -1.0, 1.0)
    int_audio = (audio * 32767).astype(np.int16)
    with wave.open(filepath, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(int_audio.tobytes())
    print(f"Synthesized: {filename} ({len(int_audio) / SAMPLE_RATE:.2f}s)")

def synth_pop():
    # Crisp resonant pop (sine with exponential decay and fast pitch drop)
    dur = 0.12
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    freq = np.linspace(900, 220, len(t))
    env = np.exp(-t * 45)
    wave_data = np.sin(2 * np.pi * freq * t) * env * 0.75
    write_wav("pop.wav", wave_data)

def synth_snap():
    # High-impact snap / molecular bond click (sharp transient + sine decay)
    dur = 0.15
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    noise = np.random.RandomState(42).randn(len(t)) * np.exp(-t * 120) * 0.4
    sine = np.sin(2 * np.pi * 1400 * np.exp(-t * 20) * t) * np.exp(-t * 50) * 0.6
    write_wav("snap.wav", noise + sine)

def synth_whoosh():
    # Filtered noise sweep for scene transitions
    dur = 0.45
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    noise = np.random.RandomState(1337).randn(len(t))
    # Gaussian amplitude envelope
    env = np.exp(-((t - 0.22) ** 2) / (2 * (0.09 ** 2)))
    # Modulation
    mod = np.sin(2 * np.pi * np.linspace(150, 800, len(t)) * t) * 0.3
    write_wav("whoosh.wav", (noise * 0.4 + mod) * env * 0.8)

def synth_impact():
    # Low frequency boom / droplet hit
    dur = 0.6
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    freq = np.linspace(160, 45, len(t))
    env = np.exp(-t * 8)
    wave_data = np.sin(2 * np.pi * freq * t) * env * 0.85
    write_wav("impact.wav", wave_data)

def synth_shimmer():
    # Multi-frequency bell shimmer for microdroplet bursts
    dur = 0.8
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    env = np.exp(-t * 5)
    freqs = [1200, 1600, 2400, 3200]
    wave_data = np.zeros_like(t)
    for f in freqs:
        wave_data += np.sin(2 * np.pi * f * t) * 0.2
    write_wav("shimmer.wav", wave_data * env)

if __name__ == "__main__":
    print("Generating procedural SFX assets via NumPy...")
    synth_pop()
    synth_snap()
    synth_whoosh()
    synth_impact()
    synth_shimmer()
    print("All procedural SFX synthesized successfully.")
