/* ============================================================================
   StreamVault — watch.js
   The standalone player page (watch.html). Everything else on the site lives in
   nested frames (preview panels, in-app browsers) where browsers refuse to run
   third-party embeds — a top-level page like this one is allowed to play.
   Opens with:  watch.html?type=movie&id=550&title=Fight%20Club
                watch.html?type=tv&id=1399&s=1&e=1&title=Game%20of%20Thrones
   ============================================================================ */

import { CREDITS, VIDBOLT } from './config.js';
import { t, getLang, applyI18n } from './i18n.js';
import { listSources } from './archive.js';
import { getSettings } from './account.js';
import { isBlockedTitle } from './content.js';

const POS_KEY = 'sv:positions';
const el = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

const state = {
  type: params.get('type') === 'tv' ? 'tv' : 'movie',
  id: params.get('id') || '',
  season: Number(params.get('s') || 1),
  episode: Number(params.get('e') || 1),
  title: params.get('title') || '',
  sources: [],
  index: 0,
  video: null,
  timer: null,
  messageHandler: null,
};

// ---------------------------------------------------------------------------
// Resume positions (same storage key the in-site player writes)
// ---------------------------------------------------------------------------
function getPositions() {
  try { return JSON.parse(localStorage.getItem(POS_KEY)) || {}; } catch { return {}; }
}
function savePosition(time, duration) {
  const pos = getPositions();
  const key = String(state.id);
  if (duration && time > duration - 60) delete pos[key];
  else pos[key] = { t: Math.floor(time), d: Math.floor(duration || 0), at: Date.now(), type: state.type, title: state.title };
  try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch { /* private mode */ }
}

// ---------------------------------------------------------------------------
// Chrome
// ---------------------------------------------------------------------------
function label(source) {
  if (source.sourceKey === 'archive') return t('player.source.archive');
  if (source.sourceKey === 'vidbolt') return t('player.source.vidbolt');
  return source.label || t('watch.source');
}

function creditMarkup(source) {
  const provider = CREDITS[source?.sourceKey] || CREDITS.vidbolt;
  const bolt = source?.sourceKey === 'vidbolt' ? ''
    : ` · VidBolt: <a href="${CREDITS.vidbolt.url}" target="_blank" rel="noopener noreferrer">${CREDITS.vidbolt.label}</a>`;
  return `HD embed by <a href="${provider.url}" target="_blank" rel="noopener noreferrer">${provider.label} — ${provider.author}</a>${bolt}
    · <a href="${CREDITS.archive.url}" target="_blank" rel="noopener noreferrer">${CREDITS.archive.label}</a>
    · <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>`;
}

function paintChrome() {
  applyI18n();
  document.documentElement.lang = getLang();
  const name = state.title || `TMDB #${state.id}`;
  document.title = `${name} — StreamVault`;
  el('watch-title').textContent = name;
  el('watch-sub').textContent = state.type === 'tv'
    ? t('watch.episode').replace('{s}', state.season).replace('{e}', state.episode)
    : (state.id ? `TMDB #${state.id}` : '');
  el('watch-boot-text').textContent = t('watch.loading');
  el('watch-back').textContent = t('watch.back');
  el('watch-note').textContent = t('watch.hint');

  const box = el('watch-sources');
  box.innerHTML = state.sources.map((s, i) => `
    <button role="tab" class="watch-source-chip ${i < 2 ? 'watch-chip' : 'watch-server-chip'} ${i === state.index ? 'active' : ''}" data-src="${i}"
      aria-selected="${i === state.index}">${label(s)}</button>`).join('');
  box.querySelectorAll('[data-src]').forEach((b) => b.addEventListener('click', () => load(Number(b.dataset.src))));

  const active = state.sources[state.index];
  el('watch-credit').innerHTML = creditMarkup(active);
}

// ---------------------------------------------------------------------------
// Sources → frame
// ---------------------------------------------------------------------------
function load(i) {
  const s = state.sources[i];
  if (!s) return;
  state.index = i;
  if (state.messageHandler) {
    window.removeEventListener('message', state.messageHandler);
    state.messageHandler = null;
  }
  const box = el('watch-frame');
  const embedLink = el('watch-embed');
  embedLink.hidden = false;
  embedLink.href = s.url;
  embedLink.title = t('player.newtab');
  embedLink.textContent = '↗';
  document.querySelectorAll('.watch-source-chip').forEach((b) => {
    const on = Number(b.dataset.src) === i;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
  });
  el('watch-credit').innerHTML = creditMarkup(s);

  clearInterval(state.timer);
  if (state.video) savePosition(state.video.currentTime, state.video.duration);
  state.video = null;

  if (s.type === 'mp4' || s.type === 'hls') {
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = params.get('poster') || '';
    video.src = s.url;
    box.innerHTML = '';
    box.appendChild(video);
    state.video = video;
    const saved = getPositions()[String(state.id)];
    if (saved && saved.t > 20) video.addEventListener('loadedmetadata', () => { video.currentTime = saved.t; });
    state.timer = setInterval(() => {
      if (state.video && !state.video.paused) savePosition(state.video.currentTime, state.video.duration);
    }, 5000);
    return;
  }

  // Embed server — no sandbox attribute, full permissions, top-level context.
  const iframe = document.createElement('iframe');
  iframe.src = s.url;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write');
  iframe.referrerPolicy = 'origin';
  iframe.title = state.title || 'StreamVault player';
  box.innerHTML = '';
  box.appendChild(iframe);

  const saved = getPositions()[String(state.id)];
  const origin = s.origin || '*';
  iframe.addEventListener('load', () => {
    if (saved && saved.t > 20) {
      try {
        iframe.contentWindow?.postMessage({ type: 'resume', currentTime: saved.t }, origin);
        iframe.contentWindow?.postMessage({ type: `${s.sourceKey || 'embed'}:resume`, currentTime: saved.t }, origin);
      } catch { /* provider may reject messages */ }
    }
    // Pin quality if the user chose one in Settings (same as the in-site player)
    try {
      const q = getSettings().quality;
      if (q && q !== 'Auto') iframe.contentWindow?.postMessage({ type: 'quality-preference', label: q }, origin);
    } catch { /* settings unavailable in this runtime */ }
  });
  state.messageHandler = (e) => {
    if (s.origin && e.origin !== s.origin) return;
    const data = e.data || {};
    const eventType = String(data.type || data.event || '').toLowerCase();
    const currentTime = Number(data.currentTime ?? data.time ?? data.position ?? 0);
    const duration = Number(data.duration ?? data.totalTime ?? 0);
    const isTimeUpdate = ['timeupdate', 'progress', `${s.sourceKey}:timeupdate`, `${s.sourceKey}:progress`].includes(eventType);
    if (isTimeUpdate) savePosition(currentTime, duration);
    if (eventType === 'ended' || eventType === `${s.sourceKey}:ended`) savePosition(0, 0);
  };
  window.addEventListener('message', state.messageHandler);
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
(async function boot() {
  paintChrome();
  if (!state.id) {
    el('watch-frame').innerHTML = `<p class="watch-empty">${t('watch.notfound')}</p>`;
    return;
  }
  // Content policy: LGBT-themed titles stay excluded on the standalone page too
  if (await isBlockedTitle(state.type, state.id)) {
    el('watch-frame').innerHTML = `<p class="watch-empty">${t('toast.blocked')}</p>`;
    return;
  }
  try {
    state.sources = await listSources(state.id, state.title, state.type, state.season, state.episode);
  } catch (err) {
    console.warn('[StreamVault] source lookup failed:', err.message);
    state.sources = [{ type: 'iframe', url: `${VIDBOLT.base}/${state.type === 'tv' ? `tv/${state.id}/${state.season}/${state.episode}` : `movie/${state.id}`}`, label: 'VidBolt · HD', sourceKey: 'vidbolt', origin: VIDBOLT.origin }];
  }
  state.index = 0;
  paintChrome();
  load(0);
})();
