const BIT_APP_ID = "30aa1582f3a295678506dda8cd4219d8";
const BIT_ARTIST = "id_15504303";
const BIT_MONTHS = {
  pt: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
};
const BIT_COUNTRY_ISO = {
  "Brazil": "BR",
  "Argentina": "AR",
  "Chile": "CL",
  "Uruguay": "UY",
  "Paraguay": "PY",
  "Colombia": "CO",
  "Peru": "PE",
  "Mexico": "MX",
  "United States": "US",
  "Canada": "CA",
  "Portugal": "PT",
  "Spain": "ES",
  "France": "FR",
  "Germany": "DE",
  "Netherlands": "NL",
  "Belgium": "BE",
  "United Kingdom": "UK",
  "Italy": "IT",
  "Switzerland": "CH",
  "Austria": "AT",
  "Poland": "PL",
  "Czechia": "CZ",
  "Czech Republic": "CZ",
  "Sweden": "SE",
  "Norway": "NO",
  "Finland": "FI",
  "Denmark": "DK"
};
function useBandsintown() {
  const [state, setState] = useState({ status: "loading", events: [] });
  useEffect(() => {
    let alive = true;
    const url = `https://rest.bandsintown.com/artists/${BIT_ARTIST}/events?app_id=${BIT_APP_ID}&date=upcoming`;
    fetch(url, { headers: { Accept: "application/json" } }).then((r) => r.ok ? r.json() : Promise.reject(r.status)).then((data) => {
      if (alive) setState({ status: "ready", events: Array.isArray(data) ? data : [] });
    }).catch(() => {
      if (alive) setState({ status: "error", events: [] });
    });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
function LiteYouTube({ id, title }) {
  const [on, setOn] = useState(false);
  if (on) {
    return /* @__PURE__ */ React.createElement(
      "iframe",
      {
        src: `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`,
        title,
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        referrerPolicy: "strict-origin-when-cross-origin",
        allowFullScreen: true
      }
    );
  }
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "lite-embed lite-yt",
      onClick: () => setOn(true),
      "aria-label": `${title} — play`,
      style: { backgroundImage: `url(https://i.ytimg.com/vi/${id}/maxresdefault.jpg)` }
    },
    /* @__PURE__ */ React.createElement("span", { className: "lite-play" }, /* @__PURE__ */ React.createElement(Icon.Play, null))
  );
}
function LiteSpotify({ lang }) {
  const [on, setOn] = useState(false);
  if (on) {
    return /* @__PURE__ */ React.createElement(
      "iframe",
      {
        "data-testid": "embed-iframe",
        title: "Ereboros on Spotify",
        src: "https://open.spotify.com/embed/artist/4j0EjyhqLFjcksGkgwE8mz?utm_source=generator&theme=0",
        width: "100%",
        height: "420",
        frameBorder: "0",
        allowFullScreen: "",
        allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
        style: { borderRadius: 2, border: "1px solid var(--rule)", background: "var(--ink-2)" }
      }
    );
  }
  return /* @__PURE__ */ React.createElement("button", { type: "button", className: "lite-embed lite-spotify", onClick: () => setOn(true) }, /* @__PURE__ */ React.createElement(Icon.Spotify, { className: "lite-spotify-logo" }), /* @__PURE__ */ React.createElement("span", { className: "lite-spotify-title" }, lang === "pt" ? "Ouvir no Spotify" : "Play on Spotify"), /* @__PURE__ */ React.createElement("span", { className: "lite-play" }, /* @__PURE__ */ React.createElement(Icon.Play, null)));
}
function Listen({ lang, data, i18n }) {
  const s = i18n.sections.listen;
  const rel = data.release;
  return /* @__PURE__ */ React.createElement("section", { className: "section", id: "listen" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(SectionHead, { num: s.num, title: pick(s.title, lang), kicker: pick(s.kicker, lang) }), /* @__PURE__ */ React.createElement("div", { className: "listen-grid" }, /* @__PURE__ */ React.createElement(Reveal, null, /* @__PURE__ */ React.createElement("div", { className: "spotify-embed" }, /* @__PURE__ */ React.createElement("div", { className: "meta meta-oxide", style: { marginBottom: 14 } }, pick(rel.subtitle, lang)), /* @__PURE__ */ React.createElement(LiteSpotify, { lang }), /* @__PURE__ */ React.createElement("p", { className: "meta", style: { marginTop: 14, lineHeight: 1.7 } }, lang === "pt" ? "Discografia" : "Discography", ":", " ", data.discography.map((d, i) => /* @__PURE__ */ React.createElement("span", { key: d.title }, i > 0 ? " · " : "", d.title, " (", pick(d.type, lang), ", ", d.year, ")"))))), /* @__PURE__ */ React.createElement(Reveal, { delay: 120 }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { marginBottom: 14 } }, pick(i18n.listen.platforms, lang)), /* @__PURE__ */ React.createElement("div", { className: "platforms" }, data.platforms.map((p) => /* @__PURE__ */ React.createElement("a", { key: p.name, href: p.href, className: "platform-row", target: "_blank", rel: "noreferrer" }, iconByName(p.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "platform-name" }, p.name), /* @__PURE__ */ React.createElement("div", { className: "platform-sub" }, pick(p.sub, lang))), /* @__PURE__ */ React.createElement("span", { className: "platform-arrow" }, "→"))))))));
}
function Videos({ lang, data, i18n }) {
  const s = i18n.sections.videos;
  return /* @__PURE__ */ React.createElement("section", { className: "section", id: "videos" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(SectionHead, { num: s.num, title: pick(s.title, lang), kicker: pick(s.kicker, lang) }), /* @__PURE__ */ React.createElement("div", { className: "video-grid video-grid-5" }, data.videos.map((v, i) => /* @__PURE__ */ React.createElement(Reveal, { key: v.id, delay: i * 80, className: "video-tile" }, /* @__PURE__ */ React.createElement("div", { className: "video-embed" }, /* @__PURE__ */ React.createElement(LiteYouTube, { id: v.id, title: v.title })))))));
}
function Tour({ lang, i18n }) {
  const s = i18n.sections.tour;
  const { status, events } = useBandsintown();
  const months = BIT_MONTHS[lang] || BIT_MONTHS.en;
  const msg = (pt, en) => /* @__PURE__ */ React.createElement("div", { className: "meta", style: { padding: "48px 0", textAlign: "center", letterSpacing: "0.12em" } }, lang === "pt" ? pt : en);
  return /* @__PURE__ */ React.createElement("section", { className: "section", id: "tour" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(SectionHead, { num: s.num, title: pick(s.title, lang), kicker: pick(s.kicker, lang) }), /* @__PURE__ */ React.createElement(Reveal, null, status === "loading" && msg("Carregando agenda…", "Loading dates…"), status === "error" && msg("Não foi possível carregar a agenda agora.", "Couldn't load the dates right now."), status === "ready" && events.length === 0 && msg("Nenhum show agendado no momento.", "No upcoming shows right now."), status === "ready" && events.length > 0 && /* @__PURE__ */ React.createElement("ul", { className: "tour-list" }, events.map((ev) => {
    const d = new Date(ev.datetime);
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const offer = (ev.offers || []).find((o) => o.type === "Tickets") || (ev.offers || [])[0];
    const soldOut = offer ? /sold/i.test(offer.status || "") : false;
    const href = offer && offer.url ? offer.url : ev.url;
    const v = ev.venue || {};
    const country = BIT_COUNTRY_ISO[v.country] || v.country || "";
    const statusText = soldOut ? pick(i18n.status["sold-out"], lang) : pick(i18n.status["on-sale"], lang);
    return /* @__PURE__ */ React.createElement("li", { key: ev.id, className: `tour-row ${soldOut ? "sold-out" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "tour-date" }, month, /* @__PURE__ */ React.createElement("span", { className: "day" }, day)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "tour-city" }, v.city), /* @__PURE__ */ React.createElement("div", { className: "tour-venue" }, v.name)), /* @__PURE__ */ React.createElement("div", { className: "tour-country" }, country), /* @__PURE__ */ React.createElement(
      "a",
      {
        href,
        target: "_blank",
        rel: "noreferrer",
        className: "btn",
        style: soldOut ? { pointerEvents: "none", opacity: 0.5 } : null
      },
      statusText
    ));
  })))));
}
function Gallery({ lang, data, i18n }) {
  const s = i18n.sections.gallery;
  const layout = ["wide", "tall", "sq", "sq", "sq", "tall"];
  return /* @__PURE__ */ React.createElement("section", { className: "section", id: "gallery" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(SectionHead, { num: s.num, title: pick(s.title, lang), kicker: pick(s.kicker, lang) }), /* @__PURE__ */ React.createElement("div", { className: "gallery-grid" }, data.gallery.map((g, i) => {
    const size = layout[i] || "sq";
    const isHero = i === 0;
    return /* @__PURE__ */ React.createElement(Reveal, { key: i, delay: i * 60, className: `gallery-tile ${size}` }, isHero ? /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "gallery-inner",
        style: { backgroundImage: "url(/assets/band-promo.webp)" }
      }
    ) : /* @__PURE__ */ React.createElement("div", { className: "gallery-placeholder" }, g.placeholder), /* @__PURE__ */ React.createElement("div", { className: "gallery-caption" }, g.caption));
  }))));
}
function Store({ lang, data, i18n }) {
  const s = i18n.sections.store;
  return /* @__PURE__ */ React.createElement("section", { className: "section", id: "store" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(SectionHead, { num: s.num, title: pick(s.title, lang), kicker: pick(s.kicker, lang) }), /* @__PURE__ */ React.createElement(Reveal, null, /* @__PURE__ */ React.createElement("div", { className: "store-banner" }, /* @__PURE__ */ React.createElement("div", { className: "store-banner-top" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "store-title" }, pick(i18n.store.headline, lang)), /* @__PURE__ */ React.createElement("div", { className: "store-sub" }, pick(i18n.store.sub, lang))), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "https://ereboros.lojaintegrada.com.br/",
      className: "btn btn-oxide",
      target: "_blank",
      rel: "noreferrer"
    },
    pick(i18n.store.cta, lang),
    " →"
  )), /* @__PURE__ */ React.createElement("div", { className: "store-merch" }, data.merch.map((m, i) => /* @__PURE__ */ React.createElement("a", { key: i, href: m.href, target: "_blank", rel: "noreferrer", className: "store-merch-item" }, /* @__PURE__ */ React.createElement("img", { src: m.src, alt: pick(m.alt, lang), loading: "lazy", width: "400", height: "500" }))))))));
}
function Booking({ lang, data, i18n }) {
  const s = i18n.sections.booking;
  return /* @__PURE__ */ React.createElement("section", { className: "section", id: "booking" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(SectionHead, { num: s.num, title: pick(s.title, lang), kicker: pick(s.kicker, lang) }), /* @__PURE__ */ React.createElement(Reveal, null, /* @__PURE__ */ React.createElement("div", { className: "contact-block" }, /* @__PURE__ */ React.createElement("div", { className: "contact-row" }, /* @__PURE__ */ React.createElement("div", { className: "contact-label" }, pick(data.contact.booking.label, lang)), /* @__PURE__ */ React.createElement("div", { className: "contact-value" }, /* @__PURE__ */ React.createElement("a", { href: `mailto:${data.contact.booking.email}` }, data.contact.booking.email))), /* @__PURE__ */ React.createElement("div", { className: "contact-row" }, /* @__PURE__ */ React.createElement("div", { className: "contact-label" }, pick(data.contact.store.label, lang)), /* @__PURE__ */ React.createElement("div", { className: "contact-value" }, /* @__PURE__ */ React.createElement("a", { href: data.contact.store.url, target: "_blank", rel: "noreferrer" }, data.contact.store.display)))))));
}
function Footer({ lang, data, i18n }) {
  return /* @__PURE__ */ React.createElement("footer", { className: "footer" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, /* @__PURE__ */ React.createElement(Reveal, null, /* @__PURE__ */ React.createElement("h2", { className: "footer-wordmark", "aria-label": "Ereboros" }, /* @__PURE__ */ React.createElement("span", { className: "logo-mark logo-mark-footer", role: "img", "aria-label": "Ereboros" }))), /* @__PURE__ */ React.createElement(Reveal, { delay: 100 }, /* @__PURE__ */ React.createElement("div", { className: "footer-meta" }, /* @__PURE__ */ React.createElement("div", { className: "footer-col" }, /* @__PURE__ */ React.createElement("div", { className: "meta" }, data.band.formed, " · MMXXVI"), /* @__PURE__ */ React.createElement("div", { className: "meta" }, pick(i18n.footer.rights, lang))), /* @__PURE__ */ React.createElement("div", { className: "footer-col footer-center" }, /* @__PURE__ */ React.createElement("div", { className: "meta" }, pick(i18n.footer.credits, lang)), /* @__PURE__ */ React.createElement("div", { className: "meta" }, "✦ ✝ ✦")), /* @__PURE__ */ React.createElement("div", { className: "footer-col footer-right" }, /* @__PURE__ */ React.createElement("div", { className: "meta" }, /* @__PURE__ */ React.createElement("a", { href: `mailto:${data.contact.booking.email}`, className: "link-u" }, data.contact.booking.email)), /* @__PURE__ */ React.createElement("div", { className: "meta" }, data.band.origin))))));
}
Object.assign(window, { Listen, Videos, Tour, Gallery, Store, Booking, Footer });
