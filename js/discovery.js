/* ============================================================================
   StreamVault — discovery.js
   Category-first discovery: reels/shorts, popular people and actionable
   provider/network/studio collections.
   ============================================================================ */

import { IMG } from './config.js';
import { getPopularPeople, getPerson, getBrandTitles, getShorts } from './api.js';
import {
  gradientPoster, movieCard, openMovieModal, escapeHtml, observeChildren,
} from './ui.js';

const titleOf = (item) => item.title || item.name || `TMDB #${item.id}`;
const mediaTypeOf = (item) => item.media_type || item.mediaType || (item.first_air_date || item.name ? 'tv' : 'movie');

function normalizeTitle(item) {
  const copy = { ...item };
  copy.title = titleOf(copy);
  copy.media_type = mediaTypeOf(copy);
  copy.release_date = copy.release_date || copy.first_air_date || '';
  return copy;
}

function imageOrFallback(path, title, size = IMG.posterSm) {
  return path ? size + path : gradientPoster(title, ['#312E81', '#0B0B0F']);
}

function emptyState(text) {
  const el = document.createElement('p');
  el.className = 'discovery-empty';
  el.textContent = text;
  return el;
}

function reelTile(item, index) {
  const movie = normalizeTitle(item);
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'reel-tile reveal-child';
  tile.style.setProperty('--reveal-delay', `${(index % 8) * 55}ms`);
  tile.setAttribute('aria-label', `Open ${movie.title}`);
  tile.innerHTML = `
    <span class="reel-poster">
      <img loading="lazy" alt="${escapeHtml(movie.title)}" src="${imageOrFallback(movie.poster_path, movie.title)}">
      <span class="reel-shade"></span>
      <span class="reel-play" aria-hidden="true">▶</span>
      <span class="reel-badge">${index % 3 === 0 ? 'SHORT' : 'REEL'}</span>
    </span>
    <span class="reel-info"><b>${escapeHtml(movie.title)}</b><small>${movie.release_date.slice(0, 4) || 'Quick pick'} · ${movie.vote_average ? movie.vote_average.toFixed(1) : 'HD'}</small></span>`;
  tile.querySelector('img').addEventListener('error', (event) => {
    event.currentTarget.src = gradientPoster(movie.title, ['#9D174D', '#0B0B0F']);
  }, { once: true });
  tile.addEventListener('click', () => openMovieModal(movie.id, tile, movie.media_type));
  return tile;
}

function personTile(person, index) {
  const name = person.name || 'Unknown performer';
  const knownFor = person.known_for?.[0]?.title || person.known_for?.[0]?.name || person.known_for_department || 'Film & TV';
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'person-tile reveal-child';
  tile.style.setProperty('--reveal-delay', `${(index % 8) * 55}ms`);
  tile.setAttribute('aria-label', `See titles featuring ${name}`);
  tile.innerHTML = `
    <span class="person-photo"><img loading="lazy" alt="${escapeHtml(name)}" src="${imageOrFallback(person.profile_path, name, IMG.profile)}"></span>
    <span class="person-info"><b>${escapeHtml(name)}</b><small>Known for ${escapeHtml(knownFor)}</small></span>`;
  tile.querySelector('img').addEventListener('error', (event) => {
    event.currentTarget.src = gradientPoster(name, ['#0E7490', '#0B0B0F']);
  }, { once: true });
  tile.addEventListener('click', () => openPerson(person));
  return tile;
}

export async function renderReels() {
  const rail = document.getElementById('reel-rail');
  if (!rail) return;
  try {
    const data = await getShorts();
    const items = (data.results || []).filter((item) => item.poster_path || item.title || item.name).slice(0, 18);
    rail.innerHTML = '';
    if (!items.length) { rail.appendChild(emptyState('Short picks will appear here soon.')); return; }
    items.forEach((item, index) => rail.appendChild(reelTile(item, index)));
    observeChildren(rail);
  } catch {
    rail.innerHTML = '';
    rail.appendChild(emptyState('Short picks are unavailable right now.'));
  }
}

export async function renderPeople() {
  const rail = document.getElementById('people-rail');
  if (!rail) return;
  try {
    const data = await getPopularPeople();
    const people = (data.results || []).filter((person) => person.name).slice(0, 18);
    rail.innerHTML = '';
    if (!people.length) { rail.appendChild(emptyState('Popular actors will appear here soon.')); return; }
    people.forEach((person, index) => rail.appendChild(personTile(person, index)));
    observeChildren(rail);
  } catch {
    rail.innerHTML = '';
    rail.appendChild(emptyState('The stars are off camera for a moment.'));
  }
}

function collectionShell({ title, subtitle, image = '', eyebrow = 'Collection' }) {
  const modal = document.getElementById('collection-modal');
  modal.innerHTML = `
    <div class="collection-shell">
      <button class="collection-close" data-close-collection aria-label="Close collection">×</button>
      <header class="collection-head">
        ${image ? `<img class="collection-avatar" src="${image}" alt="">` : '<span class="collection-mark">✦</span>'}
        <div><span class="eyebrow"><i>${escapeHtml(eyebrow)}</i></span><h2>${escapeHtml(title)}</h2><p class="muted">${escapeHtml(subtitle)}</p></div>
      </header>
      <div class="collection-status" aria-live="polite">Loading titles…</div>
      <div class="collection-grid"></div>
    </div>`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('[data-close-collection]').addEventListener('click', closeCollection);
  return modal;
}

function renderCollectionTitles(modal, items, emptyText = 'No titles were found for this collection.') {
  const status = modal.querySelector('.collection-status');
  const grid = modal.querySelector('.collection-grid');
  const unique = [];
  (items || []).forEach((item) => {
    const normalized = normalizeTitle(item);
    if (normalized.id && !unique.some((entry) => entry.id === normalized.id)) unique.push(normalized);
  });
  status.textContent = unique.length ? `${unique.length} titles in this collection` : emptyText;
  grid.innerHTML = '';
  if (!unique.length) return;
  unique.slice(0, 30).forEach((movie, index) => {
    const card = movieCard(movie, { revealChild: true });
    card.style.setProperty('--reveal-delay', `${Math.min(index, 11) * 35}ms`);
    card.addEventListener('click', () => closeCollection(), { once: true });
    grid.appendChild(card);
  });
  observeChildren(grid);
}

export async function openBrandCollection(brand) {
  if (!brand) return;
  const kind = brand.entityType === 'provider' ? 'Streaming provider'
    : brand.entityType === 'network' ? 'TV network' : 'Movie studio';
  const modal = collectionShell({
    title: brand.name,
    subtitle: `Titles connected to ${brand.name}. Choose one to see details and play it.`,
    eyebrow: kind,
  });
  try {
    const data = await getBrandTitles(brand);
    renderCollectionTitles(modal, data.results || []);
  } catch {
    renderCollectionTitles(modal, []);
  }
}

export async function openPerson(person) {
  if (!person) return;
  const name = person.name || 'Actor';
  const image = person.profile_path ? IMG.poster + person.profile_path : '';
  const modal = collectionShell({
    title: name,
    subtitle: `Explore movies and shows featuring ${name}.`,
    image,
    eyebrow: 'Top actor',
  });
  try {
    const detail = await getPerson(person.id, name);
    const cast = detail.combined_credits?.cast || [];
    const crew = detail.combined_credits?.crew || [];
    const credits = [...cast, ...crew]
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv' || item.title || item.name)
      .sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
    renderCollectionTitles(modal, credits, `No filmography is available for ${name} yet.`);
  } catch {
    renderCollectionTitles(modal, []);
  }
}

export function closeCollection() {
  const modal = document.getElementById('collection-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.innerHTML = '';
  if (!document.getElementById('movie-modal')?.classList.contains('open')
      && !document.getElementById('player-modal')?.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

export function initDiscovery() {
  window.addEventListener('sv:brand', (event) => openBrandCollection(event.detail));
  const modal = document.getElementById('collection-modal');
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeCollection();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('collection-modal')?.classList.contains('open')) {
      closeCollection();
    }
  });
  renderReels();
  renderPeople();
}
