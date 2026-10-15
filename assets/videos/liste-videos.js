// ── LISTE DES VIDÉOS ──
// Utilisée par videos.html (page Vidéos) et index.html (section « Reportages vidéo »).
//
// Pour publier une vidéo : ajouter une ligne avec son lien YouTube.
// Le titre et la miniature sont récupérés automatiquement sur YouTube.
// La catégorie, la date et la description sont à écrire ici (YouTube ne les fournit pas).
// L'ordre de la liste est l'ordre d'affichage ; « featured: true » la met « À la une ».
// Champs facultatifs : title (remplace le titre YouTube), image (remplace la miniature), tags.
const videos = [
  {
    url: "https://youtu.be/bUumyKAdm0w",
    featured: true,
    category: "Portrait · Interview",
    date: "24 novembre 2025",
    description: "Rencontre avec un mannequin parisien sur son parcours, les coulisses du secteur et les questions d'identité dans l'industrie de la mode. Un portrait humain au cœur d'un monde peu connu.",
    tags: ["Mode", "Portrait", "Paris"]
  },
  {
    url: "https://youtu.be/uyvNkkosqoM",
    category: "Reportage",
    date: "17 février 2026",
    description: "A la rencontre du rappeur He4tDem qui pond un morceau sous nos yeux, il revient sur sa façon de travailler et son parcours tout ca dans la joie et la bonne humeur."
  },
  {
    url: "https://youtu.be/PqDhAMX6BFE",
    category: "Reportage",
    date: "5 mars 2026",
    description: "Ancien réseau de transport de marchandises, la Petite Ceinture illustre aujourd'hui pleinement les enjeux de la gestion urbaine. À la veille des élections municipales, quel avenir pour cette friche ?..."
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

function loadAllVideos() {
  return Promise.all(videos.map(loadVideo));
}

/** Balise <img> de la miniature, avec repli sur la version standard */
function videoThumbImg(v) {
  if (!v.image) return '';
  const fallback = v.imageFallback ? ` onerror="this.onerror=null;this.src='${escapeHtml(v.imageFallback)}'"` : '';
  return `<img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;"${fallback} />`;
}

const PLAY_ICON_SVG = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
