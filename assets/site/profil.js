// ── RÉGLAGES DU PROFIL (onglet Profil du panneau, assets/site/profil.json) ──
// Lus une seule fois par page : profilReady donne l'objet du fichier, ou {} s'il manque ou est illisible.
// Chemin depuis la racine du site : script réservé aux pages à la racine (index, liens, mentions-legales).
const profilReady = fetch('assets/site/profil.json', { cache: 'no-cache' })
  .then(res => res.ok ? res.json() : {})
  .catch(() => ({}));

// ── E-MAIL DE CONTACT ──
// Les éléments marqués data-contact-email prennent l'adresse choisie : lien mailto, attribut data-email,
// et leur texte s'il n'est que l'adresse. Sans adresse valide dans le fichier, la page garde la sienne.
profilReady.then(p => {
  const email = String(p.email || '').trim();
  if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) return;
  document.querySelectorAll('[data-contact-email]').forEach(el => {
    if (el.matches('a[href^="mailto:"]')) el.href = 'mailto:' + email;
    if (el.hasAttribute('data-email')) el.dataset.email = email;
    if (!el.children.length && el.textContent.includes('@')) el.textContent = email;
  });
});
