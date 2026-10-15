// ── ARTICLES ──
// Utilisé par articles.html (page Écrits) et index.html (section « Reportages écrits »).
//
// La liste des articles est dans assets/articles/articles.json (modifiable avec Pages CMS,
// ou publiée directement par le bouton « Publier sur GitHub » de articlecreator.html).
// Chaque entrée donne le nom du fichier de l'article ; titre, catégorie, chapeau, date, durée
// de lecture et image sont lus directement dans l'article.
// L'ordre de la liste est l'ordre d'affichage ; « featured: true » le met « À la une ».
// Champs facultatifs pour remplacer ce qui est lu dans l'article : excerpt, image, category.
const ARTICLES_DATA = 'assets/articles/articles.json';

/** Lit un fichier de données JSON du site (sans cache, pour voir tout de suite une publication) */
async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${path} : ${res.status}`);
  return res.json();
}

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
    // Lien sans « .html » : GitHub Pages sert « article » à partir du fichier « article.html »
    href: url.href.replace(/\.html$/, ''),
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
  let articles;
  try {
    articles = await loadJson(ARTICLES_DATA);
  } catch (e) {
    console.warn('Liste des articles non chargée —', e);
    return [];
  }
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
