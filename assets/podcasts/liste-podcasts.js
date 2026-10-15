// ── LISTE DES PODCASTS ──
// Utilisée par podcasts.html (page Podcasts) et index.html (section « Podcasts »).
//
// Pour publier un épisode : ajouter un bloc en haut de la liste avec son lien YouTube.
// La miniature est récupérée automatiquement sur YouTube.
// Le titre est « Série — Épisode N » quand series et episode sont remplis ;
// sinon c'est le titre de la vidéo YouTube.
// L'ordre de la liste est l'ordre d'affichage ; l'accueil montre les 3 premiers.
// Champs facultatifs : title (remplace le titre), image (remplace la miniature).
const podcasts = [
  {
    url: "https://www.youtube.com/watch?v=8rCrq1sVjwo",
    series: "Couper Décaler",
    episode: 3,
    date: "17 février 2026",
    duration: "28 min",
    description: "Troisième épisode du podcast Couper Décaler."
  },
  {
    url: "https://www.youtube.com/watch?v=UT0QundaYUE",
    series: "Couper Décaler",
    episode: 2,
    date: "10 février 2026",
    duration: "29 min",
    description: "Deuxième épisode du podcast Couper Décaler."
  },
  {
    url: "https://www.youtube.com/watch?v=Z0bNbQMPD7U",
    series: "Couper Décaler",
    episode: 1,
    date: "2 février 2026",
    duration: "18 min",
    description: "Premier épisode du podcast Couper Décaler."
  }
];

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

function loadAllPodcasts() {
  return Promise.all(podcasts.map(loadPodcast));
}

const PODCAST_PLAY_SVG = '<svg viewBox="0 0 10 10"><polygon points="2,1 9,5 2,9"/></svg>';
