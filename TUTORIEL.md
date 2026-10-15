# Publier du contenu sur le site

Ce guide explique comment ajouter un **article**, une **vidéo**, une **photo** ou un **podcast** au site, hébergé sur GitHub Pages (dépôt `Alexandrelgn/blog`).

Deux interfaces web servent de panneau d'administration, utilisables depuis n'importe quel ordinateur ou téléphone :

| Interface | Pour quoi faire | Adresse |
|---|---|---|
| **L'éditeur d'articles** | Écrire un article et le publier en un clic | `articlecreator.html` sur ton site |
| **Pages CMS** | Ajouter ou modifier vidéos, photos, podcasts, et l'ordre des articles | [app.pagescms.org](https://app.pagescms.org) |

Chaque enregistrement crée un commit dans le dépôt GitHub, et GitHub Pages republie le site en 1 à 2 minutes. **Les pages et l'accueil se mettent à jour tout seuls.**

## En un coup d'œil

| Rubrique | Où ça se gère | Fichier de données |
|---|---|---|
| Écrits (articles) | Éditeur d'articles → **Publier sur GitHub** | `assets/articles/articles.json` |
| Vidéos | Pages CMS → **Vidéos** | `assets/videos/videos.json` |
| Photos | Pages CMS → **Photos (galerie)** et **Photos de l'accueil** | `assets/photos/photos.json`, `assets/photos/accueil.json` |
| Podcasts | Pages CMS → **Podcasts** | `assets/podcasts/podcasts.json` |

```
blog/
├── index.html              Accueil
├── articles.html           Page Écrits
├── videos.html             Page Vidéos
├── photos.html             Page Photos
├── podcasts.html           Page Podcasts
├── articlecreator.html     Éditeur d'articles
├── .pages.yml              Configuration des formulaires de Pages CMS
└── assets/
    ├── articles/           Pages articles + style.css + articles.json
    ├── videos/             videos.json
    ├── photos/             photos.json + accueil.json
    ├── podcasts/           podcasts.json
    └── images/             Toutes les images du site
```

---

## 0. Mise en place (une seule fois)

### a. Créer le jeton d'accès GitHub (pour l'éditeur d'articles)

1. Sur GitHub : **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access** : *Only select repositories* → `blog`.
3. **Permissions** → *Repository permissions* → **Contents : Read and write**.
4. Choisis une date d'expiration, puis **Generate token** et copie le jeton (`github_pat_…`).
5. Ouvre l'éditeur (`articlecreator.html`), carte **Publier sur le site → Réglages GitHub**, colle le jeton et clique **Enregistrer**.

Le jeton reste enregistré **dans ce navigateur uniquement** (à refaire sur chaque appareil). Ne le partage jamais ; s'il fuit, supprime-le sur GitHub. Le bouton **Oublier le jeton** l'efface du navigateur.

### b. Connecter Pages CMS

1. Va sur [app.pagescms.org](https://app.pagescms.org) et connecte-toi avec ton compte GitHub.
2. Autorise Pages CMS à accéder au dépôt `blog`, puis ouvre-le (branche `main`).
3. Les rubriques **Écrits**, **Vidéos**, **Photos (galerie)**, **Photos de l'accueil** et **Podcasts** apparaissent dans le menu : elles sont décrites par le fichier `.pages.yml`.

---

## 1. Publier un article

### a. Rédiger l'article dans l'éditeur

1. Ouvre `articlecreator.html` (en ligne : `https://alexandrelgn.github.io/blog/articlecreator.html`).
2. Remplis la carte **En-tête & Tags** :
   - **Nom court (Ariane)** : donne le nom du fichier (`Petite Ceinture` → `Petite-Ceinture.html`, sans accents ni espaces). **Garde le même nom court pour mettre à jour un article déjà publié.**
   - **Catégorie** : elle devient automatiquement un filtre sur la page Écrits (ex. `Culture`, `Société`).
   - **Titre**, **Chapeau** : le chapeau sert de résumé sur la page Écrits et sur l'accueil.
   - **Date** : écris la date complète (`3 octobre 2026`), elle s'affiche sur les cartes.
   - **Image de couverture** : elle sert de vignette sur la page Écrits et sur l'accueil. Sans couverture, c'est la première image de l'article qui est utilisée.
3. Ajoute les blocs du corps (paragraphe, image, encadré, vidéo…). Les blocs se réduisent avec leur en-tête et se déplacent par glisser-déposer.
4. Pense à **💾 Projet… → Sauver JSON** pour garder une copie modifiable de ton article.

### b. Les images de l'article

- Dans la carte **Publier sur le site**, **Envoyer une image sur le site** range l'image dans `assets/images/` et copie son chemin (`../images/nom-de-la-photo.jpg`) : colle-le dans le bloc image.
- Une image hébergée ailleurs (Cloudinary, site de presse…) s'utilise avec son adresse complète `https://…`.

> Dans l'aperçu de l'éditeur, les images en `../images/…` peuvent apparaître cassées : c'est normal, elles s'afficheront dans l'article publié.

### c. Publier

Dans la carte **Publier sur le site** :

1. Vérifie le **nom du fichier**.
2. Coche **Mettre « À la une »** si l'article doit être mis en avant.
3. Clique **🚀 Publier sur GitHub** et confirme.

L'éditeur envoie l'article dans `assets/articles/` et l'ajoute **en tête** de la liste des écrits. Si un article du même nom existe déjà, il est remplacé (mise à jour) et sa place dans la liste ne change pas.

### d. Réorganiser les articles

Dans Pages CMS → **Écrits (liste des articles)** :

- **L'ordre de la liste = l'ordre d'affichage**. L'accueil montre l'article à la une + les 2 suivants.
- **À la une** : un seul article à la fois.
- Facultatif : **Résumé**, **Catégorie** et **Vignette** remplacent ce qui est lu dans l'article.
- Supprimer une entrée retire l'article des listes (le fichier reste dans `assets/articles/`).

### e. Sans l'éditeur en ligne

**Télécharger .html** produit le même fichier : place-le dans `assets/articles/` et ajoute son nom dans Pages CMS → **Écrits**.

### f. Modifier le style de tous les articles

Tous les articles utilisent la même feuille de style : `assets/articles/style.css`. Une modification de ce fichier s'applique à tous les articles, anciens comme nouveaux.

---

## 2. Publier une vidéo

Dans Pages CMS → **Vidéos**, ajoute une entrée :

- **Lien YouTube** : le titre et la miniature sont récupérés automatiquement sur YouTube.
- **Catégorie**, **Date**, **Description** : à écrire (YouTube ne les fournit pas).
- **À la une** : met la vidéo en avant sur la page Vidéos et sur l'accueil.
- Facultatif : **Étiquettes** (affichées sous la vidéo à la une), **Titre** (remplace le titre YouTube), **Miniature**.

L'ordre de la liste = l'ordre d'affichage. L'accueil montre 2 vidéos : celle à la une puis la suivante.

---

## 3. Publier une photo

### a. Ajouter une photo à la galerie

Dans Pages CMS → **Photos (galerie)**, ajoute une entrée :

- **Photo** : envoie le fichier depuis ton ordinateur ou ton téléphone, ou choisis une photo déjà sur le site. Elle est rangée dans `assets/images/`.
- **Titre**, **Lieu et date** (ex. `Paris 12ème · 16 octobre 2025`), **Description** (affichée dans la visionneuse).
- **Catégorie** : Politique, Société, Culture ou EFJ. Les boutons de filtre de la page Photos sont créés tout seuls à partir des catégories utilisées.
- Facultatif : **Image hébergée ailleurs** (adresse Cloudinary…) à la place de la photo envoyée.

L'ordre de la liste = l'ordre d'affichage dans la galerie.

> **Nouvelle catégorie** : ajoute-la dans `.pages.yml` (choix du champ `category` des photos) et dans `CATEGORIES_PHOTOS` de `assets/photos/liste-photos.js` (nom affiché et place du bouton).

### b. Choisir les photos de l'accueil

Dans Pages CMS → **Photos de l'accueil** : les 3 photos de la section « Photographies », dans l'ordre. **La première s'affiche en grand.**

- **Adresse de l'image** : une image hébergée ailleurs (Cloudinary). C'est le plus léger à charger : les originaux de `assets/images/` sont lourds.
- ou **Photo du site** : une photo de `assets/images/`.
- **Légende** (affichée au survol), **Description**, et facultatif **Photo atténuée**.

Ajouter une photo à la galerie ne change pas l'accueil : pour la mettre en avant, ajoute-la aussi ici (et retires-en une pour en garder 3).

---

## 4. Publier un podcast

Dans Pages CMS → **Podcasts**, ajoute une entrée **en haut** de la liste :

- **Lien YouTube** : la miniature est récupérée automatiquement.
- **Série** et **Numéro d'épisode** : donnent le titre « Couper Décaler — Épisode 4 ». Sans l'un des deux, c'est le titre de la vidéo YouTube qui est utilisé.
- **Date**, **Durée** (ex. `30 min`), **Description**.
- Facultatif : **Titre** (impose un titre), **Miniature**.

L'ordre de la liste = l'ordre d'affichage. L'accueil montre les 3 premiers épisodes.

---

## 5. Tester sur ton ordinateur

Les pages lisent leurs listes dans les fichiers `.json` : elles **ne fonctionnent pas** si tu ouvres un fichier par double-clic. Pour tester, ouvre un terminal dans le dossier `blog` et lance :

```bash
npx serve .
```

Puis ouvre l'adresse affichée (en général `http://localhost:3000`).

Les modifications faites dans Pages CMS ou publiées par l'éditeur arrivent sur GitHub : pense à les récupérer sur ton ordinateur (**Fetch / Pull** dans GitHub Desktop) avant de modifier des fichiers à la main, pour éviter les conflits.

### Publier des modifications faites à la main

Depuis GitHub Desktop, ou un terminal dans le dossier `blog` :

```bash
git add .
git commit -m "Description de la modification"
git push
```

---

## 6. Pièges à éviter

- **Majuscules et minuscules** : en ligne, `Photo.JPG` et `photo.jpg` sont deux fichiers différents. Recopie les noms exactement.
- **Barres obliques** : écris toujours les chemins avec `/` (`../images/photo.jpg`), jamais avec `\`.
- **Noms de fichiers** : évite les espaces et les accents dans les noms de fichiers que tu crées (l'éditeur et l'envoi d'images s'en chargent pour toi).
- **Fichiers `.json` modifiés à la main** : une virgule ou un guillemet oublié empêche toute la liste de s'afficher. Préfère Pages CMS ; en cas de page vide, ouvre la console du navigateur (F12) pour voir l'erreur.
- **Jeton GitHub** : ne le colle jamais ailleurs que dans les réglages de l'éditeur, et supprime-le sur GitHub s'il a pu être vu.
- **Ce tutoriel est public** : comme tout le dossier, il est accessible sur le site en ligne (`/TUTORIEL.md`).
