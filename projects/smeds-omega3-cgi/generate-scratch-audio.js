const fs = require('fs');
const path = require('path');

// Generate 18 seconds of subtle 44.1kHz 16-bit mono scratch audio (ambient room tone)
const sampleRate = 44100;
const durationSeconds = 18;
const numSamples = sampleRate * durationSeconds;
const bytesPerSample = 2;
const blockAlign = bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = numSamples * bytesPerSample;

const buffer = Buffer.alloc(44 + dataSize);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);

// fmt chunk
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // BitsPerSample (16)

// data chunk
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Generate gentle pink-noise-like ambient room tone (low amplitude, comfortable)
let lastSample = 0;
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  // Very soft low-frequency tone + room flutter to indicate active timing track
  const rumble = Math.sin(2 * Math.PI * 65 * t) * 0.015;
  const cueBeep = (t >= 0.5 && t < 0.6) || (t >= 6.1 && t < 6.2) || (t >= 11.2 && t < 11.3)
    ? Math.sin(2 * Math.PI * 440 * t) * 0.08
    : 0;
  const sampleVal = Math.max(-1, Math.min(1, rumble + cueBeep));
  const intVal = Math.round(sampleVal * 32767);
  buffer.writeInt16LE(intVal, 44 + i * 2);
}

const outDir = path.join(__dirname, '..', '..', 'public', 'audio');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'smeds-omega3-vo.wav'), buffer);
console.log('Generated scratch timing audio track: public/audio/smeds-omega3-vo.wav');
