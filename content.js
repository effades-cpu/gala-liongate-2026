/*
  CONTENU DE LA PRÉSENTATION, Gala LIONGATE du 28 novembre 2026
  --------------------------------------------------------------
  C'est le seul fichier à modifier pour changer le contenu (voir README.md).
  - Texte : remplacer ce qui est entre guillemets. Chaque texte existe en "fr" et en "en".
  - Image : déposer le fichier dans assets/ puis écrire son chemin, par exemple "assets/photos/cycy.webp".
  - Ne pas supprimer les virgules ni les accolades.
  - Les HORAIRES pendant la soirée viennent du Google Sheet de la MC (liveUrl). Les durées ci-dessous
    servent de plan par défaut si le Sheet n'est pas joignable.

  Mises en page d'une section (layout) :
    "logos"       logos côte à côte                       { logos: ["liongate", "drc"], text }
    "emblem"      l'emblème LIONGATE seul
    "text-image"  texte à gauche, étapes à droite         { title, text, points, progressive: true = s'allument une à une }
    "carousel"    images plein cadre en fondu             { images: [{ src, pos, name }] ou [{ pair: [a, b] }], every,
                                                            lead: n premières images seules pendant leadFor secondes, caption }
    "showcase"    produits : le produit au centre, deux sur les côtés  { title, text, items, bare: true = sans texte }
    "products"    cartes produits avec texte              { title, items: [{ name, image, text, actives }] }
    "timeline"    frise animée                            { title, items: [{ year, text }] }
    "quote"       signature + slogan                      { text }
    "clips"       vidéos à la suite, puis au hasard       { clips: [{ src, dur }] }
    "spots"       les deux spots VF puis VE, avec le son
  "duration" (secondes) : durée d'une section. "hold: true" sur une étape = reste sur la dernière section.
  "pos" d'une image : position du cadrage ("50% 10%" = visage en haut), pour garder les visages à la même hauteur.
*/
window.GALA = {
  // Lien /exec du Google Apps Script (voir DEPLOIEMENT-APPS-SCRIPT.md). Vide = horaires du plan ci-dessous.
  liveUrl: "https://script.google.com/macros/s/AKfycbwQnEQIMd4wXhjzR_DhySQ95gSGgqO9804qzS53LfkIF18-vdrLpZZIeHyZ4em9uDTYKw/exec",
  pollSeconds: 10,

  event: {
    start: "2026-11-28T17:30:00+01:00",           // début prévu de la première étape (heure de Douala)
    place: { fr: "Élites Offices, Douala", en: "Élites Offices, Douala" },
    dateLabel: { fr: "Samedi 28 novembre 2026", en: "Saturday 28 November 2026" },
    title: { fr: "Soirée de gala LIONGATE", en: "LIONGATE gala evening" },
  },

  media: {
    teasers: ["assets/video/teaser-1.mp4", "assets/video/teaser-2.mp4"],   // tournent en alternance avant le début
    teaserPoster: "assets/video/teaser-poster.jpg",
    spots: [
      { lang: "fr", label: "Version française", src: "assets/video/spot-vf.mp4", poster: "assets/video/spot-vf-poster.jpg" },
      { lang: "en", label: "English version", src: "assets/video/spot-ve.mp4", poster: "assets/video/spot-ve-poster.jpg" },
    ],
  },

  logos: {
    liongate: "assets/logos/liongate-color.png",          // thème sombre
    liongateDark: "assets/logos/liongate-color-dark.png", // thème clair (texte foncé)
    liongateEmblem: "assets/logos/liongate-emblem.png",
    drcSignature: "assets/logos/drc-signature.png",       // toujours suivi de DOROTHY ROFFAT COSMETICS en Playfair
  },

  steps: [
    {
      id: "accueil", kind: "open", duration: 30, scene: "teaser",
      title: { fr: "Accueil", en: "Welcome" },
      line: { fr: "Bienvenue. Installez-vous", en: "Welcome. Please take your seats" },
    },
    {
      id: "ouverture", kind: "talk", duration: 4, hold: true,
      title: { fr: "Ouverture", en: "Opening" },
      presenter: { name: "M. Ayissi Jean Noël", role: { fr: "", en: "" }, org: "LIONGATE" },   // FONCTION À COMPLÉTER (vide = non affichée)
      sections: [
        { layout: "carousel", duration: 240, images: [{ src: "assets/photos/panoramique.webp" }] },   // Panoramique seule (v9)
      ],
    },
    {
      id: "expansion", kind: "talk", duration: 5, hold: true,   // discours de 5 min : les sections ne bouclent pas
      title: { fr: "Pôle Expansion de marchés", en: "Market Expansion division" },
      presenter: { name: "Dr NKONDOCK Hermosa", role: { fr: "Directrice du pôle Expansion de marchés", en: "Director, Market Expansion" }, org: "LIONGATE" },
      // Source : « Discours final DRc Couloured.docx » (paragraphes en couleur = diapositives)
      sections: [
        { layout: "logos", logos: ["liongate", "drc"], duration: 125,
          text: { fr: "Ouvrir des marchés aux marques et les accompagner sur le continent africain. DRC est le premier client du pôle.", en: "Opening markets to brands and supporting them across Africa. DRC is the division's first client." } },
        { layout: "showcase", brand: "drc", duration: 45, every: 7,
          title: { fr: "My Secret Skin", en: "My Secret Skin" },
          text: { fr: "Soins formulés et fabriqués en Allemagne. Trois essentiels.", en: "Skincare formulated and made in Germany. Three essentials." },
          items: [
            { image: "assets/products/my-secret-skin/pro-primer.webp", name: "Ma Base Secrète Pro Primer" },
            { image: "assets/products/my-secret-skin/secret-jour.webp", name: "Mon Secret Jour" },
            { image: "assets/products/my-secret-skin/secret-nuit.webp", name: "Mon Secret Nuit" },
          ] },
        { layout: "showcase", brand: "drc", duration: 40, every: 5,
          title: { fr: "Inception", en: "Inception" },
          text: { fr: "Maquillage conçu et fabriqué en Italie. Fond de teint en 15 nuances.", en: "Make-up designed and made in Italy. Foundation in 15 shades." },
          items: [
            { image: "assets/products/inception/c040-fluid-foundation.webp", name: "Fond de teint fluide" },
            { image: "assets/products/inception/loose-powder-packaging.webp", name: "Poudre libre" },
            { image: "assets/products/inception/pool-eyeliner.webp", name: "Pool Liner" },
            { image: "assets/products/inception/splash-mascara.webp", name: "Splash Mascara" },
            { image: "assets/products/inception/paris-lipgloss.webp", name: "Gloss" },
            { image: "assets/products/inception/liyah-lippenstift.webp", name: "Rouge à lèvres" },
            { image: "assets/products/inception/love-blush-rouche.webp", name: "Blush" },
            { image: "assets/products/inception/lidschatten-profi-palette-open.webp", name: "Palette" },
          ] },
        { layout: "showcase", brand: "drc", duration: 35, every: 6,
          title: { fr: "Écrins en bambou, formats rechargeables", en: "Bamboo cases, refillable formats" },
          text: { fr: "Élégance, fonctionnalité et attention portée à l'environnement.", en: "Elegance, function and care for the environment." },
          items: [
            { image: "assets/products/inception/dsc-5127-flat.webp", white: true },
            { image: "assets/products/inception/dsc-5119-flat.webp", white: true },
            { image: "assets/products/inception/dsc-5116-flat.webp", white: true },
            { image: "assets/products/inception/dsc-5113-flat.webp", white: true },
          ] },
        { layout: "quote", brand: "drc", duration: 55, text: { fr: "Beauty is your nature", en: "Beauty is your nature" } },
      ],
    },
    {
      id: "it", kind: "talk", duration: 5, hold: true,
      title: { fr: "IT & Software Outsourcing", en: "IT & Software Outsourcing" },
      presenter: { name: "M. Donald Nguimfack", role: { fr: "Directeur du pôle IT & Software Outsourcing", en: "Director, IT & Software Outsourcing" }, org: "LIONGATE" },
      sections: [
        {
          layout: "text-image", duration: 300, progressive: true,
          title: { fr: "IT & Software Outsourcing", en: "IT & Software Outsourcing" },
          text: { fr: "On gère les systèmes d'information des entreprises, de l'audit à l'exploitation.", en: "We run companies' information systems, from audit to operations." },
          points: { fr: ["Audit", "Développement", "Exploitation"], en: ["Audit", "Build", "Run"] },
          image: "",
        },
      ],
    },
    {
      id: "intermede", kind: "open", duration: 3, scene: "ambient",
      title: { fr: "Intermède musical", en: "Musical interlude" },
      line: { fr: "Avec l'orchestre", en: "With the orchestra" },
      clips: [   // dans cet ordre, puis on recommence (v9)
        { src: "assets/video/kribi-dji-0262.mp4", dur: 25 },
        { src: "assets/video/kribi-c2544.mp4", dur: 9 },
        { src: "assets/video/kribi-dji-0262.mp4", dur: 25 },
        { src: "assets/video/kribi-c2475.mp4", dur: 6.5 },
        { src: "assets/video/kribi-c2468.mp4", dur: 8 },
      ],
    },
    {
      id: "vision", kind: "talk", duration: 8, brand: "drc", hold: true,   // sections en Playfair Display + Lato
      title: { fr: "Vision DRC & Présentation de la marque", en: "DRC vision & brand presentation" },
      presenter: { name: "Mme Dorothy Roffat", role: { fr: "Fondatrice", en: "Founder" }, org: "Dorothy Roffat Cosmetics" },
      sections: [
        { layout: "carousel", duration: 120, every: 10,
          images: [
            { src: "assets/photos/dorothy-roffat.webp", pos: "50% 30%" },
            { src: "assets/photos/dorothy-roffat-2.webp", pos: "50% 30%" },
            { src: "assets/photos/dorothy-act.webp", pos: "50% 25%" },
            { src: "assets/photos/drc-pic.webp", pos: "50% 50%" },
            { src: "assets/photos/showroom-1.webp", pos: "50% 50%" },
            { src: "assets/photos/showroom-2.webp", pos: "50% 50%" },
          ] },
        {
          layout: "timeline", duration: 45,
          title: { fr: "Une marque allemande fondée par Dorothy Roffat, née à Mfou", en: "A German brand founded by Dorothy Roffat, born in Mfou" },
          items: [
            { year: "2013", text: { fr: "Création de la marque", en: "Brand founded" } },
            { year: "2017", text: { fr: "Lancement Inception", en: "Inception launched" } },
            { year: "2021", text: { fr: "Lancement de Secret Skin", en: "Secret Skin launched" } },
            { year: "2026", text: { fr: "Arrivée au Cameroun avec LIONGATE", en: "Arrival in Cameroon with LIONGATE" } },
          ],
        },
        { layout: "clips", duration: 285, loop: true,   // dans l'ordre, répétés tant qu'il reste du temps (v9)
          caption: { fr: "Mai 2026, Kribi, Cameroun", en: "May 2026, Kribi, Cameroon" },
          clips: [
            { src: "assets/video/kribi-c2581.mp4", dur: 25 },
            { src: "assets/video/kribi-c2585.mp4", dur: 16 },
            { src: "assets/video/kribi-c2598.mp4", dur: 9 },
            { src: "assets/video/kribi-dji-0255.mp4", dur: 35 },
          ] },
        { layout: "quote", duration: 30, text: { fr: "Beauty is your nature", en: "Beauty is your nature" } },   // logo DRC doré + slogan, tenu
      ],
    },
    {
      id: "spot", kind: "talk", duration: 4, brand: "drc", hold: true,   // étape à part entière depuis v9
      title: { fr: "Projection du spot", en: "Screening of the spot" },
      presenter: { name: "Mme Dorothy Roffat", role: { fr: "Fondatrice", en: "Founder" }, org: "Dorothy Roffat Cosmetics" },
      sections: [{ layout: "spots" }],
    },
    {
      id: "cloture", kind: "talk", duration: 5,
      title: { fr: "Clôture", en: "Closing words" },
      presenter: { name: "M. le Gouverneur de la Région du Littoral", monogram: "", role: { fr: "Gouverneur de la Région du Littoral", en: "Governor of the Littoral Region" }, org: "Région du Littoral" },
      sections: [
        { layout: "logos", logos: ["liongate", "drc"], text: { fr: "Merci de votre présence", en: "Thank you for being with us" } },
      ],
    },
    {
      id: "cocktail", kind: "open", duration: 145, scene: "teaser",
      title: { fr: "Cocktail dînatoire", en: "Cocktail reception" },
      line: { fr: "Merci d'être avec nous ce soir.", en: "Thank you for joining us tonight." },
    },
  ],

  footer: {
    site: "liongate.cm",
    note: { fr: "LIONGATE SARL, Douala. Distributeur exclusif de Dorothy Roffat Cosmetics au Cameroun.", en: "LIONGATE SARL, Douala. Exclusive distributor of Dorothy Roffat Cosmetics in Cameroon." },
  },
};
