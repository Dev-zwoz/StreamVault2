/* ============================================================================
   StreamVault — brands.js
   Discovery rails for the services and studios viewers recognize first.
   Logos are loaded from Simple Icons with a readable text fallback, so a
   blocked image host never leaves an empty tile.
   ============================================================================ */

export const BRAND_GROUPS = [
  {
    id: 'networks',
    title: 'TV Networks',
    subtitle: 'Find the worlds behind your favorite shows.',
    brands: [
      { name: 'Netflix', icon: 'netflix', mark: 'N', color: '#e50914' },
      { name: 'Disney+', icon: 'disneyplus', mark: 'D+', color: '#113ccf' },
      { name: 'Prime Video', icon: 'primevideo', mark: 'prime', color: '#00a8e1' },
      { name: 'Apple TV+', icon: 'appletv', mark: 'tv', color: '#111111' },
      { name: 'Max', icon: 'hbo', mark: 'max', color: '#7437d7' },
      { name: 'Hulu', icon: 'hulu', mark: 'hulu', color: '#1ce783' },
      { name: 'Paramount+', icon: 'paramountplus', mark: 'P+', color: '#0064ff' },
      { name: 'Peacock', icon: 'peacock', mark: 'peacock', color: '#151515' },
      { name: 'Crunchyroll', icon: 'crunchyroll', mark: 'C', color: '#f47521' },
      { name: 'Tubi', icon: 'tubi', mark: 'tubi', color: '#7414d5' },
      { name: 'Shudder', icon: 'shudder', mark: 'S', color: '#e50914' },
      { name: 'AMC+', icon: 'amc', mark: 'AMC+', color: '#0d6f80' },
      { name: 'STARZ', icon: 'starz', mark: 'STARZ', color: '#b31336' },
      { name: 'MUBI', icon: 'mubi', mark: 'MUBI', color: '#111111' },
    ],
  },
  {
    id: 'studios',
    title: 'Movie Studios',
    subtitle: 'Browse the names behind the big screen.',
    brands: [
      { name: 'Marvel Studios', icon: 'marvel', mark: 'MARVEL', color: '#ed1d24' },
      { name: 'Pixar', icon: 'pixar', mark: 'PIXAR', color: '#00a8d6' },
      { name: 'Warner Bros.', icon: 'warnerbros', mark: 'WB', color: '#0067b1' },
      { name: 'Universal', icon: 'universal', mark: 'UNIVERSAL', color: '#0aa7af' },
      { name: 'Disney', icon: 'disney', mark: 'Disney', color: '#113ccf' },
      { name: 'Paramount', icon: 'paramount', mark: 'P', color: '#0064ff' },
      { name: 'DC', icon: 'dc', mark: 'DC', color: '#0476c9' },
      { name: 'Lucasfilm', icon: 'lucasfilm', mark: 'L', color: '#f1d900' },
      { name: 'A24', icon: 'a24', mark: 'A24', color: '#080808' },
      { name: 'Studio Ghibli', icon: 'studioghibli', mark: 'GHIBLI', color: '#0d81ac' },
      { name: 'Blumhouse', icon: 'blumhouse', mark: 'BH', color: '#ec1d25' },
      { name: 'DreamWorks', icon: 'dreamworks', mark: 'DW', color: '#05a985' },
      { name: 'Nickelodeon', icon: 'nickelodeon', mark: 'nick', color: '#ff7900' },
      { name: 'Lionsgate', icon: 'lionsgate', mark: 'LIONSGATE', color: '#e31c2b' },
    ],
  },
  {
    id: 'platforms',
    title: 'Streaming Platforms',
    subtitle: 'One vault, every screen.',
    brands: [
      { name: 'Netflix', icon: 'netflix', mark: 'N', color: '#e50914' },
      { name: 'Prime Video', icon: 'primevideo', mark: 'prime', color: '#00a8e1' },
      { name: 'Disney+', icon: 'disneyplus', mark: 'D+', color: '#113ccf' },
      { name: 'Max', icon: 'hbo', mark: 'max', color: '#7437d7' },
      { name: 'Apple TV+', icon: 'appletv', mark: 'tv', color: '#111111' },
      { name: 'Paramount+', icon: 'paramountplus', mark: 'P+', color: '#0064ff' },
      { name: 'Peacock', icon: 'peacock', mark: 'peacock', color: '#151515' },
      { name: 'Crunchyroll', icon: 'crunchyroll', mark: 'C', color: '#f47521' },
      { name: 'Tubi', icon: 'tubi', mark: 'tubi', color: '#7414d5' },
      { name: 'YouTube', icon: 'youtube', mark: '▶', color: '#ff0000' },
      { name: 'MUBI', icon: 'mubi', mark: 'MUBI', color: '#111111' },
      { name: 'Kanopy', icon: 'kanopy', mark: 'K', color: '#1f8f5f' },
    ],
  },
];

// TMDB IDs make every tile actionable: a provider opens titles available on
// that service, a network opens its TV catalogue, and a studio opens its film
// catalogue. The visual rail still works if a provider changes its catalogue.
const BRAND_META = {
  networks: {
    Netflix: ['network', 213], 'Disney+': ['network', 2739], 'Prime Video': ['network', 1024],
    'Apple TV+': ['network', 2552], Max: ['network', 49], Hulu: ['network', 453],
    'Paramount+': ['network', 4330], Peacock: ['network', 3353], Crunchyroll: ['network', 1112],
    Tubi: ['network', 256], Shudder: ['network', 1236], 'AMC+': ['network', 174],
    STARZ: ['network', 318], MUBI: ['network', 1641],
  },
  studios: {
    'Marvel Studios': ['company', 420], Pixar: ['company', 3], 'Warner Bros.': ['company', 174],
    Universal: ['company', 33], Disney: ['company', 2], Paramount: ['company', 4],
    DC: ['company', 9993], Lucasfilm: ['company', 1], A24: ['company', 41077],
    'Studio Ghibli': ['company', 10342], Blumhouse: ['company', 3172], DreamWorks: ['company', 521],
    Nickelodeon: ['company', 790], Lionsgate: ['company', 1632],
  },
  platforms: {
    Netflix: ['provider', 8], 'Prime Video': ['provider', 9], 'Disney+': ['provider', 337],
    Max: ['provider', 1899], 'Apple TV+': ['provider', 350], 'Paramount+': ['provider', 2303],
    Peacock: ['provider', 386], Crunchyroll: ['provider', 283], Tubi: ['provider', 73],
    YouTube: ['provider', 192], MUBI: ['provider', 11], Kanopy: ['provider', 191],
  },
};
BRAND_GROUPS.forEach((group) => group.brands.forEach((brand) => {
  const meta = BRAND_META[group.id]?.[brand.name];
  if (meta) { brand.entityType = meta[0]; brand.tmdbId = meta[1]; }
}));

function brandTile(brand, index) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'brand-tile reveal-child';
  tile.style.setProperty('--brand-color', brand.color);
  tile.style.setProperty('--reveal-delay', `${(index % 8) * 45}ms`);
  tile.setAttribute('aria-label', `${brand.name} catalogue`);
  tile.title = `Browse ${brand.name}`;

  const logo = document.createElement('span');
  logo.className = 'brand-logo';
  logo.setAttribute('aria-hidden', 'true');
  const fallback = document.createElement('span');
  fallback.className = 'brand-fallback';
  fallback.textContent = brand.mark;
  logo.appendChild(fallback);

  if (brand.icon) {
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.src = `https://cdn.simpleicons.org/${brand.icon}/ffffff`;
    img.addEventListener('load', () => {
      fallback.hidden = true;
      img.hidden = false;
    });
    img.addEventListener('error', () => {
      img.remove();
      fallback.hidden = false;
    });
    img.hidden = true;
    logo.appendChild(img);
  }

  const name = document.createElement('span');
  name.className = 'brand-name';
  name.textContent = brand.name;
  tile.append(logo, name);
  tile.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('sv:brand', { detail: brand }));
  });
  return tile;
}

export function renderBrandRails() {
  BRAND_GROUPS.forEach((group) => {
    const rail = document.getElementById(`brand-${group.id}`);
    if (!rail) return;
    rail.innerHTML = '';
    group.brands.forEach((brand, index) => rail.appendChild(brandTile(brand, index)));
  });
  document.querySelectorAll('.brand-rail').forEach((rail) => {
    rail.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaY;
    }, { passive: false });
  });
}
