/*
  CONTENU DE LA PRÉSENTATION · Gala LIONGATE du 28 novembre 2026
  --------------------------------------------------------------
  C'est le seul fichier à modifier pour changer le contenu (voir README.md).
  - Texte : remplacer ce qui est entre guillemets. Chaque texte existe en "fr" et en "en".
  - Image : déposer le fichier dans assets/ puis écrire son chemin, par exemple "assets/photos/DSC08017.webp".
  - Ne pas supprimer les virgules ni les accolades.
  - Les HORAIRES pendant la soirée viennent du Google Sheet de la MC (liveUrl). Les durées ci-dessous
    servent de plan par défaut si le Sheet n'est pas joignable.

  Mises en page d'une section (layout) :
    "logos"          logos côte à côte                    { logos: ["liongate", "drc"], title, text }
    "logo-alternate" logo LIONGATE noir sur clair / original sur foncé, en alternance douce
    "title"          grand titre                          { kicker, title, text }
    "text-image"     texte à gauche, image à droite       { title, text, points, image }
    "carousel"       images qui défilent seules en boucle { title, images: [...], every: secondes }
    "products"       cartes produits qui défilent         { title, items: [{ name, image, text, actives }] }
    "timeline"       frise                                { title, items: [{ year, text }] }
    "quote"          citation                             { text, by }
    "spots"          les deux spots VF puis VE, avec le son
  "duration" (secondes) : durée d'une section. Sans durée, les sections se partagent le temps de l'étape.
*/
window.GALA = {
  // Lien /exec du Google Apps Script (voir DEPLOIEMENT-APPS-SCRIPT.md). Vide = horaires du plan ci-dessous.
  liveUrl: "",
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
    liongate: "assets/logos/liongate-color.png",        // original, sur fond foncé
    liongateBlack: "assets/logos/liongate-black.png",   // noir, sur fond clair
    liongateEmblem: "assets/logos/liongate-emblem.png",
    drc: "assets/logos/drc-gold.png",                    // Dorothy Roffat doré, avec la ligne « Dorothy Roffat Cosmetics »
    drcSignature: "assets/logos/drc-signature-gold.png",
  },

  steps: [
    {
      id: "accueil", kind: "open", duration: 30, scene: "teaser",
      title: { fr: "Accueil et photocall", en: "Welcome and photocall" },
      line: { fr: "Bienvenue. Installez-vous, la soirée commence bientôt.", en: "Welcome. Please take your seats, the evening starts shortly." },
    },
    {
      id: "ouverture", kind: "talk", duration: 4,
      title: { fr: "Ouverture", en: "Opening" },
      presenter: { name: "M. Ayissi Jean Noël", role: { fr: "Fonction à compléter", en: "Title to be confirmed" }, org: "LIONGATE" },
      sections: [
        { layout: "logos", logos: ["liongate", "drc"], title: { fr: "LIONGATE reçoit Dorothy Roffat Cosmetics", en: "LIONGATE welcomes Dorothy Roffat Cosmetics" } },
      ],
    },
    {
      id: "marketing", kind: "talk", duration: 4,
      title: { fr: "Le département Marketing et Communication", en: "The Marketing and Communications department" },
      presenter: { name: "M. Désiré Effa", role: { fr: "Responsable Marketing et Communication", en: "Head of Marketing and Communications" }, org: "LIONGATE" },
      sections: [
        { layout: "logo-alternate" },
      ],
    },
    {
      id: "expansion", kind: "talk", duration: 2,
      title: { fr: "Pôle Expansion de marchés", en: "Market Expansion division" },
      presenter: { name: "Dr NKONDOCK Hermosa", role: { fr: "Directrice du pôle Expansion de marchés", en: "Director, Market Expansion" }, org: "LIONGATE" },
      // À REMPLACER par les indications de section envoyées par le propriétaire
      sections: [
        {
          layout: "text-image",
          title: { fr: "Pôle Expansion de marchés", en: "Market Expansion" },
          text: { fr: "On accompagne les marques qui veulent s'installer sur les marchés africains, de l'étude de marché jusqu'au rayon.", en: "We help brands enter African markets, from market research to the shelf." },
          points: { fr: ["Analyse du marché", "Conformité", "Distribution", "Animation"], en: ["Market analysis", "Compliance", "Distribution", "Activation"] },
          image: "",
        },
      ],
    },
    {
      id: "it", kind: "talk", duration: 5,
      title: { fr: "IT & Software Outsourcing", en: "IT & Software Outsourcing" },
      presenter: { name: "M. Donald Nguimfack", role: { fr: "Directeur du pôle IT & Software Outsourcing", en: "Director, IT & Software Outsourcing" }, org: "LIONGATE" },
      sections: [
        {
          layout: "text-image",
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
      images: ["assets/photos/dsc08156-5.webp", "assets/photos/dsc08022.webp", "assets/photos/dsc09008.webp", "assets/photos/dsc08053.webp", "assets/photos/dsc08127.webp"],
    },
    {
      id: "vision", kind: "talk", duration: 8,
      title: { fr: "Vision DRC & Présentation de la marque", en: "DRC vision & brand presentation" },
      presenter: { name: "Mme Dorothy Roffat", role: { fr: "Fondatrice de Dorothy Roffat Cosmetics", en: "Founder, Dorothy Roffat Cosmetics" }, org: "Dorothy Roffat Cosmetics" },
      // À COMPLÉTER avec le texte et les indications du propriétaire
      sections: [
        { layout: "quote", text: { fr: "Beauty is your nature", en: "Beauty is your nature" }, by: "Dorothy Roffat Cosmetics", duration: 45 },
        {
          layout: "timeline", duration: 60,
          title: { fr: "Une marque allemande fondée par Dorothy Roffat, née à Mfou", en: "A German brand founded by Dorothy Roffat, born in Mfou" },
          items: [
            { year: "2013", text: { fr: "Création de la marque", en: "Brand founded" } },
            { year: "2017", text: { fr: "Premières ventes", en: "First sales" } },
            { year: "2021", text: { fr: "Lancement de Secret Skin", en: "Secret Skin launched" } },
            { year: "2026", text: { fr: "Arrivée au Cameroun avec LIONGATE", en: "Arrival in Cameroon with LIONGATE" } },
          ],
        },
        {
          layout: "carousel", every: 6, duration: 60,
          title: { fr: "La campagne Dorothy Roffat Cosmetics", en: "The Dorothy Roffat Cosmetics campaign" },
          images: ["assets/photos/cycy.webp", "assets/photos/dsc08156-5.webp", "assets/photos/freddy.webp", "assets/photos/dsc08017.webp", "assets/photos/dsc08105.webp", "assets/photos/dsc08053.webp", "assets/photos/dsc08063.webp", "assets/photos/dsc09008.webp", "assets/photos/dsc07951.webp", "assets/photos/dsc08127.webp"],
        },
        {
          layout: "products", every: 12, duration: 120,
          title: { fr: "Secret Skin · le soin, fabriqué en Allemagne", en: "Secret Skin · skincare, made in Germany" },
          items: [
            { name: "Ma Base Secrète Pro Primer", image: "assets/products/my-secret-skin/pro-primer.webp",
              text: { fr: "Un soin actif sous le maquillage. Affine le grain et régule le sébum sans boucher les pores.", en: "An active primer. Refines skin texture and controls shine without clogging pores." },
              actives: { fr: ["Argent colloïdal", "Acide lactique", "Silice naturelle"], en: ["Colloidal silver", "Lactic acid", "Natural silica"] } },
            { name: "Mon Secret Jour", image: "assets/products/my-secret-skin/secret-jour.webp",
              text: { fr: "Le jus d'aloe vera natif remplace l'eau. Texture légère, sans film gras.", en: "Native aloe vera juice replaces water. Light texture, no greasy film." },
              actives: { fr: ["Aloe vera natif", "Acide hyaluronique", "Esters végétaux"], en: ["Native aloe vera", "Hyaluronic acid", "Plant esters"] } },
            { name: "Mon Secret Nuit", image: "assets/products/my-secret-skin/secret-nuit.webp",
              text: { fr: "Un soin enveloppant pour la nuit, quand la peau se répare le mieux.", en: "A rich night cream for the hours when skin repairs itself best." },
              actives: { fr: ["Aloe vera", "Acide hyaluronique", "Huile de ricin"], en: ["Aloe vera", "Hyaluronic acid", "Castor oil"] } },
          ],
        },
        {
          layout: "carousel", every: 5, duration: 90, fit: "contain",
          title: { fr: "Inception · le maquillage, fabriqué en Italie", en: "Inception · make-up, made in Italy" },
          images: [
            "assets/products/inception/c040-fluid-foundation.webp",
            "assets/products/inception/lidschatten-profi-palette-open.webp",
            "assets/products/inception/splash-mascara.webp",
            "assets/products/inception/paris-lipgloss.webp",
            "assets/products/inception/love-blush-rouche.webp",
            "assets/products/inception/liyah-lippenstift.webp",
            "assets/products/inception/lidschatten-duo-palette-open.webp",
            "assets/products/inception/too-trav-travel-case-open-fill.webp",
          ],
        },
        { layout: "quote", text: { fr: "L'entretien de la peau d'abord, le maquillage ensuite", en: "Skincare first, make-up second" }, by: "Dorothy Roffat", duration: 30 },
      ],
      substeps: [
        {
          id: "vision.spot", duration: 4,
          title: { fr: "Projection du spot", en: "Screening of the spot" },
          presenter: { name: "Cynthia Abong", role: { fr: "Égérie de la marque", en: "Face of the brand" }, org: "Dorothy Roffat Cosmetics" },
          sections: [{ layout: "spots" }],
        },
      ],
    },
    {
      id: "cloture", kind: "talk", duration: 5,
      title: { fr: "Clôture", en: "Closing words" },
      presenter: { name: "M. le Gouverneur de la Région du Littoral", role: { fr: "Gouverneur de la Région du Littoral", en: "Governor of the Littoral Region" }, org: "Région du Littoral" },
      sections: [
        { layout: "logos", logos: ["liongate", "drc"], title: { fr: "Merci de votre présence", en: "Thank you for being with us" } },
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
