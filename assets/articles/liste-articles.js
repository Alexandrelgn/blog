// ── LISTE DES ARTICLES ──
// Utilisée par articles.html (page Écrits) et index.html (section « Reportages écrits »).
//
// Pour publier un article : déposer le fichier dans assets/articles/ puis ajouter son nom ici.
// Titre, catégorie, chapeau, date, durée de lecture et image sont lus directement dans l'article.
// L'ordre de la liste est l'ordre d'affichage ; « featured: true » le met « À la une ».
// Champs facultatifs pour remplacer ce qui est lu dans l'article : excerpt, image, category.
const articles = [
  { file: "1.html", featured: true },
  { file: "Diplomatie-Une-nuit-pour-sauver-Paris.html" },
  { file: "Diplomatie-Interview-de-la-troupe.html" },
  { file: "L-Opéra-Comique-fait-peau-neuve.html" },
  { file: "100-made-in-opera-et-for-opera.html" },
  { file: "RS-mai-juin-2026.html" },
  { file: "2.html" }
];

// Chemin du dossier des articles, depuis les pages à la racine du site
const ARTICLES_DIR = 'assets/articles/';

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugify(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Lit les informations d'un article à partir de son HTML */
async function loadArticle(entry) {
  const url = new URL(ARTICLES_DIR + entry.file, location.href);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${entry.file} : ${res.status}`);
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
  const text = (sel) => (doc.querySelector(sel)?.textContent || '').replace(/\s+/g, ' ').trim();

  // « Lieu · Date · Durée de lecture »
  const metaParts = text('.byline-meta').split('·').map(s => s.trim()).filter(Boolean);
  const img = doc.querySelector('img.cover-ph');
  const imgSrc = entry.image || img?.getAttribute('src');

  return {
    href: url.href,
    featured: !!entry.featured,
    title: text('.art-title') || doc.title,
    category: entry.category || text('.art-cat'),
    excerpt: entry.excerpt || text('.art-intro'),
    date: metaParts[1] || '',
    readTime: (metaParts[2] || '').replace(/\s*de lecture$/i, ''), // « 8 min de lecture » → « 8 min »
    image: imgSrc ? new URL(imgSrc, url).href : '',
    imageAlt: img?.getAttribute('alt') || ''
  };
}

/** Charge tous les articles de la liste, dans l'ordre ; ceux qui échouent sont ignorés */
async function loadAllArticles() {
  const results = await Promise.allSettled(articles.map(loadArticle));
  results.filter(r => r.status === 'rejected').forEach(r => console.warn('Article non chargé —', r.reason));
  return results.filter(r => r.status === 'fulfilled').map(r => r.value);
}

/** Message affiché quand aucun article n'a pu être lu */
function articlesErrorMessage() {
  return location.protocol === 'file:'
    ? "Les articles ne peuvent pas être lus quand la page est ouverte directement depuis le disque. Ouvre-la via le site en ligne ou un serveur local."
    : "Aucun article n'a pu être chargé.";
}
