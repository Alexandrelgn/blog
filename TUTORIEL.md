# Publier du contenu sur le site

Ce guide explique comment ajouter un **article**, une **vidéo**, une **photo** ou un **podcast**, puis comment mettre le site en ligne sur GitHub Pages.

## En un coup d'œil

| Rubrique | Ce que tu modifies | Accueil mis à jour tout seul ? |
|---|---|---|
| Écrits (articles) | Le fichier de l'article + une ligne dans `assets/articles/liste-articles.js` | Oui |
| Vidéos | Un bloc dans `assets/videos/liste-videos.js` | Oui |
| Photos | Une ligne dans `assets/photos/liste-photos.js` (+ la photo dans `assets/images/`) | Les 3 photos de l'accueil se choisissent dans le même fichier (`photosAccueil`) |
| Podcasts | Un bloc dans `assets/podcasts/liste-podcasts.js` | Oui |

Organisation des dossiers utiles :

```
blog/
├── index.html              Accueil
├── articles.html           Page Écrits
├── videos.html             Page Vidéos
├── photos.html             Page Photos
├── podcasts.html           Page Podcasts
├── articlecreator.html     Éditeur d'articles
└── assets/
    ├── articles/           Les pages articles + style.css + liste-articles.js
    ├── videos/             liste-videos.js
    ├── photos/             liste-photos.js
    ├── podcasts/           liste-podcasts.js
    └── images/             Toutes les images du site
```

---

## 1. Publier un article

### a. Rédiger l'article dans l'éditeur

1. Ouvre `articlecreator.html` dans ton navigateur.
2. Remplis la carte **En-tête & Tags** :
   - **Nom court (Ariane)** : sert aussi de nom au fichier téléchargé. Préfère un nom simple, sans espaces (ex. `Petite-Ceinture`).
   - **Catégorie** : elle devient automatiquement un filtre sur la page Écrits (ex. `Culture`, `Société`).
   - **Titre**, **Chapeau** : le chapeau sert de résumé sur la page Écrits et sur l'accueil.
   - **Date** : écris la date complète (`3 octobre 2026`), elle s'affiche sur les cartes.
   - **Image de couverture** : c'est elle qui sert de vignette sur la page Écrits et sur l'accueil. Sans couverture, c'est la première image de l'article qui est utilisée.
3. Ajoute les blocs du corps (paragraphe, image, encadré, vidéo…). Les blocs se réduisent avec leur en-tête et se déplacent par glisser-déposer.
4. Pense à **💾 Projet… → Sauver JSON** pour garder une copie modifiable de ton article.

### b. Les images de l'article

- Dépose les images dans `assets/images/`.
- Dans l'éditeur, écris leur chemin sous la forme **`../images/nom-de-la-photo.jpg`** (l'article sera rangé dans `assets/articles/`, d'où le `../`).
- Une image hébergée ailleurs (Cloudinary, site de presse…) s'utilise avec son adresse complète `https://…`.

> Dans l'aperçu de l'éditeur, les images en `../images/…` peuvent apparaître cassées : c'est normal, elles s'afficheront une fois l'article dans son dossier.

### c. Mettre l'article sur le site

1. Clique sur **Télécharger .html**.
2. Place le fichier dans `assets/articles/`.
3. Ouvre `assets/articles/liste-articles.js` et ajoute une ligne avec le nom exact du fichier :

   ```js
   const articles = [
     { file: "1.html", featured: true },
     { file: "Petite-Ceinture.html" },   // ← nouvel article
     { file: "Diplomatie-Une-nuit-pour-sauver-Paris.html" },
     ...
   ];
   ```

   - **L'ordre de la liste = l'ordre d'affichage.** Place l'article là où tu veux qu'il apparaisse.
   - **`featured: true`** met l'article « À la une » (un seul à la fois).
   - Facultatif : `excerpt: "…"` remplace le chapeau sur les cartes, `image: "…"` remplace la vignette, `category: "…"` remplace la catégorie.

C'est tout : la page Écrits et l'accueil (l'article à la une + les 2 suivants) se mettent à jour seuls.

### d. Modifier le style de tous les articles

Tous les articles utilisent la même feuille de style : `assets/articles/style.css`. Une modification de ce fichier s'applique à tous les articles, anciens comme nouveaux.

---

## 2. Publier une vidéo

Les vidéos sont hébergées sur YouTube. Ouvre `assets/videos/liste-videos.js` et ajoute un bloc :

```js
{
  url: "https://youtu.be/XXXXXXXXXXX",
  category: "Reportage",
  date: "12 octobre 2026",
  description: "Une ou deux phrases pour présenter la vidéo."
},
```

- **Le titre et la miniature sont récupérés automatiquement sur YouTube.**
- La catégorie, la date et la description sont à écrire (YouTube ne les fournit pas).
- L'ordre de la liste = l'ordre d'affichage ; `featured: true` met la vidéo « À la une ».
- Facultatif : `title: "…"` remplace le titre YouTube, `image: "…"` remplace la miniature, `tags: ["Mode", "Paris"]` affiche des étiquettes sous la vidéo à la une.

La page Vidéos et l'accueil (2 vidéos : celle à la une puis la suivante) se mettent à jour seuls.

> Attention aux virgules : chaque bloc `{ … }` est suivi d'une virgule, sauf éventuellement le dernier.

---

## 3. Publier une photo

Tout se passe dans `assets/photos/liste-photos.js`, qui sert à la fois à la page Photos et à l'accueil.

### a. Ajouter la photo à la galerie

1. Dépose la photo dans `assets/images/` (ex. `IMG_2450.JPG`).
2. Ouvre `assets/photos/liste-photos.js` et ajoute une ligne dans `const photos = [` :

   ```js
   { file: "IMG_2450.JPG", title: "Titre de la photo", meta: "Lieu · 12 octobre 2026", category: "societe", alt: "Description de la photo pour la visionneuse et l'accessibilité." },
   ```

   - **`file`** : le nom exact du fichier, **majuscules comprises** (`IMG_2450.JPG` ≠ `IMG_2450.jpg` en ligne).
   - **`category`** : `politique`, `societe`, `culture` ou `efj` (sans accent ni majuscule). Les boutons de filtre de la page Photos sont créés tout seuls à partir des catégories utilisées.
   - **L'ordre de la liste = l'ordre d'affichage** dans la galerie.
   - Facultatif : `src: "https://…"` pour une image hébergée ailleurs (Cloudinary…), à la place de `file`.

   Pour créer une nouvelle catégorie, utilise-la simplement dans `category` (ex. `"sport"`) : le bouton apparaît tout seul. Pour choisir son nom affiché (accents, majuscules) et sa place parmi les boutons, ajoute-la aussi dans `CATEGORIES_PHOTOS`, plus bas dans le même fichier :

   ```js
   const CATEGORIES_PHOTOS = {
     politique: "Politique",
     ...
     sport: "Sport"
   };
   ```

### b. Choisir les photos de l'accueil

Les 3 photos de la section « Photographies » de l'accueil sont dans `const photosAccueil = [`, juste en dessous. **La première s'affiche en grand.**

```js
{ src: "https://res.cloudinary.com/…/photo.jpg", alt: "Description de l'image", caption: "Légende affichée au survol" },
{ file: "IMG_2450.JPG", alt: "Description de l'image", caption: "Légende affichée au survol" },
```

- `src` : une image hébergée ailleurs (Cloudinary). C'est le plus léger à charger : les originaux de `assets/images/` sont lourds.
- `file` : une photo de `assets/images/`, comme dans la galerie.
- Facultatif : `faded: true` affiche la photo atténuée.

Ajouter une photo à la galerie ne change pas l'accueil : pour la mettre en avant, ajoute-la aussi dans `photosAccueil` (et retires-en une pour en garder 3).

---

## 4. Publier un podcast

Les épisodes sont hébergés sur YouTube. Ouvre `assets/podcasts/liste-podcasts.js` et ajoute un bloc **en haut** de la liste :

```js
{
  url: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  series: "Couper Décaler",
  episode: 4,
  date: "24 février 2026",
  duration: "30 min",
  description: "Quatrième épisode du podcast Couper Décaler."
},
```

- **La miniature est récupérée automatiquement sur YouTube.**
- **Le titre** est fabriqué à partir de la série et du numéro : « Couper Décaler — Épisode 4 ». Sans `series` ou sans `episode`, c'est le titre de la vidéo YouTube qui est utilisé.
- La date, la durée et la description sont à écrire (YouTube ne les fournit pas).
- L'ordre de la liste = l'ordre d'affichage.
- Facultatif : `title: "…"` impose un titre, `image: "…"` remplace la miniature.

La page Podcasts (tous les épisodes) et l'accueil (les 3 premiers de la liste) se mettent à jour seuls.

---

## 5. Mettre le site en ligne (GitHub Pages)

### Tester avant de publier

Les pages Écrits et Accueil lisent les fichiers des articles : elles **ne fonctionnent pas** si tu ouvres le fichier par double-clic. Pour tester sur ton ordinateur, ouvre un terminal dans le dossier `blog` et lance :

```bash
npx serve .
```

Puis ouvre l'adresse affichée (en général `http://localhost:3000`).

### Publier

Depuis GitHub Desktop ou un terminal dans le dossier `blog` :

```bash
git add .
git commit -m "Nouvel article : Petite Ceinture"
git push
```

Le site est mis à jour sur GitHub Pages en une à deux minutes.

---

## 6. Pièges à éviter

- **Majuscules et minuscules** : en ligne, `Photo.JPG` et `photo.jpg` sont deux fichiers différents. Recopie les noms exactement.
- **Barres obliques** : écris toujours les chemins avec `/` (`../images/photo.jpg`), jamais avec `\`.
- **Noms de fichiers** : évite les espaces et les accents dans les noms de fichiers que tu crées (`Petite-Ceinture.html` plutôt que `Petite Ceinture.html`).
- **Virgules et guillemets** dans les fichiers `.js` : une virgule ou un guillemet oublié empêche toute la liste de s'afficher. En cas de page vide, ouvre la console du navigateur (F12) pour voir l'erreur.
- **Ce tutoriel est public** : comme tout le dossier, il est accessible sur le site en ligne (`/TUTORIEL.md`).
