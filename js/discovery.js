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

// Paint from local records first. The live TMDB request can replace these
// later, but a slow/empty network response must never leave a discovery rail
// looking unfinished. Every title uses an id that also exists in the local
// public-domain map, so its card can reach the player offline.
const LOCAL_REEL_SEED = [
  { id: 10331, title: 'Night of the Living Dead', release_date: '1968-10-04', vote_average: 7.6, gradient: ['#3B0764', '#0F172A'], _quickPick: true },
  { id: 3085, title: 'His Girl Friday', release_date: '1940-01-18', vote_average: 7.4, gradient: ['#92400E', '#1C1917'], _quickPick: true },
  { id: 15856, title: 'House on Haunted Hill', release_date: '1959-01-01', vote_average: 6.7, gradient: ['#134E4A', '#0B0B0F'], _quickPick: true },
  { id: 16093, title: 'Carnival of Souls', release_date: '1962-11-02', vote_average: 6.9, gradient: ['#4C1D95', '#111827'], _quickPick: true },
  { id: 20367, title: 'Detour', release_date: '1945-11-30', vote_average: 7.2, gradient: ['#1E3A8A', '#0B0B0F'], _quickPick: true },
  { id: 20246, title: 'The Stranger', release_date: '1946-06-02', vote_average: 7.2, gradient: ['#7F1D1D', '#111827'], _quickPick: true },
  { id: 24452, title: 'The Little Shop of Horrors', release_date: '1960-05-04', vote_average: 6.3, gradient: ['#14532D', '#0B0B0F'], _quickPick: true },
  { id: 10513, title: 'Plan 9 from Outer Space', release_date: '1957-03-15', vote_average: 4.2, gradient: ['#312E81', '#0B0B0F'], _quickPick: true },
  { id: 18398, title: 'Suddenly', release_date: '1954-09-17', vote_average: 6.4, gradient: ['#78350F', '#111827'], _quickPick: true },
  { id: 653, title: 'Nosferatu', release_date: '1922-02-16', vote_average: 7.7, gradient: ['#0C4A6E', '#0B0B0F'], _quickPick: true },
];

const LOCAL_PEOPLE_SEED = [
  { id: 3223, name: 'Millie Bobby Brown', profile_path: '/kHO7hdNEVuTnQ0OjjrxP1RcAa0e.jpg', known_for: [{ title: 'Stranger Things' }] },
  { id: 46012, name: 'Yu Aoi', profile_path: '/xxZuHK0Be3caq3iTe03rbfzC5xB.jpg', known_for: [{ title: 'Space Pirate Captain Harlock' }] },
  { id: 13539, name: 'Morena Baccarin', profile_path: '/4gyHyg6FJ1oFczOm5pmMkdEEo2J.jpg', known_for: [{ title: 'Deadpool' }] },
  { id: 1121, name: 'Robert Pattinson', profile_path: '/3qZ09UE7lN6AtorfXFRYpEtSY93.jpg', known_for: [{ title: 'The Batman' }] },
  { id: 2963, name: 'Nicolas Cage', profile_path: '/y1RtezurZYveYkVNRht7CwEgSYY.jpg', known_for: [{ title: 'The Croods' }] },
  { id: 90633, name: 'Gal Gadot', profile_path: '/AbXKtWQwuDiwhoQLh34VRglwuBE.jpg', known_for: [{ title: 'Wonder Woman' }] },
  { id: 234352, name: 'Margot Robbie', profile_path: '/8LqG2N6j98lFGMpuYsRUAhOunSd.jpg', known_for: [{ title: 'Barbie' }] },
  { id: 30614, name: 'Ryan Gosling', profile_path: '/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg', known_for: [{ title: 'La La Land' }] },
  { id: 500, name: 'Tom Cruise', profile_path: '/8qBylLlWJ6Wzp6i3LzMCXkP3J1v.jpg', known_for: [{ title: 'Top Gun: Maverick' }] },
  { id: 287, name: 'Brad Pitt', profile_path: '/cckcYc2v0yh1tc9QjRelptcOBko.jpg', known_for: [{ title: 'Fight Club' }] },
];

function normalizeTitle(item) {
  const copy = { ...item };
  copy.title = titleOf(copy);
  copy.media_type = mediaTypeOf(copy);
  copy.release_date = copy.release_date || copy.first_air_date || '';
  return copy;
}

function imageOrFallback(path, title, size = IMG.posterSm, gradient) {
  return path ? size + path : gradientPoster(title, gradient || ['#312E81', '#0B0B0F']);
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
      <img loading="lazy" alt="${escapeHtml(movie.title)}" src="${imageOrFallback(movie.poster_path, movie.title, IMG.posterSm, movie.gradient)}">
      <span class="reel-shade"></span>
      <span class="reel-play" aria-hidden="true">▶</span>
      <span class="reel-badge">${movie._quickPick ? 'QUICK' : 'SHORT'}</span>
    </span>
    <span class="reel-info"><b>${escapeHtml(movie.title)}</b><small>${movie.release_date.slice(0, 4) || 'Quick pick'} · ${movie.vote_average ? movie.vote_average.toFixed(1) : 'HD'}</small></span>`;
  tile.querySelector('img').addEventListener('error', (event) => {
    event.currentTarget.src = gradientPoster(movie.title, ['#9D174D', '#0B0B0F']);
  }, { once: true });
  tile.addEventListener('click', () => openMovieModal(movie.id, tile, movie.media_type, movie));
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

function paintReels(rail, items) {
  rail.innerHTML = '';
  items.filter((item) => item.id && (item.poster_path || item.title || item.name || item.gradient))
    .slice(0, 18)
    .forEach((item, index) => rail.appendChild(reelTile(item, index)));
  observeChildren(rail);
}

function paintPeople(rail, people) {
  rail.innerHTML = '';
  people.filter((person) => person.id && person.name).slice(0, 18)
    .forEach((person, index) => rail.appendChild(personTile(person, index)));
  observeChildren(rail);
}

export async function renderReels() {
  const rail = document.getElementById('reel-rail');
  if (!rail) return;
  // Synchronous first paint from real local title records.
  paintReels(rail, LOCAL_REEL_SEED);
  try {
    const data = await getShorts();
    const items = (data.results || []).filter((item) => item.id && (item.poster_path || item.title || item.name || item.gradient));
    if (items.length) paintReels(rail, items);
  } catch { /* seeded cards stay visible */ }
}

export async function renderPeople() {
  const rail = document.getElementById('people-rail');
  if (!rail) return;
  // The people catalogue is local too, so portraits/filmography entry points
  // exist while the live popular-people request is still in flight.
  paintPeople(rail, LOCAL_PEOPLE_SEED);
  try {
    const data = await getPopularPeople();
    const people = (data.results || []).filter((person) => person.id && person.name);
    if (people.length) paintPeople(rail, people);
  } catch { /* seeded people stay visible */ }
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
