// ── PODCASTS ──
// Utilisé par podcasts.html (page Podcasts) et index.html (section « Podcasts »).
//
// La liste des épisodes est dans assets/podcasts/podcasts.json (modifiable avec le panneau articlecreator.html).
// La miniature est récupérée automatiquement sur YouTube.
// Le titre est « Série — Épisode N » quand series et episode sont remplis ;
// sinon c'est le titre de la vidéo YouTube.
// L'ordre de la liste est l'ordre d'affichage. L'accueil montre d'abord les épisodes choisis
// (« featured: true » 1er, « top: 2 » et « top: 3 »), puis les premiers de la liste.
// Champs facultatifs : title (remplace le titre), image (remplace la miniature),
// hidden (true : épisode masqué du site). Les brouillons (drafts.json) ne sont jamais lus ici.
const PODCASTS_DATA = 'assets/podcasts/podcasts.json';

/** Lit un fichier de données JSON du site (sans cache, pour voir tout de suite une publication) */
async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${path} : ${res.status}`);
  return res.json();
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Identifiant YouTube d'un lien youtu.be, youtube.com/watch, /shorts/ ou /embed/ */
function youtubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.replace(/^www\./, '') === 'youtu.be') return u.pathname.slice(1).split('/')[0];
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/').filter(Boolean);
    const i = parts.findIndex(p => p === 'shorts' || p === 'embed' || p === 'live');
    return i !== -1 ? parts[i + 1] || '' : '';
  } catch (e) {
    return '';
  }
}

/** Complète une entrée de la liste avec le titre et la miniature */
async function loadPodcast(entry) {
  const id = youtubeId(entry.url);
  const hasEpisode = entry.episode != null && entry.episode !== '';
  let title = entry.title || (entry.series && hasEpisode ? `${entry.series} — Épisode ${entry.episode}` : '');
  if (!title && id) {
    try {
      const res = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(entry.url));
      if (res.ok) title = (await res.json()).title || '';
    } catch (e) {
      console.warn('Titre YouTube non récupéré —', entry.url, e);
    }
  }
  title = title || entry.series || 'Épisode';
  return {
    url: entry.url,
    featured: !!entry.featured,
    top: entry.top || 0,
    title,
    series: entry.series || '',
    episode: hasEpisode ? String(entry.episode) : '',
    date: entry.date || '',
    duration: entry.duration || '',
    description: entry.description || '',
    image: entry.image || (id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : ''),
    // « Couper Décaler Ep3 », ou le titre s'il n'y a pas de numéro d'épisode
    alt: entry.series && hasEpisode ? `${entry.series} Ep${entry.episode}` : title
  };
}

async function loadAllPodcasts() {
  try {
    return await Promise.all((await loadJson(PODCASTS_DATA)).filter(entry => !entry.hidden).map(loadPodcast));
  } catch (e) {
    console.warn('Liste des podcasts non chargée —', e);
    return [];
  }
}

const PODCAST_PLAY_SVG = '<svg viewBox="0 0 10 10"><polygon points="2,1 9,5 2,9"/></svg>';
