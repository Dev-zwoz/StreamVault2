/* ============================================================================
   StreamVault — player.js
   Cinema-mode player with native public-domain playback plus a real server
   switcher. VidBolt is the default embed; VidRift and the other configured
   services remain available when a server stalls.
   ============================================================================ */

import { IMG, VIDBOLT, CREDITS } from './config.js';
import { t } from './i18n.js';
import { listSources } from './archive.js';
import { getSettings, saveSettings, recordWatch } from './account.js';
import { isBlockedTitle } from './content.js';

const POS_KEY = 'sv:positions';

function getPositions() {
  try { return JSON.parse(localStorage.getItem(POS_KEY)) || {}; } catch { return {}; }
}
function savePosition(id, time, duration) {
  const pos = getPositions();
  if (duration && time > duration - 60) delete pos[id];
  else pos[id] = { t: Math.floor(time), d: Math.floor(duration || 0), at: Date.now() };
  try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch { /* private mode */ }
}

let currentVideo = null;
let currentMovieId = null;
let currentMovie = null;
let currentMediaType = 'movie';
let currentSources = [];
let currentSourceIndex = 0;
let saveTimer = null;
let embedListener = null;
let hintTimer = null;

const modal = () => document.getElementById('player-modal');
const frame = () => document.getElementById('player-frame');
const serverBox = () => document.getElementById('player-servers');

function tintAmbient(movie) {
  const el = document.getElementById('player-ambient');
  el.style.removeProperty('--ambient');
  if (!movie.poster_path) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = IMG.posterSm + movie.poster_path;
  img.onload = () => {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 8;
      const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, 8, 8);
      const d = ctx.getImageData(0, 0, 8, 8).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4;
      el.style.setProperty('--ambient', `radial-gradient(circle, rgba(${(r / n) | 0},${(g / n) | 0},${(b / n) | 0},.55), transparent 70%)`);
    } catch { /* canvas tainted — keep default glow */ }
  };
}

function standaloneUrl(movie, mediaType = 'movie') {
  const q = new URLSearchParams({ type: mediaType === 'tv' ? 'tv' : 'movie', id: String(movie.id) });
  if (mediaType === 'tv') { q.set('s', '1'); q.set('e', '1'); }
  if (movie.title || movie.name) q.set('title', movie.title || movie.name);
  if (movie.poster_path) q.set('poster', IMG.posterSm + movie.poster_path);
  return `watch.html?${q}`;
}

const framed = () => { try { return window.self !== window.top; } catch { return true; } };

function paintCredit(sourceKey = 'vidbolt') {
  const credit = CREDITS[sourceKey] || CREDITS.vidbolt;
  const c = document.getElementById('player-credit');
  if (c) {
    c.innerHTML = '';
    const a = document.createElement('a');
    a.href = credit.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = `${t('player.embedBy')} ${credit.label} — ${credit.author}`;
    c.appendChild(a);
  }
  const f = document.getElementById('footer-vidbolt-credit');
  if (f && !f.textContent) {
    f.innerHTML = '';
    const a = document.createElement('a');
    a.href = CREDITS.vidbolt.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = `${t('player.embedBy')} ${CREDITS.vidbolt.label} — ${CREDITS.vidbolt.author}`;
    f.appendChild(a);
  }
}

function clearEmbedState() {
  clearInterval(saveTimer); saveTimer = null;
  if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
  if (embedListener) { window.removeEventListener('message', embedListener); embedListener = null; }
  if (currentVideo && currentMovieId) savePosition(currentMovieId, currentVideo.currentTime, currentVideo.duration);
  currentVideo = null;
  frame().innerHTML = '';
}

function renderServerChoices(activeIndex) {
  const box = serverBox();
  if (!box) return;
  box.innerHTML = '';
  currentSources.forEach((source, index) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `server-chip ${index === activeIndex ? 'active' : ''}`;
    chip.dataset.source = String(index);
    chip.setAttribute('aria-selected', String(index === activeIndex));
    chip.setAttribute('role', 'tab');
    chip.textContent = source.label;
    chip.addEventListener('click', () => {
      if (index !== currentSourceIndex && currentMovie) mountSource(source, currentMovie, currentMediaType, index);
    });
    box.appendChild(chip);
  });
}

function postResume(iframe, source, saved) {
  if (!saved || saved.t <= 20) return;
  const messages = [
    { type: 'resume', currentTime: saved.t },
    { type: `${source.sourceKey || 'embed'}:resume`, currentTime: saved.t },
  ];
  messages.forEach((message) => {
    try { iframe.contentWindow?.postMessage(message, source.origin || '*'); } catch { /* provider may reject messages */ }
  });
}

function mountSource(source, movie, mediaType, sourceIndex) {
  clearEmbedState();
  currentSourceIndex = sourceIndex;
  document.getElementById('player-source').textContent = source.label || '';
  document.getElementById('player-keys').style.display = source.type === 'mp4' ? '' : 'none';
  renderServerChoices(sourceIndex);
  paintCredit(source.sourceKey);

  if (source.type === 'mp4' || source.type === 'hls') {
    const video = document.createElement('video');
    video.controls = true; video.autoplay = true; video.playsInline = true;
    video.src = source.url; video.setAttribute('aria-label', movie.title || movie.name || '');
    frame().appendChild(video);
    currentVideo = video;
    const saved = getPositions()[movie.id];
    if (saved && saved.t > 20) {
      video.addEventListener('loadedmetadata', () => { video.currentTime = saved.t; }, { once: true });
      import('./ui.js').then(({ toast }) => toast(t('toast.resume')));
    }
    saveTimer = setInterval(() => {
      if (!video.paused) savePosition(movie.id, video.currentTime, video.duration);
    }, 5000);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = source.url;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write');
  iframe.setAttribute('referrerpolicy', 'origin');
  iframe.title = movie.title || movie.name || 'StreamVault player';
  frame().appendChild(iframe);

  let framedNoteShown = false;
  let hint = null;
  if (framed() && getSettings().embedNotice !== false) {
    framedNoteShown = true;
    const note = document.createElement('div'); note.className = 'player-framed-note';
    const close = document.createElement('button');
    close.className = 'framed-note-close'; close.type = 'button'; close.textContent = '×';
    close.setAttribute('aria-label', t('player.framedClose'));
    close.addEventListener('click', () => { saveSettings({ embedNotice: false }); note.remove(); });
    note.appendChild(close);
    note.insertAdjacentHTML('beforeend', `<p>${t('player.framed')}</p>`);
    const go = document.createElement('a');
    go.className = 'btn btn-gold'; go.href = standaloneUrl(movie, mediaType);
    go.target = '_blank'; go.rel = 'noopener noreferrer'; go.textContent = t('player.framedBtn');
    note.appendChild(go); frame().appendChild(note);
  }
  if (!framedNoteShown) {
    hint = document.createElement('div'); hint.className = 'player-newtab-hint';
    hint.innerHTML = `<span>${t('player.iframeHint')}</span>`;
    const btn = document.createElement('a');
    btn.className = 'btn btn-gold btn-sm'; btn.href = standaloneUrl(movie, mediaType);
    btn.target = '_blank'; btn.rel = 'noopener noreferrer';
    btn.textContent = '↗ ' + t('player.standalone');
    hint.appendChild(btn); frame().appendChild(hint);
    hintTimer = setTimeout(() => hint?.classList.add('show'), 4000);
  }

  const saved = getPositions()[movie.id];
  iframe.addEventListener('load', () => {
    hint?.classList.remove('show');
    postResume(iframe, source, saved);
    const q = getSettings().quality;
    if (q && q !== 'Auto') {
      try { iframe.contentWindow?.postMessage({ type: 'quality-preference', label: q }, source.origin || '*'); } catch { /* noop */ }
    }
  });
  embedListener = (event) => {
    if (source.origin && event.origin !== source.origin) return;
    const data = event.data || {};
    const eventType = String(data.type || data.event || '').toLowerCase();
    const titleId = data.tmdbId ?? data.id ?? data.movieId ?? data.showId;
    const currentTime = Number(data.currentTime ?? data.time ?? data.position ?? 0);
    const duration = Number(data.duration ?? data.totalTime ?? 0);
    const isTimeUpdate = ['timeupdate', 'progress', `${source.sourceKey}:timeupdate`, `${source.sourceKey}:progress`].includes(eventType);
    if (isTimeUpdate && (titleId == null || String(titleId) === String(movie.id))) savePosition(movie.id, currentTime, duration);
    if (eventType === 'ended' || eventType === `${source.sourceKey}:ended`) savePosition(movie.id, 0, 0);
  };
  window.addEventListener('message', embedListener);
}

export async function openPlayer(movie, mediaType = 'movie') {
  if (await isBlockedTitle(mediaType, movie.id)) {
    const { toast } = await import('./ui.js'); toast(t('toast.blocked')); return;
  }
  const m = modal();
  currentMovie = movie; currentMovieId = movie.id; currentMediaType = mediaType;
  tintAmbient(movie); paintCredit();
  document.getElementById('player-title').textContent = movie.title || movie.name || '';
  document.getElementById('player-source').textContent = '';
  const sa = document.getElementById('player-standalone');
  if (sa) sa.href = standaloneUrl(movie, mediaType);
  frame().innerHTML = '<div class="sk" style="position:absolute;inset:0"></div>';
  m.classList.add('open'); document.body.style.overflow = 'hidden';
  recordWatch(movie, mediaType);

  try {
    currentSources = await listSources(movie.id, movie.title || movie.name || '', mediaType);
  } catch {
    currentSources = [{ type: 'iframe', url: `${VIDBOLT.base}/${mediaType === 'tv' ? `tv/${movie.id}/1/1` : `movie/${movie.id}`}`, label: 'VidBolt', sourceKey: 'vidbolt', origin: VIDBOLT.origin }];
  }
  mountSource(currentSources[0], movie, mediaType, 0);
}

export function openTrailer(movie, ytKey) {
  const m = modal(); currentMovie = movie; currentMovieId = null; currentSources = [];
  clearEmbedState(); renderServerChoices(-1); tintAmbient(movie);
  document.getElementById('player-title').textContent = `${movie.title} — ${t('modal.trailer')}`;
  document.getElementById('player-source').textContent = 'YouTube';
  document.getElementById('player-keys').style.display = 'none';
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${ytKey}?autoplay=1&rel=0`;
  iframe.setAttribute('allowfullscreen', ''); iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
  iframe.title = `${movie.title} trailer`; frame().appendChild(iframe);
  m.classList.add('open'); document.body.style.overflow = 'hidden';
}

export function closePlayer() {
  const m = modal(); if (!m || !m.classList.contains('open')) return;
  clearEmbedState(); currentVideo = null; currentMovieId = null; currentMovie = null; currentSources = [];
  const box = serverBox(); if (box) box.innerHTML = '';
  m.classList.remove('open');
  if (!document.getElementById('movie-modal').classList.contains('open')) document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  const m = modal(); if (!m || !m.classList.contains('open')) return;
  if (e.key === 'Escape') { closePlayer(); return; }
  if (!currentVideo) return;
  switch (e.key) {
    case ' ': e.preventDefault(); currentVideo.paused ? currentVideo.play() : currentVideo.pause(); break;
    case 'ArrowLeft': e.preventDefault(); currentVideo.currentTime -= 10; break;
    case 'ArrowRight': e.preventDefault(); currentVideo.currentTime += 10; break;
    case 'f': case 'F': document.fullscreenElement ? document.exitFullscreen() : frame().requestFullscreen?.(); break;
    case 'm': case 'M': currentVideo.muted = !currentVideo.muted; break;
  }
});

document.addEventListener('click', (e) => {
  const m = modal(); if (!m || !m.classList.contains('open')) return;
  if (e.target === m || e.target.closest('#player-close')) closePlayer();
});
