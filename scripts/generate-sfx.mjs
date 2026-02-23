import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "sfx");
mkdirSync(outDir, { recursive: true });

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

function createWav(samples) {
  const numSamples = samples.length;
  const byteRate = SAMPLE_RATE * CHANNELS * (BITS_PER_SAMPLE / 8);
  const blockAlign = CHANNELS * (BITS_PER_SAMPLE / 8);
  const dataSize = numSamples * (BITS_PER_SAMPLE / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }
  return buffer;
}

function generateWhoosh(durationMs = 250) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq = 200 + 2500 * progress * progress;
    const envelope =
      Math.sin(progress * Math.PI) * (1 - progress * 0.3);
    const noise = (Math.random() * 2 - 1) * 0.3;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.15;
    const filtered =
      noise * Math.exp(-((progress - 0.4) ** 2) / 0.08) +
      tone * envelope;
    samples[i] = filtered * 0.7;
  }
  return samples;
}

function generatePop(durationMs = 100) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq = 800 * Math.exp(-progress * 6);
    const envelope = Math.exp(-progress * 12);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.6;
  }
  return samples;
}

function generateImpact(durationMs = 300) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq = 60 + 40 * Math.exp(-progress * 8);
    const envelope = Math.exp(-progress * 5);
    const sub = Math.sin(2 * Math.PI * freq * t) * envelope;
    const crack =
      (Math.random() * 2 - 1) * Math.exp(-progress * 30) * 0.5;
    samples[i] = (sub * 0.7 + crack) * 0.65;
  }
  return samples;
}

function generateRise(durationMs = 500) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq = 200 + 1800 * (progress ** 2);
    const envelope =
      Math.sin(progress * Math.PI) * 0.8 + 0.2 * progress;
    const tone = Math.sin(2 * Math.PI * freq * t);
    const harmonic = Math.sin(2 * Math.PI * freq * 2 * t) * 0.15;
    samples[i] = (tone + harmonic) * envelope * 0.35;
  }
  return samples;
}

function generateClick(durationMs = 40) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq = 2500 * Math.exp(-progress * 20);
    const envelope = Math.exp(-progress * 25);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.5;
  }
  return samples;
}

function generateDing(durationMs = 600) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq1 = 1200;
    const freq2 = 1800;
    const envelope = Math.exp(-progress * 4);
    const tone1 = Math.sin(2 * Math.PI * freq1 * t) * 0.5;
    const tone2 = Math.sin(2 * Math.PI * freq2 * t) * 0.25;
    samples[i] = (tone1 + tone2) * envelope * 0.45;
  }
  return samples;
}

function generateSwipe(durationMs = 200) {
  const numSamples = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float64Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const freq = 3000 * Math.exp(-progress * 4);
    const envelope = Math.sin(progress * Math.PI);
    const noise = (Math.random() * 2 - 1) * 0.2 * envelope;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.1 * envelope;
    samples[i] = (noise + tone) * 0.5;
  }
  return samples;
}

const sfxMap = {
  whoosh: generateWhoosh,
  pop: generatePop,
  impact: generateImpact,
  rise: generateRise,
  click: generateClick,
  ding: generateDing,
  swipe: generateSwipe,
};

for (const [name, generator] of Object.entries(sfxMap)) {
  const samples = generator();
  const wav = createWav(samples);
  const path = join(outDir, `${name}.wav`);
  writeFileSync(path, wav);
  console.log(`Generated ${path} (${wav.length} bytes)`);
}

console.log("\nAll SFX generated successfully!");
