/* EREBOROS — sections II-VII + footer */

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

function Tour({ lang, data, i18n }) {
  const s = i18n.sections.tour;
  return (
    <section className="section" id="tour">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <Reveal>
          <ul className="tour-list">
            {data.tour.map((t, i) => {
              const statusText = pick(i18n.status[t.status], lang);
              const soldOut = t.status === "sold-out";
              return (
                <li key={i} className={`tour-row ${soldOut ? "sold-out" : ""}`}>
                  <div className="tour-date">
                    {t.month}
                    <span className="day">{t.day}</span>
                  </div>
                  <div>
                    <div className="tour-city">{t.city}</div>
                    <div className="tour-venue">{t.venue}</div>
                  </div>
                  <div className="tour-country">{t.country}</div>
                  <a
                    href="#"
                    className="btn"
                    style={soldOut ? { pointerEvents: "none", opacity: 0.5 } : null}
                  >
                    {statusText}
                  </a>
                </li>
              );
            })}
          </ul>
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

function Store({ lang, i18n }) {
  const s = i18n.sections.store;
  return (
    <section className="section" id="store">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <Reveal>
          <div className="store-banner">
            <div style={{ position: "relative", zIndex: 2 }}>
              <h3 className="store-title">{pick(i18n.store.headline, lang)}</h3>
              <div className="store-sub">{pick(i18n.store.sub, lang)}</div>
            </div>
            <a
              href="https://ereboros.lojaintegrada.com.br/"
              className="btn btn-oxide"
              target="_blank"
              rel="noreferrer"
              style={{ position: "relative", zIndex: 2 }}
            >
              {pick(i18n.store.cta, lang)} →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Booking({ lang, data, i18n }) {
  const s = i18n.sections.booking;
  const f = i18n.booking.form;
  const k = i18n.booking.kinds;
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    e.target.reset();
  };

  return (
    <section className="section" id="booking">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <div className="booking-grid">
          <Reveal>
            <p className="booking-intro">{pick(i18n.booking.intro, lang)}</p>
            <div className="contact-block">
              <div className="contact-row">
                <div className="contact-label">{pick(data.contact.booking.label, lang)}</div>
                <div className="contact-value">
                  <a href={`mailto:${data.contact.booking.email}`}>{data.contact.booking.email}</a>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-label">{pick(data.contact.press.label, lang)}</div>
                <div className="contact-value">
                  <a href={`mailto:${data.contact.press.email}`}>{data.contact.press.email}</a>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-label">{pick(data.contact.merch.label, lang)}</div>
                <div className="contact-value">
                  <a href={`mailto:${data.contact.merch.email}`}>{data.contact.merch.email}</a>
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

          <Reveal delay={140}>
            <form className="booking-form" onSubmit={submit}>
              <div className="field-row">
                <div className="field">
                  <label>{pick(f.name, lang)}</label>
                  <input type="text" required />
                </div>
                <div className="field">
                  <label>{pick(f.email, lang)}</label>
                  <input type="email" required />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{pick(f.kind, lang)}</label>
                  <select required defaultValue="">
                    <option value="" disabled>—</option>
                    <option>{pick(k.show, lang)}</option>
                    <option>{pick(k.festival, lang)}</option>
                    <option>{pick(k.press, lang)}</option>
                    <option>{pick(k.other, lang)}</option>
                  </select>
                </div>
                <div className="field">
                  <label>{pick(f.date, lang)}</label>
                  <input type="text" placeholder="AAAA-MM-DD" />
                </div>
              </div>
              <div className="field">
                <label>{pick(f.city, lang)}</label>
                <input type="text" />
              </div>
              <div className="field">
                <label>{pick(f.msg, lang)}</label>
                <textarea />
              </div>
              <button type="submit" className="btn btn-oxide form-submit">
                {pick(f.send, lang)} →
              </button>
              {sent && (
                <p className="form-status">✦ {pick(f.sent, lang)}</p>
              )}
            </form>
          </Reveal>
        </div>
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
