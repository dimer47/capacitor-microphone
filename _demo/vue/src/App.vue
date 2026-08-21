<script setup lang="ts">
import { Microphone, type AudioRecording } from '@dimer47/capacitor-microphone';
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface LogEntry {
  at: string;
  label: string;
  detail: string;
  kind: 'info' | 'error' | 'event';
}

interface Take {
  index: number;
  webPath: string;
  duration: number;
  format: string;
  mimeType: string;
}

const permission = ref('unknown');
const status = ref('no recording in progress');
const elapsed = ref(0);
const takes = ref<Take[]>([]);
const logs = ref<LogEntry[]>([]);

let ticker: ReturnType<typeof setInterval> | undefined;
let startedAt = 0;
let pausedTotal = 0;
let pausedAt = 0;
let listener: { remove: () => Promise<void> } | undefined;

const log = (label: string, detail: unknown, kind: LogEntry['kind'] = 'info') => {
  logs.value.unshift({
    at: new Date().toLocaleTimeString(),
    label,
    detail: typeof detail === 'string' ? detail : JSON.stringify(detail),
    kind,
  });
};

const describe = (error: unknown) =>
  typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error);

/** Mirror the plugin timing so the displayed timer matches the reported duration. */
const tick = () => {
  ticker = setInterval(() => {
    if (pausedAt === 0) elapsed.value = Date.now() - startedAt - pausedTotal;
  }, 200);
};

const formatMs = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

onMounted(async () => {
  // Status events are emitted natively, so the UI never has to poll.
  listener = await Microphone.addListener('status', (payload) => {
    status.value = payload.status;
    log('event status', payload.status, 'event');
  });
  await checkPermissions();
});

onBeforeUnmount(async () => {
  if (ticker) clearInterval(ticker);
  await listener?.remove();
});

async function checkPermissions() {
  try {
    const result = await Microphone.checkPermissions();
    permission.value = result.microphone;
    log('checkPermissions', result);
  } catch (error) {
    log('checkPermissions', describe(error), 'error');
  }
}

async function requestPermissions() {
  try {
    const result = await Microphone.requestPermissions();
    permission.value = result.microphone;
    log('requestPermissions', result);
  } catch (error) {
    log('requestPermissions', describe(error), 'error');
  }
}

async function startRecording() {
  try {
    const result = await Microphone.startRecording();
    startedAt = Date.now();
    pausedTotal = 0;
    pausedAt = 0;
    elapsed.value = 0;
    tick();
    log('startRecording', result);
  } catch (error) {
    log('startRecording', describe(error), 'error');
  }
}

async function pauseRecording() {
  try {
    const result = await Microphone.pauseRecording();
    pausedAt = Date.now();
    log('pauseRecording', result);
  } catch (error) {
    log('pauseRecording', describe(error), 'error');
  }
}

async function resumeRecording() {
  try {
    const result = await Microphone.resumeRecording();
    if (pausedAt > 0) {
      pausedTotal += Date.now() - pausedAt;
      pausedAt = 0;
    }
    log('resumeRecording', result);
  } catch (error) {
    log('resumeRecording', describe(error), 'error');
  }
}

async function getCurrentStatus() {
  try {
    log('getCurrentStatus', await Microphone.getCurrentStatus());
  } catch (error) {
    log('getCurrentStatus', describe(error), 'error');
  }
}

async function stopRecording() {
  try {
    const recording: AudioRecording = await Microphone.stopRecording();
    if (ticker) clearInterval(ticker);
    ticker = undefined;
    takes.value.unshift({
      index: takes.value.length + 1,
      webPath: recording.webPath ?? '',
      duration: recording.duration,
      format: recording.format ?? '',
      mimeType: recording.mimeType ?? '',
    });
    log('stopRecording', recording);
  } catch (error) {
    log('stopRecording', describe(error), 'error');
  }
}
</script>

<template>
  <main>
    <header>
      <h1>Capacitor Microphone</h1>
      <p class="lede">
        Live demo of <code>&#64;dimer47/capacitor-microphone</code>. This page runs the web
        implementation; on iOS and Android the same API is backed by native recorders.
      </p>
    </header>

    <section class="state">
      <div><span>Permission</span><strong>{{ permission }}</strong></div>
      <div><span>Status</span><strong>{{ status }}</strong></div>
      <div><span>Elapsed</span><strong>{{ formatMs(elapsed) }}</strong></div>
    </section>

    <section class="actions">
      <button @click="checkPermissions">checkPermissions()</button>
      <button @click="requestPermissions">requestPermissions()</button>
      <button class="primary" @click="startRecording">startRecording()</button>
      <button @click="pauseRecording">pauseRecording()</button>
      <button @click="resumeRecording">resumeRecording()</button>
      <button @click="getCurrentStatus">getCurrentStatus()</button>
      <button class="danger" @click="stopRecording">stopRecording()</button>
    </section>

    <section v-if="takes.length">
      <h2>Recordings</h2>
      <article v-for="take in takes" :key="take.index" class="take">
        <div class="take-head">
          <strong>#{{ take.index }}</strong>
          <span>{{ formatMs(take.duration) }} · {{ take.duration }} ms · {{ take.mimeType }}</span>
        </div>
        <audio :src="take.webPath" controls preload="metadata"></audio>
      </article>
    </section>

    <section>
      <h2>Log</h2>
      <p v-if="!logs.length" class="empty">Nothing yet — call a method above.</p>
      <ul class="log">
        <li v-for="(entry, index) in logs" :key="index" :class="entry.kind">
          <span class="at">{{ entry.at }}</span>
          <span class="label">{{ entry.label }}</span>
          <span class="detail">{{ entry.detail }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style>
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --fg: #16181d;
  --muted: #6b7280;
  --line: #e5e7eb;
  --accent: #2563eb;
  --danger: #dc2626;
  --panel: #f9fafb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1115;
    --fg: #e8eaed;
    --muted: #9aa1ab;
    --line: #262a33;
    --accent: #60a5fa;
    --danger: #f87171;
    --panel: #161a21;
  }
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

main { max-width: 780px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
h1 { font-size: 1.6rem; margin: 0 0 .35rem; }
h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin: 2rem 0 .75rem; }
.lede { color: var(--muted); margin: 0 0 1.75rem; }
code { background: var(--panel); padding: .1em .35em; border-radius: 4px; }

.state { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.5rem; }
.state div { flex: 1 1 10rem; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: .6rem .8rem; }
.state span { display: block; font-size: .72rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.state strong { font-variant-numeric: tabular-nums; }

.actions { display: flex; flex-wrap: wrap; gap: .5rem; }
button {
  font: inherit; padding: .5rem .85rem; border-radius: 7px; cursor: pointer;
  border: 1px solid var(--line); background: var(--panel); color: var(--fg);
}
button:hover { border-color: var(--accent); }
button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
button.danger { background: var(--danger); border-color: var(--danger); color: #fff; }

.take { border: 1px solid var(--line); border-radius: 8px; padding: .75rem; margin-bottom: .6rem; }
.take-head { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: .5rem; font-size: .85rem; }
.take-head span { color: var(--muted); }
.take audio { width: 100%; }

.empty { color: var(--muted); }
.log { list-style: none; margin: 0; padding: 0; font-size: .82rem; }
.log li { display: grid; grid-template-columns: 5.5rem 11rem 1fr; gap: .6rem; padding: .35rem 0; border-bottom: 1px solid var(--line); }
.log .at { color: var(--muted); font-variant-numeric: tabular-nums; }
.log .label { font-weight: 600; }
.log .detail { color: var(--muted); overflow-wrap: anywhere; }
.log li.error .detail { color: var(--danger); }
.log li.event .label { color: var(--accent); }

@media (max-width: 560px) {
  .log li { grid-template-columns: 1fr; gap: .1rem; }
}
</style>
