/*
  CONTENU DE LA PAGE · Gala LIONGATE du 28 novembre 2026
  ------------------------------------------------------
  C'est le seul fichier à modifier pour mettre la page à jour.
  - Texte : remplacer ce qui est entre guillemets. Chaque texte existe en "fr" et en "en".
  - Image : déposer le fichier dans le dossier img/ puis écrire son nom, par exemple "img/cynthia.jpg".
    Laisser "" tant qu'il n'y a pas d'image : la page affiche alors un cadre propre à la place.
  - Ne pas supprimer les virgules ni les accolades.
*/
window.GALA = {
  event: {
    date: "2026-11-28T18:00:00+01:00",          // début du programme (heure de Douala)
    end: "2026-11-28T21:00:00+01:00",
    place: { fr: "Élites Offices, Douala", en: "Élites Offices, Douala" },
    dateLabel: { fr: "Samedi 28 novembre 2026", en: "Saturday 28 November 2026" },
    hours: { fr: "18h00 · 21h00", en: "6 pm · 9 pm" },
  },

  hero: {
    image: "",   // photo plein cadre du hero (ex. "img/hero.jpg"). Vide : composition produits Secret Skin
    eyebrow: { fr: "Soirée de gala", en: "Gala evening" },
    title: { fr: "LIONGATE vous reçoit, Dorothy Roffat Cosmetics à l'honneur", en: "LIONGATE welcomes you, Dorothy Roffat Cosmetics in the spotlight" },
    text: { fr: "Une soirée pour présenter l'entreprise, ses deux pôles, la marque qu'elle distribue au Cameroun et ceux qui la portent.", en: "An evening to present the company, its two divisions, the brand it distributes in Cameroon and the people behind it." },
    primary: { fr: "Voir le programme", en: "See the programme" },
    secondary: { fr: "Les gammes", en: "The product lines" },
  },

  // Programme : l'heure sert aussi à allumer le point « en cours » pendant la soirée
  programme: [
    { time: "17:30", title: { fr: "Accueil et photocall", en: "Welcome and photocall" }, who: "" },
    { time: "18:00", title: { fr: "Ouverture", en: "Opening" }, who: "M. Ayissi Jean Noël" },
    { time: "18:04", title: { fr: "Le pôle Marketing et Communication", en: "Marketing and Communications" }, who: "M. Désiré Effa" },
    { time: "18:08", title: { fr: "Expansion de marchés", en: "Market Expansion" }, who: "Dr NKONDOCK Hermosa" },
    { time: "18:10", title: { fr: "IT & Software Outsourcing", en: "IT & Software Outsourcing" }, who: "M. Donald Nguimfack" },
    { time: "18:15", title: { fr: "Intermède musical", en: "Musical interlude" }, who: "Orchestre" },
    { time: "18:18", title: { fr: "Vision et présentation des gammes", en: "Vision and product lines" }, who: "Mme Dorothy Roffat" },
    { time: "18:26", title: { fr: "Projection du spot", en: "First screening of the spot" }, who: "Cynthia Abong" },
    { time: "18:30", title: { fr: "Clôture", en: "Closing words" }, who: "M. le Gouverneur de la Région du Littoral" },
    { time: "18:35", title: { fr: "Cocktail dînatoire", en: "Cocktail reception" }, who: "" },
  ],

  speakers: [
    { name: "M. Ayissi Jean Noël", role: { fr: "Fonction à compléter", en: "Title to be confirmed" }, moment: { fr: "Ouverture", en: "Opening" }, photo: "" },
    { name: "M. Désiré Effa", role: { fr: "Responsable Marketing et Communication, LIONGATE", en: "Head of Marketing and Communications, LIONGATE" }, moment: { fr: "Marketing et Communication", en: "Marketing and Communications" }, photo: "" },
    { name: "Dr NKONDOCK Hermosa", role: { fr: "Directrice du pôle Expansion de marchés", en: "Director, Market Expansion" }, moment: { fr: "Expansion de marchés", en: "Market Expansion" }, photo: "" },
    { name: "M. Donald Nguimfack", role: { fr: "Directeur du pôle IT & Software Outsourcing", en: "Director, IT & Software Outsourcing" }, moment: { fr: "IT & Software Outsourcing", en: "IT & Software Outsourcing" }, photo: "" },
    { name: "Mme Dorothy Roffat", role: { fr: "Fondatrice de Dorothy Roffat Cosmetics", en: "Founder, Dorothy Roffat Cosmetics" }, moment: { fr: "Vision", en: "Vision" }, photo: "" },
    { name: "Cynthia Abong", role: { fr: "Égérie de la marque", en: "Face of the brand" }, moment: { fr: "Projection du spot", en: "Spot screening" }, photo: "" },
  ],

  divisions: [
    {
      name: { fr: "Expansion de marchés", en: "Market Expansion" },
      text: { fr: "On accompagne les marques qui veulent s'installer sur les marchés africains, de l'étude de marché jusqu'au rayon.", en: "We help brands enter African markets, from market research to the shelf." },
      steps: { fr: ["Analyse du marché", "Conformité", "Distribution", "Animation"], en: ["Market analysis", "Compliance", "Distribution", "Activation"] },
    },
    {
      name: { fr: "IT & Software Outsourcing", en: "IT & Software Outsourcing" },
      text: { fr: "On gère les systèmes d'information des entreprises, de l'audit à l'exploitation.", en: "We run companies' information systems, from audit to operations." },
      steps: { fr: ["Audit", "Développement", "Exploitation"], en: ["Audit", "Build", "Run"] },
    },
  ],

  brand: {
    signature: "Beauty is your nature",            // signature protégée : ne pas traduire
    rule: "L'entretien de la peau d'abord, le maquillage ensuite",
    timeline: [
      { year: "2013", text: { fr: "Création de la marque", en: "Brand founded" } },
      { year: "2017", text: { fr: "Premières ventes", en: "First sales" } },
      { year: "2021", text: { fr: "Lancement de Secret Skin", en: "Secret Skin launched" } },
      { year: "2026", text: { fr: "Arrivée au Cameroun avec LIONGATE", en: "Arrival in Cameroon with LIONGATE" } },
    ],
  },

  secretSkin: {
    intro: { fr: "Une ligne dermo-cosmétique formulée et fabriquée en Allemagne. Elle hydrate, assainit et répare la peau sans l'agresser. Testée par TÜV Rheinland, certifiée conforme par l'ANOR.", en: "A dermo-cosmetic line formulated and made in Germany. It hydrates, purifies and repairs the skin without irritating it. Tested by TÜV Rheinland, certified compliant by ANOR." },
    products: [
      {
        step: { fr: "Préparer", en: "Prepare" }, name: "Ma Base Secrète Pro Primer", image: "img/pro-primer.png",
        text: { fr: "Un soin actif sous le maquillage, en flacon airless. Il affine le grain et régule l'excès de sébum sans boucher les pores. On peut aussi le porter seul.", en: "An active primer in an airless bottle. It refines skin texture and controls shine without clogging pores. It can also be worn on its own." },
        actives: { fr: [["Argent colloïdal", "propriétés assainissantes"], ["Acide lactique", "renouvellement cellulaire"], ["Silice naturelle", "matifie et floute"]], en: [["Colloidal silver", "purifying properties"], ["Lactic acid", "cell renewal"], ["Natural silica", "mattifies and blurs"]] },
      },
      {
        step: { fr: "Le jour", en: "Day" }, name: "Mon Secret Jour", image: "img/secret-jour.png",
        text: { fr: "Le jus d'aloe vera natif remplace l'eau comme premier ingrédient. La texture est légère et ne laisse pas de film gras.", en: "Native aloe vera juice replaces water as the first ingredient. The texture is light and leaves no greasy film." },
        actives: { fr: [["Aloe vera natif", "apaise et hydrate"], ["Acide hyaluronique", "repulpe"], ["Esters végétaux", "à la place des silicones"]], en: [["Native aloe vera", "soothes and hydrates"], ["Hyaluronic acid", "plumps"], ["Plant esters", "instead of silicones"]] },
      },
      {
        step: { fr: "La nuit", en: "Night" }, name: "Mon Secret Nuit", image: "img/secret-nuit.png",
        text: { fr: "Un soin enveloppant pour la nuit, quand la peau se répare le mieux.", en: "A rich night cream for the hours when skin repairs itself best." },
        actives: { fr: [["Aloe vera", "calme la peau"], ["Acide hyaluronique", "hydrate en profondeur"], ["Huile de ricin", "assouplit et nourrit"]], en: [["Aloe vera", "calms the skin"], ["Hyaluronic acid", "deep hydration"], ["Castor oil", "softens and nourishes"]] },
      },
    ],
  },

  inception: {
    intro: { fr: "La gamme de maquillage, fabriquée en Italie. Elle protège la peau, la laisse respirer et ne bouche pas les pores.", en: "The make-up line, made in Italy. It protects the skin, lets it breathe and does not clog pores." },
    image: "",   // visuel Inception (ex. "img/inception.jpg")
    groups: [
      { name: { fr: "Le teint", en: "Complexion" }, items: { fr: "Fond de Teint Fluide, Poudre Compacte, Poudre Libre Invisible, Blushs", en: "Fluid Foundation, Compact Powder, Invisible Loose Powder, Blushes" } },
      { name: { fr: "Le regard", en: "Eyes" }, items: { fr: "Eye Definer, Eyebrow Definer, Pool Liner, Splash Mascara", en: "Eye Definer, Eyebrow Definer, Pool Liner, Splash Mascara" } },
      { name: { fr: "Les lèvres", en: "Lips" }, items: { fr: "Rouges à Lèvres mats, Gloss Poudre Inception", en: "Matte Lipsticks, Inception Powder Gloss" } },
    ],
    shades: 15,
  },

  footer: {
    site: "liongate.cm",
    note: { fr: "LIONGATE SARL, Douala. Distributeur exclusif de Dorothy Roffat Cosmetics au Cameroun.", en: "LIONGATE SARL, Douala. Exclusive distributor of Dorothy Roffat Cosmetics in Cameroon." },
  },
};
