// EREBOROS — content + i18n
window.EREBOROS_DATA = {
  band: {
    name: "Ereboros",
    tagline: {
      pt: "Death Metal — Rio de Janeiro",
      en: "Death Metal — Rio de Janeiro",
    },
    formed: "MMXXII",
    origin: "Rio de Janeiro · BR",
  },

  members: [
    { name: "Thiago Barbosa", role: { pt: "Guitarra & Vocais", en: "Guitar & Vocals" } },
    { name: "Juan Carlos",    role: { pt: "Guitarra",           en: "Guitar" } },
    { name: "Paulo Doc",      role: { pt: "Baixo",              en: "Bass" } },
    { name: "Victor Mendonça", role: { pt: "Bateria",            en: "Drums" } },
  ],

  about: {
    pt: [
      "Ereboros é uma banda brasileira de Death Metal formada na cidade do Rio de Janeiro, reunindo músicos veteranos da cena underground nacional. Sua sonoridade transita entre agressividade extrema, densidade atmosférica e construção melódica, criando uma estética intensa e contemporânea dentro da música extrema.",
      "Desde seu primeiro lançamento, em 2023, a banda vem expandindo consistentemente sua atuação através de apresentações ao vivo pelo Brasil, Europa e México, fortalecendo sua presença no circuito underground internacional. A experiência de seus integrantes e a forte abordagem estética do grupo têm contribuído para o crescimento do nome Ereboros dentro da cena extrema contemporânea.",
      "Em junho de 2026, a banda inicia um novo ciclo com o lançamento de um novo single, antecipando o álbum que será oficialmente lançado em outubro de 2026. O novo material aprofunda a proposta sonora e conceitual do grupo, reforçando sua identidade dentro do metal extremo moderno.",
    ],
    en: [
      "Ereboros is a Brazilian Death Metal band formed in Rio de Janeiro, bringing together seasoned musicians from the national underground scene. Their sound blends extreme aggression, atmospheric density, and melodic composition, creating an intense and contemporary identity within extreme music.",
      "Since their debut release in 2023, the band has steadily expanded its presence through live performances across Brazil, Europe, and Mexico, strengthening its position within the international underground circuit. The experience of its members, combined with the band’s strong artistic identity, has contributed to the growing recognition of the Ereboros name within the contemporary extreme metal scene.",
      "In June 2026, the band begins a new chapter with the release of a new single, leading into the launch of their upcoming album, officially scheduled for October 2026. The new material further expands the group’s sonic and conceptual approach, reinforcing its identity within modern extreme metal.",
    ],
  },

  release: {
    title: "From Oblivion to the Grave",
    subtitle: { pt: "Álbum · 2026", en: "Full-length · 2026" },
  },

  // Discografia (fonte: Encyclopaedia Metallum). Citação textual para SEO;
  // a audição fica no embed do Spotify. Espelha a lista do JSON-LD em index.html.
  discography: [
    { title: "From Oblivion to the Grave", type: { pt: "álbum", en: "full-length" }, year: "2026" },
    { title: "In the Depths of Misery",    type: { pt: "single", en: "single" },     year: "2026" },
    { title: "Ereboros",                   type: { pt: "EP",     en: "EP" },         year: "2023" },
  ],

  platforms: [
    { name: "Instagram", sub: { pt: "@ereborosofficial",     en: "@ereborosofficial" },     href: "https://www.instagram.com/ereborosofficial/", icon: "instagram" },
    { name: "Spotify",  sub: { pt: "Discografia completa", en: "Full discography" }, href: "https://open.spotify.com/intl-pt/artist/4j0EjyhqLFjcksGkgwE8mz", icon: "spotify" },
    { name: "Bandcamp", sub: { pt: "Edições digitais & físicas", en: "Digital & physical releases" }, href: "https://ereboros.bandcamp.com/album/ereboros", icon: "bandcamp" },
    { name: "YouTube",  sub: { pt: "Canal oficial",         en: "Official channel" }, href: "https://www.youtube.com/@Ereboros", icon: "youtube" },
    { name: "Loja oficial", sub: { pt: "Camisetas, vinis & mais", en: "Shirts, vinyl & more" }, href: "https://ereboros.lojaintegrada.com.br/", icon: "store" },
  ],

  videos: [
    { id: "Fv17iU8Z5ho", title: "Ereboros — Depths",        meta: { pt: "YouTube", en: "YouTube" } },
  ],

  // Agenda: carregada ao vivo da API do Bandsintown (ver useBandsintown em sections.jsx).

  gallery: [
    { caption: "Live / São Paulo · 2025",   placeholder: "Foto ao vivo" },
    { caption: "Studio / 2024",              placeholder: "Bastidores" },
    { caption: "Press / 2025",               placeholder: "Retrato" },
    { caption: "Artwork / Requiem",          placeholder: "Capa" },
    { caption: "Live / Santiago · 2024",     placeholder: "Festival" },
    { caption: "Portrait / Thiago Barbosa",  placeholder: "Vocalista" },
  ],

  merch: [
    { src: "assets/merch-1.jpg", href: "https://ereboros.lojaintegrada.com.br/", alt: { pt: "Ereboros — coleção de roupas From Oblivion to the Grave", en: "Ereboros — From Oblivion to the Grave apparel" } },
    { src: "assets/merch-2.jpg", href: "https://ereboros.lojaintegrada.com.br/", alt: { pt: "Ereboros — CD From Oblivion to the Grave", en: "Ereboros — From Oblivion to the Grave CD" } },
    { src: "assets/merch-3.jpg", href: "https://ereboros.lojaintegrada.com.br/", alt: { pt: "Ereboros — vinil From Oblivion to the Grave", en: "Ereboros — From Oblivion to the Grave vinyl" } },
  ],

  contact: {
    booking:  { label: { pt: "Contato", en: "Contact" }, email: "contact@ereboros.com" },
    press:    { label: { pt: "Imprensa", en: "Press" },                email: "press@ereboros.com" },
    merch:    { label: { pt: "Merchandise", en: "Merchandise" },       email: "merch@ereboros.com" },
    store:    { label: { pt: "Loja oficial", en: "Official store" },   url: "https://ereboros.lojaintegrada.com.br/", display: "ereboros.lojaintegrada.com.br" },
  },

  i18n: {
    nav: {
      about:  { pt: "Sobre",      en: "About" },
      listen: { pt: "Ouça",       en: "Listen" },
      videos: { pt: "Galeria",    en: "Gallery" },
      tour:   { pt: "Agenda",     en: "Tour" },
      store:  { pt: "Merch",      en: "Merch" },
      booking:{ pt: "Contato",    en: "Booking" },
    },
    heroScroll:     { pt: "Desça para saber mais", en: "Keep Scrolling" },
    sections: {
      about:   { num: "I",   title: { pt: "Biografia",      en: "Biography" } },
      listen:  { num: "II",  title: { pt: "Ouça",           en: "Listen" },          kicker: { pt: "Discografia",   en: "Discography" } },
      videos:  { num: "III", title: { pt: "Galeria",        en: "Gallery" },         kicker: { pt: "Vídeos",        en: "Videos" } },
      tour:    { num: "IV",  title: { pt: "Agenda",         en: "Tour Dates" },      kicker: { pt: "Agenda",        en: "Tour dates" } },
      gallery: { num: "V",   title: { pt: "Fotos",          en: "Pictures" },        kicker: { pt: "Galeria",       en: "Gallery" } },
      store:   { num: "VI",  title: { pt: "Merch",          en: "Merch" },           kicker: { pt: "Merchandise",   en: "Merchandise" } },
      booking: { num: "VII", title: { pt: "Contato",        en: "Contact Us" },      kicker: { pt: "Booking",       en: "Booking" } },
    },
    listen: {
      tracklist: { pt: "Alinhamento", en: "Tracklist" },
      platforms: { pt: "Em todas as plataformas", en: "On every platform" },
    },
    status: {
      "on-sale":  { pt: "Ingressos",   en: "Tickets" },
      "few":      { pt: "Últimos",     en: "Few left" },
      "sold-out": { pt: "Esgotado",    en: "Sold out" },
    },
    store: {
      headline: {
        pt: "Camisetas, edições de vinil em tiragem limitada e peças rituais.",
        en: "Shirts, limited vinyl pressings and ritual objects.",
      },
      cta: { pt: "Entrar na loja", en: "Enter the store" },
      sub: { pt: "Envios internacionais", en: "Worldwide shipping" },
    },
    footer: {
      rights: { pt: "Todos os direitos reservados.", en: "All rights reserved." },
      credits:{ pt: "Fotografia · Alessandra Tolc",  en: "Photography · Alessandra Tolc" },
    },
    player: {
      now: { pt: "Tocando agora", en: "Now playing" },
    },
  },
};
