import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "music");
mkdirSync(outDir, { recursive: true });

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const DURATION_SECONDS = 45;
const NUM_SAMPLES = SAMPLE_RATE * DURATION_SECONDS;

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

function masterEnvelope(progress) {
  const fadeIn = Math.min(progress / 0.05, 1);
  const fadeOut = Math.min((1 - progress) / 0.05, 1);
  return fadeIn * fadeOut;
}

// Warm ambient pad: sub bass drone + slow filter sweep + gentle harmonics
function generateAmbient() {
  const samples = new Float64Array(NUM_SAMPLES);

  const baseFreqs = [80, 120, 160];
  const harmonicFreqs = [240, 320, 480];

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / NUM_SAMPLES;
    const env = masterEnvelope(progress);

    // Slow LFO for filter sweep feel
    const lfo1 = Math.sin(2 * Math.PI * 0.03 * t);
    const lfo2 = Math.sin(2 * Math.PI * 0.017 * t + 1.2);
    const lfo3 = Math.sin(2 * Math.PI * 0.009 * t + 2.5);

    // Sub bass drone with subtle movement
    let sub = 0;
    for (let f = 0; f < baseFreqs.length; f++) {
      const freq = baseFreqs[f] * (1 + lfo1 * 0.003);
      sub += Math.sin(2 * Math.PI * freq * t + f * 0.8) * (0.25 - f * 0.05);
    }

    // Gentle harmonics that drift in and out
    let harmonics = 0;
    for (let h = 0; h < harmonicFreqs.length; h++) {
      const freq = harmonicFreqs[h] * (1 + lfo2 * 0.005);
      const harmonicEnv = 0.5 + 0.5 * Math.sin(2 * Math.PI * (0.02 + h * 0.007) * t + h * 1.5);
      harmonics += Math.sin(2 * Math.PI * freq * t) * harmonicEnv * (0.06 - h * 0.015);
    }

    // Filtered noise for warmth
    const noise = (Math.random() * 2 - 1) * 0.008 * (0.5 + 0.5 * lfo3);

    samples[i] = (sub + harmonics + noise) * env * 0.55;
  }
  return samples;
}

// Upbeat: rhythmic volume pulses, brighter harmonics, rising energy
function generateUpbeat() {
  const samples = new Float64Array(NUM_SAMPLES);

  const baseFreq = 110;
  const pulseRate = 2.5; // ~150 BPM feel via volume modulation

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / NUM_SAMPLES;
    const env = masterEnvelope(progress);

    // Rising energy curve
    const energy = 0.6 + 0.4 * progress;

    // Rhythmic volume pulse (not drums, just volume modulation)
    const pulse = 0.6 + 0.4 * Math.pow(Math.abs(Math.sin(Math.PI * pulseRate * t)), 0.5);

    // Brighter pad with more harmonics
    const lfo = Math.sin(2 * Math.PI * 0.04 * t);
    const freq1 = baseFreq * (1 + lfo * 0.004);
    const freq2 = baseFreq * 1.5;
    const freq3 = baseFreq * 2;
    const freq4 = baseFreq * 3;

    let tone = 0;
    tone += Math.sin(2 * Math.PI * freq1 * t) * 0.22;
    tone += Math.sin(2 * Math.PI * freq2 * t) * 0.14;
    tone += Math.sin(2 * Math.PI * freq3 * t) * 0.08 * energy;
    tone += Math.sin(2 * Math.PI * freq4 * t) * 0.04 * energy;

    // Bright shimmer layer
    const shimmerLfo = Math.sin(2 * Math.PI * 0.07 * t + 0.5);
    const shimmerFreq = 660 * (1 + shimmerLfo * 0.01);
    const shimmer = Math.sin(2 * Math.PI * shimmerFreq * t) * 0.03 *
      (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.13 * t));

    // Subtle rhythmic click layer
    const clickPhase = (t * pulseRate) % 1;
    const clickEnv = Math.exp(-clickPhase * 40);
    const click = Math.sin(2 * Math.PI * 1800 * t) * clickEnv * 0.015 * energy;

    samples[i] = (tone * pulse + shimmer + click) * env * energy * 0.5;
  }
  return samples;
}

// Cinematic: deep sub bass, sparse high sparkles, building tension
function generateCinematic() {
  const samples = new Float64Array(NUM_SAMPLES);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / NUM_SAMPLES;
    const env = masterEnvelope(progress);

    // Building tension curve
    const tension = 0.4 + 0.6 * Math.pow(progress, 0.7);

    // Deep sub bass with slow pitch drift
    const subLfo = Math.sin(2 * Math.PI * 0.012 * t);
    const subFreq = 50 + 10 * subLfo + 15 * progress;
    const sub = Math.sin(2 * Math.PI * subFreq * t) * 0.35;

    // Dark mid drone
    const droneLfo = Math.sin(2 * Math.PI * 0.02 * t + 1.0);
    const droneFreq = 90 * (1 + droneLfo * 0.008);
    const drone = Math.sin(2 * Math.PI * droneFreq * t) * 0.15 * tension;

    // Sparse high-frequency sparkles (appear randomly, decay quickly)
    let sparkle = 0;
    const sparkleSeeds = [3.7, 7.1, 11.3, 15.9, 19.2, 23.6, 28.1, 33.5, 37.8, 41.2];
    for (const seed of sparkleSeeds) {
      const dist = Math.abs(t - seed);
      if (dist < 0.8) {
        const sparkleEnv = Math.exp(-dist * 6) * 0.06;
        const sparkleFreq = 2000 + seed * 200;
        sparkle += Math.sin(2 * Math.PI * sparkleFreq * t) * sparkleEnv;
      }
    }

    // Rumble noise in low frequencies
    const rumble = (Math.random() * 2 - 1) * 0.02 * tension;

    // Tension riser in final third
    let riser = 0;
    if (progress > 0.65) {
      const riserProgress = (progress - 0.65) / 0.3;
      const riserFreq = 200 + 600 * riserProgress;
      riser = Math.sin(2 * Math.PI * riserFreq * t) * riserProgress * 0.08;
    }

    samples[i] = (sub + drone + sparkle + rumble + riser) * env * 0.55;
  }
  return samples;
}

const tracks = {
  ambient: generateAmbient,
  upbeat: generateUpbeat,
  cinematic: generateCinematic,
};

for (const [name, generator] of Object.entries(tracks)) {
  console.log(`Generating ${name}...`);
  const samples = generator();
  const wav = createWav(samples);
  const path = join(outDir, `${name}.wav`);
  writeFileSync(path, wav);
  console.log(`  Written ${path} (${(wav.length / 1024).toFixed(0)} KB)`);
}

console.log("\nAll background music tracks generated successfully!");
