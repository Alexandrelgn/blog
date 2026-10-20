// ── PHOTOS ──
// Utilisé par photos.html (page Photos) et index.html (section « Photographies »).
//
// La galerie est dans assets/photos/photos.json, les photos de l'accueil dans
// assets/photos/accueil.json (tous deux modifiables avec le panneau articlecreator.html, onglet Photos).
// « hidden: true » masque une photo du site ; les brouillons (drafts.json) ne sont jamais lus ici.
//
// Galerie :
// « file » est le nom exact du fichier dans assets/images/, majuscules comprises
// (ou son chemin « assets/images/… », tel que l'écrit Pages CMS après un envoi de photo).
// « category » est l'un des filtres de CATEGORIES_PHOTOS ci-dessous ; les boutons de filtre
// sont créés tout seuls à partir des catégories utilisées.
// L'ordre de la liste est l'ordre d'affichage.
// Champ facultatif : src (adresse complète d'une image hébergée ailleurs, remplace file).
//
// Accueil : les 3 photos de la section « Photographies », dans l'ordre ; la première est en grand.
// Elles peuvent être des photos de la galerie (« file ») ou des images hébergées ailleurs (« src »,
// par exemple sur Cloudinary : plus légères à charger que les originaux de assets/images/).
// « caption » est la légende affichée au survol, « alt » la description de l'image.
// Champ facultatif : faded: true affiche la photo atténuée.
const PHOTOS_DATA = 'assets/photos/photos.json';
const PHOTOS_ACCUEIL_DATA = 'assets/photos/accueil.json';

// Nom affiché sur le bouton de filtre de chaque catégorie, dans l'ordre des boutons.
// Une catégorie absente d'ici s'affiche avec son nom, après les autres.
// (Pour en ajouter une, l'ajouter aussi à PHOTO_CATEGORIES dans articlecreator.html
// et aux choix du champ « category » dans .pages.yml.)
const CATEGORIES_PHOTOS = {
  politique: "Politique",
  societe: "Société",
  culture: "Culture",
  efj: "EFJ"
};

// Chemin du dossier des photos, depuis les pages à la racine du site
const PHOTOS_DIR = 'assets/images/';

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Lit un fichier de données JSON du site (sans cache, pour voir tout de suite une publication) */
async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${path} : ${res.status}`);
  return res.json();
}

async function loadJsonList(path, what) {
  try {
    return (await loadJson(path)).filter(entry => !entry.hidden);
  } catch (e) {
    console.warn(`Liste ${what} non chargée —`, e);
    return [];
  }
}

const loadPhotos = () => loadJsonList(PHOTOS_DATA, 'des photos');
const loadPhotosAccueil = () => loadJsonList(PHOTOS_ACCUEIL_DATA, 'des photos de l\'accueil');

/** Adresse de l'image d'une entrée : « src » si présent, sinon le fichier dans assets/images/ */
function photoSrc(p) {
  if (p.src) return p.src;
  if (!p.file) return '';
  // Un chemin (« assets/images/x.jpg » ou « /assets/images/x.jpg ») est gardé tel quel, sans « / » initial
  // pour fonctionner aussi quand le site est publié dans un sous-dossier (ex. utilisateur.github.io/blog/)
  return p.file.includes('/') ? p.file.replace(/^\/+/, '') : PHOTOS_DIR + p.file;
}

/** Catégories utilisées par la liste, dans l'ordre de CATEGORIES_PHOTOS, avec leur nom affiché */
function photoCategories(photos) {
  const used = [...new Set(photos.map(p => p.category).filter(Boolean))];
  const known = Object.keys(CATEGORIES_PHOTOS).filter(c => used.includes(c));
  const others = used.filter(c => !(c in CATEGORIES_PHOTOS));
  return [...known, ...others].map(c => ({
    id: c,
    label: CATEGORIES_PHOTOS[c] || c.charAt(0).toUpperCase() + c.slice(1)
  }));
}
