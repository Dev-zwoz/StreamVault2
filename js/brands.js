/* ============================================================================
   StreamVault — brands.js
   Discovery rails for the services and studios viewers recognize first.
   Direct TMDB logo_path assets are the primary images. Simple Icons and a
   readable text mark remain local fallbacks so a blocked image host never
   leaves an empty tile.
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
      { name: 'HBO', icon: 'hbo', mark: 'HBO', color: '#4c2a9a' },
      { name: 'FX', icon: 'fx', mark: 'FX', color: '#111111' },
      { name: 'AMC', icon: 'amc', mark: 'AMC', color: '#0d6f80' },
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
      { name: 'Columbia Pictures', icon: 'columbia', mark: 'COLUMBIA', color: '#2d65b8' },
      { name: 'Sony Pictures', icon: 'sony', mark: 'SONY', color: '#0d4e91' },
      { name: 'Disney', icon: 'disney', mark: 'Disney', color: '#113ccf' },
      { name: 'Paramount', icon: 'paramount', mark: 'P', color: '#0064ff' },
      { name: 'A24', icon: 'a24', mark: 'A24', color: '#080808' },
      { name: 'Lionsgate', icon: 'lionsgate', mark: 'LIONSGATE', color: '#e31c2b' },
      { name: 'DreamWorks', icon: 'dreamworks', mark: 'DW', color: '#05a985' },
      { name: '20th Century Studios', icon: '20thcenturyfox', mark: '20th', color: '#0e5b8d' },
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
      { name: 'Hulu', icon: 'hulu', mark: 'hulu', color: '#1ce783' },
      { name: 'Apple TV+', icon: 'appletv', mark: 'tv', color: '#111111' },
      { name: 'Paramount+', icon: 'paramountplus', mark: 'P+', color: '#0064ff' },
      { name: 'Peacock', icon: 'peacock', mark: 'peacock', color: '#151515' },
      { name: 'Crunchyroll', icon: 'crunchyroll', mark: 'C', color: '#f47521' },
      { name: 'HBO', icon: 'hbo', mark: 'HBO', color: '#4c2a9a' },
      { name: 'FX', icon: 'fx', mark: 'FX', color: '#111111' },
      { name: 'AMC', icon: 'amc', mark: 'AMC', color: '#0d6f80' },
    ],
  },
];

// TMDB logo assets make the rails recognizable even before a live API response
// arrives. These are the direct logo_path values returned by TMDB's provider,
// network, and production-company records (not text approximations).
const BRAND_LOGOS = {
  Netflix: '/wwemzKWzjKYJFfCeiB57q3r4Bcm.png',
  'Prime Video': '/w7HfLNm9CWwRmAMU58udl2L7We7.png',
  'Disney+': '/1edZOYAfoyZyZ3rklNSiUpXX30Q.png',
  Max: '/nmU0UMDJB3dRRQSTUqawzF2Od1a.png',
  Hulu: '/pqUTCleNUiTLAVlelGxUgWn1ELh.png',
  'Paramount+': '/fi83B1oztoS47xxcemFdPMhIzK.png',
  Peacock: '/gIAcGTjKKr0KOHL5s4O36roJ8p7.png',
  'Apple TV+': '/bngHRFi794mnMq34gfVcm9nDxN1.png',
  Crunchyroll: '/qqyXcZlJQKlRmAD1TCKV7mGLQlt.png',
  HBO: '/tuomPhY2UtuPTqqFnKMVHvSb724.png',
  FX: '/aexGjtcs42DgRtZh7zOxayiry4J.png',
  AMC: '/pmvRmATOCaDykE6JrVoeYxlFHw3.png',
  Universal: '/8lvHyhjr8oUKOOy2dKXoALWKdp0.png',
  'Warner Bros.': '/zhD3hhtKB5qyv7ZeL4uLpNxgMVU.png',
  'Columbia Pictures': '/71BqEFAF4V3qjjMPCpLuyJFB9A.png',
  'Sony Pictures': '/xAb1o9HrSvKBo9mnXC8fJKDNu00.png',
  Paramount: '/jay6WcMgagAklUt7i9Euwj1pzTF.png',
  Disney: '/wdrCwmRnLFJhEoH8GSfymY85KHT.png',
  A24: '/1ZXsGaFPgrgS6ZZGS37AqD5uU12.png',
  Lionsgate: '/cisLn1YAUuptXVBa0xjq7ST9cH0.png',
  'Marvel Studios': '/hUzeosd33nzE5MCNsZxCGEKTXaQ.png',
  Pixar: '/1TjvGVDMYsj6JBxOAkUHpPEwLf7.png',
  DreamWorks: '/3BPX5VGBov8SDqTV7wC1L1xShAS.png',
  '20th Century Studios': '/nM2MfoMqzJQRiSynsDabOtFKetD.png',
};

// TMDB IDs make every tile actionable: a provider opens titles available on
// that service, a network opens its TV catalogue, and a studio opens its film
// catalogue. The visual rail still works if a provider changes its catalogue.
const BRAND_META = {
  networks: {
    Netflix: ['network', 213], 'Disney+': ['network', 2739], 'Prime Video': ['network', 1024],
    'Apple TV+': ['network', 2552], Max: ['network', 49], Hulu: ['network', 453],
    'Paramount+': ['network', 4330], Peacock: ['network', 3353], Crunchyroll: ['network', 1112],
    Tubi: ['network', 256], Shudder: ['network', 1236], 'AMC+': ['network', 174],
    HBO: ['network', 49], FX: ['network', 88], AMC: ['network', 174],
    STARZ: ['network', 318], MUBI: ['network', 1641],
  },
  studios: {
    'Marvel Studios': ['company', 420], Pixar: ['company', 3], 'Warner Bros.': ['company', 174],
    Universal: ['company', 33], Disney: ['company', 2], Paramount: ['company', 4],
    DC: ['company', 9993], Lucasfilm: ['company', 1], A24: ['company', 41077],
    'Studio Ghibli': ['company', 10342], Blumhouse: ['company', 3172], DreamWorks: ['company', 521],
    Nickelodeon: ['company', 790], Lionsgate: ['company', 1632], '20th Century Studios': ['company', 25],
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
  if (BRAND_LOGOS[brand.name]) brand.logo_path = BRAND_LOGOS[brand.name];
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

  if (brand.logo_path || brand.icon) {
    const img = document.createElement('img');
    img.alt = `${brand.name} logo`;
    img.loading = 'lazy';
    img.hidden = true;
    const direct = brand.logo_path ? `https://image.tmdb.org/t/p/w300${brand.logo_path}` : '';
    const simple = `https://cdn.simpleicons.org/${brand.icon}/ffffff`;
    let triedSimple = false;
    img.src = direct || simple;
    img.addEventListener('load', () => {
      fallback.hidden = true;
      img.hidden = false;
    });
    img.addEventListener('error', () => {
      if (direct && !triedSimple) {
        triedSimple = true;
        img.src = simple;
        return;
      }
      img.remove();
      fallback.hidden = false;
    });
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
