// ── VIDÉOS ──
// Utilisé par videos.html (page Vidéos) et index.html (section « Reportages vidéo »).
//
// La liste des vidéos est dans assets/videos/videos.json (modifiable avec le panneau articlecreator.html).
// Le titre et la miniature sont récupérés automatiquement sur YouTube.
// La catégorie, la date et la description sont écrites dans la liste (YouTube ne les fournit pas).
// L'ordre de la liste est l'ordre d'affichage ; « featured: true » la met « À la une » (et 1re sur
// l'accueil), « top: 2 » ou « top: 3 » la met 2e ou 3e sur l'accueil.
// Champs facultatifs : title (remplace le titre YouTube), image (remplace la miniature), tags,
// hidden (true : vidéo masquée du site). Les brouillons (drafts.json) ne sont jamais lus ici.
const VIDEOS_DATA = 'assets/videos/videos.json';

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

/** Complète une entrée de la liste avec le titre et la miniature YouTube */
async function loadVideo(entry) {
  const id = youtubeId(entry.url);
  let title = entry.title || '';
  if (!title) {
    try {
      const res = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(entry.url));
      if (res.ok) title = (await res.json()).title || '';
    } catch (e) {
      console.warn('Titre YouTube non récupéré —', entry.url, e);
    }
  }
  return {
    url: entry.url,
    featured: !!entry.featured,
    top: entry.top || 0,
    title: title || 'Vidéo',
    category: entry.category || '',
    date: entry.date || '',
    description: entry.description || '',
    tags: entry.tags || [],
    image: entry.image || (id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''),
    // Toutes les vidéos n'ont pas de miniature haute définition
    imageFallback: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
  };
}

async function loadAllVideos() {
  try {
    return await Promise.all((await loadJson(VIDEOS_DATA)).filter(entry => !entry.hidden).map(loadVideo));
  } catch (e) {
    console.warn('Liste des vidéos non chargée —', e);
    return [];
  }
}

/** Balise <img> de la miniature, avec repli sur la version standard */
function videoThumbImg(v) {
  if (!v.image) return '';
  const fallback = v.imageFallback ? ` onerror="this.onerror=null;this.src='${escapeHtml(v.imageFallback)}'"` : '';
  return `<img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"${fallback} />`;
}

const PLAY_ICON_SVG = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
