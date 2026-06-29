/* EREBOROS — sections II-VII + footer */

/* ---------- Bandsintown (agenda ao vivo) ---------- */

const BIT_APP_ID  = "30aa1582f3a295678506dda8cd4219d8";
const BIT_ARTIST  = "id_15504303"; // Ereboros — https://www.bandsintown.com/a/15504303-ereboros

const BIT_MONTHS = {
  pt: ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"],
  en: ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
};
// A API devolve o país por extenso; o layout usa sigla de 2 letras.
const BIT_COUNTRY_ISO = {
  "Brazil": "BR", "Argentina": "AR", "Chile": "CL", "Uruguay": "UY", "Paraguay": "PY",
  "Colombia": "CO", "Peru": "PE", "Mexico": "MX", "United States": "US", "Canada": "CA",
  "Portugal": "PT", "Spain": "ES", "France": "FR", "Germany": "DE", "Netherlands": "NL",
  "Belgium": "BE", "United Kingdom": "UK", "Italy": "IT", "Switzerland": "CH",
  "Austria": "AT", "Poland": "PL", "Czechia": "CZ", "Czech Republic": "CZ", "Sweden": "SE",
  "Norway": "NO", "Finland": "FI", "Denmark": "DK",
};

function useBandsintown() {
  const [state, setState] = useState({ status: "loading", events: [] });
  useEffect(() => {
    let alive = true;
    const url = `https://rest.bandsintown.com/artists/${BIT_ARTIST}/events?app_id=${BIT_APP_ID}&date=upcoming`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (alive) setState({ status: "ready", events: Array.isArray(data) ? data : [] }); })
      .catch(() => { if (alive) setState({ status: "error", events: [] }); });
    return () => { alive = false; };
  }, []);
  return state;
}

function Listen({ lang, data, i18n }) {
  const s = i18n.sections.listen;
  const rel = data.release;

  return (
    <section className="section" id="listen">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <div className="listen-grid">
          <Reveal>
            <div className="spotify-embed">
              <div className="meta meta-oxide" style={{ marginBottom: 14 }}>{pick(rel.subtitle, lang)}</div>
              <iframe
                data-testid="embed-iframe"
                title="Ereboros on Spotify"
                src="https://open.spotify.com/embed/artist/4j0EjyhqLFjcksGkgwE8mz?utm_source=generator&theme=0"
                width="100%"
                height="420"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: 2, border: "1px solid var(--rule)", background: "var(--ink-2)" }}
              />
              <p className="meta" style={{ marginTop: 14, lineHeight: 1.7 }}>
                {lang === "pt" ? "Discografia" : "Discography"}:{" "}
                {data.discography.map((d, i) => (
                  <span key={d.title}>{i > 0 ? " · " : ""}{d.title} ({pick(d.type, lang)}, {d.year})</span>
                ))}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="meta" style={{ marginBottom: 14 }}>{pick(i18n.listen.platforms, lang)}</div>
            <div className="platforms">
              {data.platforms.map((p) => (
                <a key={p.name} href={p.href} className="platform-row" target="_blank" rel="noreferrer">
                  {iconByName(p.icon)}
                  <div>
                    <div className="platform-name">{p.name}</div>
                    <div className="platform-sub">{pick(p.sub, lang)}</div>
                  </div>
                  <span className="platform-arrow">→</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Videos({ lang, data, i18n }) {
  const s = i18n.sections.videos;

  return (
    <section className="section" id="videos">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <div className="video-grid video-grid-5">
          {data.videos.map((v, i) => (
            <Reveal key={v.id} delay={i * 80} className="video-tile">
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}?rel=0`}
                  title={v.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tour({ lang, i18n }) {
  const s = i18n.sections.tour;
  const { status, events } = useBandsintown();
  const months = BIT_MONTHS[lang] || BIT_MONTHS.en;

  const msg = (pt, en) => (
    <div className="meta" style={{ padding: "48px 0", textAlign: "center", letterSpacing: "0.12em" }}>
      {lang === "pt" ? pt : en}
    </div>
  );

  return (
    <section className="section" id="tour">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <Reveal>
          {status === "loading" && msg("Carregando agenda…", "Loading dates…")}
          {status === "error" && msg("Não foi possível carregar a agenda agora.", "Couldn't load the dates right now.")}
          {status === "ready" && events.length === 0 && msg("Nenhum show agendado no momento.", "No upcoming shows right now.")}
          {status === "ready" && events.length > 0 && (
            <ul className="tour-list">
              {events.map((ev) => {
                const d = new Date(ev.datetime);
                const day = String(d.getDate()).padStart(2, "0");
                const month = months[d.getMonth()];
                const offer = (ev.offers || []).find((o) => o.type === "Tickets") || (ev.offers || [])[0];
                const soldOut = offer ? /sold/i.test(offer.status || "") : false;
                const href = (offer && offer.url) ? offer.url : ev.url;
                const v = ev.venue || {};
                const country = BIT_COUNTRY_ISO[v.country] || v.country || "";
                const statusText = soldOut
                  ? pick(i18n.status["sold-out"], lang)
                  : pick(i18n.status["on-sale"], lang);
                return (
                  <li key={ev.id} className={`tour-row ${soldOut ? "sold-out" : ""}`}>
                    <div className="tour-date">
                      {month}
                      <span className="day">{day}</span>
                    </div>
                    <div>
                      <div className="tour-city">{v.city}</div>
                      <div className="tour-venue">{v.name}</div>
                    </div>
                    <div className="tour-country">{country}</div>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      style={soldOut ? { pointerEvents: "none", opacity: 0.5 } : null}
                    >
                      {statusText}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Gallery({ lang, data, i18n }) {
  const s = i18n.sections.gallery;
  // size classes designed to fill grid: 8 + 4 = 12, 4 + 4 + 4 = 12, 3 + 3 + 3 + 3 = 12
  const layout = ["wide", "tall", "sq", "sq", "sq", "tall"];
  return (
    <section className="section" id="gallery">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <div className="gallery-grid">
          {data.gallery.map((g, i) => {
            const size = layout[i] || "sq";
            const isHero = i === 0;
            return (
              <Reveal key={i} delay={i * 60} className={`gallery-tile ${size}`}>
                {isHero ? (
                  <div
                    className="gallery-inner"
                    style={{ backgroundImage: "url(assets/band-promo.jpg)" }}
                  />
                ) : (
                  <div className="gallery-placeholder">{g.placeholder}</div>
                )}
                <div className="gallery-caption">{g.caption}</div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Store({ lang, data, i18n }) {
  const s = i18n.sections.store;
  return (
    <section className="section" id="store">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <Reveal>
          <div className="store-banner">
            <div className="store-banner-top">
              <div>
                <h3 className="store-title">{pick(i18n.store.headline, lang)}</h3>
                <div className="store-sub">{pick(i18n.store.sub, lang)}</div>
              </div>
              <a
                href="https://ereboros.lojaintegrada.com.br/"
                className="btn btn-oxide"
                target="_blank"
                rel="noreferrer"
              >
                {pick(i18n.store.cta, lang)} →
              </a>
            </div>
            <div className="store-merch">
              {data.merch.map((m, i) => (
                <a key={i} href={m.href} target="_blank" rel="noreferrer" className="store-merch-item">
                  <img src={m.src} alt={pick(m.alt, lang)} loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Booking({ lang, data, i18n }) {
  const s = i18n.sections.booking;
  return (
    <section className="section" id="booking">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <Reveal>
          <div className="contact-block">
            <div className="contact-row">
              <div className="contact-label">{pick(data.contact.booking.label, lang)}</div>
              <div className="contact-value">
                <a href={`mailto:${data.contact.booking.email}`}>{data.contact.booking.email}</a>
              </div>
            </div>
            <div className="contact-row">
              <div className="contact-label">{pick(data.contact.store.label, lang)}</div>
              <div className="contact-value">
                <a href={data.contact.store.url} target="_blank" rel="noreferrer">{data.contact.store.display}</a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ lang, data, i18n }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <Reveal>
          <h2 className="footer-wordmark" aria-label="Ereboros">
            <span className="logo-mark logo-mark-footer" role="img" aria-label="Ereboros" />
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="footer-meta">
            <div className="footer-col">
              <div className="meta">{data.band.formed} · MMXXVI</div>
              <div className="meta">{pick(i18n.footer.rights, lang)}</div>
            </div>
            <div className="footer-col footer-center">
              <div className="meta">{pick(i18n.footer.credits, lang)}</div>
              <div className="meta">✦ ✝ ✦</div>
            </div>
            <div className="footer-col footer-right">
              <div className="meta">
                <a href={`mailto:${data.contact.booking.email}`} className="link-u">{data.contact.booking.email}</a>
              </div>
              <div className="meta">{data.band.origin}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

Object.assign(window, { Listen, Videos, Tour, Gallery, Store, Booking, Footer });
