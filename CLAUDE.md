# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Site institucional da banda **Ereboros** (death metal, Rio de Janeiro), bilíngue PT/EN. É um site **estático e sem dependências instaladas** (não há `package.json`, `node_modules`, bundler, testes nem linter): React 18 é carregado via CDN (`unpkg`). O JSX **não** é transpilado no navegador: ele é **pré-compilado para JS por um passo de build leve** (`build.mjs`, esbuild via `npx`, sem instalar nada no projeto). O navegador carrega apenas os `.js` gerados, sem Babel. Os `.jsx` são a **fonte editável**; os `.js` são artefatos.

> Histórico: até `?v=29` o site carregava `@babel/standalone` (~3 MB) e transpilava o JSX na main thread em runtime, o maior gargalo de performance no mobile. Isso foi removido em favor da pré-compilação.

São **quatro famílias de página**, e só a primeira é uma aplicação React:

| Família | URL | Como nasce |
|---|---|---|
| Home | `/` (PT) e `/en/` (EN) | `index.html` à mão; a EN é gerada por `build.mjs` |
| Landing do álbum | `/from-oblivion-to-the-grave/` (atalho `/fotg`) | **escrita à mão**, sem gerador |
| Smartlink de single | `/sl/<slug>/` | gerada por `build-smartlinks.mjs` |
| Página de produto | `/merch/<slug>/` | gerada por `build-products.mjs` |

## Como rodar e publicar

```bash
# 1. Compilar o JSX → JS (necessário após editar qualquer .jsx)
node build.mjs

# 2. Servir localmente (qualquer servidor estático na raiz do projeto)
npx serve .
# ou
python -m http.server 8000
```

`build.mjs` faz duas coisas: (1) transpila `components.jsx`, `sections.jsx` e `app.jsx` para `.js` via esbuild (`npx`, nada instalado no projeto); (2) **gera `en/index.html`** a partir do `index.html` (PT), aplicando substituições de idioma validadas. Se um alvo de tradução não for encontrado (texto editado), o build **falha** em vez de gerar uma página EN errada. **Sempre rode `node build.mjs` depois de editar um `.jsx` ou o `index.html`** e incremente o `?v=` (ver Cache-busting). `data.js` e `styles.css` são servidos direto, sem compilação. Ao editar meta tags ou o `<noscript>` do `index.html` que diferem por idioma, atualize também o array `REPLACEMENTS` em `build.mjs`.

Abra a porta servida. Não basta abrir `index.html` via `file://`: os scripts e os assets locais exigem origem HTTP.

Deploy é via **Vercel** (projeto já vinculado em `.vercel/project.json`):

```bash
vercel          # preview
vercel --prod   # produção
```

`.vercel/` está no `.gitignore` e não deve ser commitado.

> ⚠️ A integração com o Git também está ativa: **`git push` para `main` publica em produção** sem passar por nenhum comando da Vercel. Trate push como publicação e confirme antes.

Os arquivos gerados (`.js`, `en/index.html`, `sl/`, `merch/`) **são commitados**: a Vercel serve estático e não executa build do lado dela.

## Landing do álbum (`/from-oblivion-to-the-grave/`)

⚠️ **É a única página satélite sem gerador.** Um HTML de mais de mil linhas, mantido à mão, com CSS inline de prefixo `.fo-`. Tem layout muito próprio (timeline de singles, embeds), o que tirou a vantagem de um template.

Consequência prática: ela carrega o `styles.css` com um **`?v=` escrito à mão, independente do da home**, e por isso costuma ficar defasada. Ao mexer no `styles.css`, incremente nos dois lugares. A URL curta `/fotg` é um redirect temporário no `vercel.json`.

## Smartlinks por single (`/sl/<slug>/`)

As páginas de smartlink usadas em campanhas (Meta etc.) ficam em `/sl/<slug>/index.html` e são **geradas** por `build-smartlinks.mjs` a partir de UM template. **Não edite os HTML em `sl/` à mão**: edite a lista `SINGLES` (e, se preciso, o template ou os ícones) no `.mjs` e rode:

```bash
node build-smartlinks.mjs
```

Por single só variam: `title`, `slug`, `cover`/`coverOg` (capa; `cover: null` mostra o placeholder "Artwork coming soon" e usa `band-promo.jpg` como og:image), `links` (`null` = botões travados com badge "Soon"; objeto com as URLs = botões ativos "Listen" mais evento de conversão) e `releaseDate` (rótulos de data e JSON-LD). Há também um CTA opcional de pré-save, que sai sozinho da página quando `links` é preenchido. A ordem dos botões vem da constante `ORDER`, e os ícones são paths SVG embutidos no mesmo arquivo.

O **Meta Pixel** (`META_PIXEL_ID`) e o **GA** ficam centralizados no `.mjs`. São páginas standalone: usam `styles.css` do site mais CSS inline com prefixo `.sl-`, sem depender de `data.js`/`components.js`/React. Rastreiam clique de streaming como `Lead` e `ContentClick` (Pixel) e `select_content` (GA4).

`/sl/` está nas exclusões do catch-all do `vercel.json` (senão as páginas seriam redirecionadas para a home). Ao criar ou renomear slugs, mantenha a exclusão `sl/` e adicione as URLs ao `sitemap.xml`.

## Páginas de produto (`/merch/<slug>/`)

As landings de venda por produto ficam em `/merch/<slug>/index.html` e são **geradas** por `build-products.mjs` a partir de UM template (mesmo padrão dos smartlinks). **Não edite os HTML em `merch/` à mão**, edite a lista `PRODUCTS` no `.mjs` e rode:

```bash
node build-products.mjs
```

São páginas standalone em PT (o público da loja é BR): usam `styles.css` do site mais CSS inline com prefixo `.p-`, sem depender de `data.js`/`components.js`. Cada produto tem `name`, `image`/`imageOg`, `productUrl` (página na Loja Integrada), `cartBase` e um array `sizes` (cada tamanho com `label`, `price` em centavos e o `id` da variação na Loja Integrada). O seletor de tamanho atualiza preço e parcelas e reaponta o botão **Comprar** para o carrinho daquele tamanho (deep link `cartBase/<id>/adicionar`); sem tamanho escolhido, o botão abre a `productUrl` (fallback seguro). Rastreia `ViewContent` no load e `AddToCart` no clique (Meta Pixel) mais `add_to_cart`/`select_content` (GA4). O **Meta Pixel** e o **GA** ficam centralizados no `.mjs`.

> ⚠️ `price` e `id` por tamanho são extraídos da página da loja e precisam ser conferidos: um `id` trocado adiciona o tamanho errado ao carrinho.

Existe ainda `build-products-v2.mjs`, uma **variante experimental** da landing de produto (layout de storytelling em tela cheia), que gera `/merch/<slug>-v2/`. Ela é `noindex` com `canonical` apontando para a v1, de propósito, para permitir comparação sem dividir sinal de SEO. Não substitui o `build-products.mjs`.

`/merch/` está nas exclusões do catch-all do `vercel.json`. Ao criar ou renomear slugs, mantenha a exclusão `merch/` e adicione as URLs ao `sitemap.xml`.

## Arquitetura

`index.html` carrega os scripts **nesta ordem, que é significativa** (não há módulos nem imports, tudo é global). Todos usam `defer`, que preserva a ordem de execução e não bloqueia o parse do HTML:

1. React + ReactDOM (CDN, com hashes SRI) — **sem Babel**
2. `window.EREBOROS_LANG`, inline, definindo o idioma daquela URL
3. `data.js` — JS puro, define `window.EREBOROS_DATA`
4. `components.js`, `sections.js`, `app.js` — **gerados** por `build.mjs` a partir dos `.jsx`

Alterar a versão do React exige atualizar o hash `integrity` junto: com o hash defasado o navegador recusa o script e a página fica em branco.

**Padrão de globais:** cada `.jsx` define seus componentes e utilitários e os expõe com `Object.assign(window, {...})` no fim do arquivo; os arquivos seguintes os consomem como globais. Ao adicionar um componente novo, lembre de exportá-lo no `Object.assign` e de respeitar a ordem de carregamento (um componente só pode usar o que foi definido em arquivo anterior). O esbuild roda **sem minificação** (nenhuma flag `--minify*`): minificar apagaria comentários, incluindo os marcadores `/*EDITMODE-BEGIN*/`, e o ganho seria de uns 2 KB gzip. Os `.js` ficam legíveis para debug e os nomes globais chegam intactos.

Divisão dos arquivos:

- **`data.js`** — todo o conteúdo e i18n num único objeto (`band`, `members`, `about`, `release`, `announce`, `discography`, `platforms`, `videos`, `gallery`, `merch`, `contact`, `i18n`). **Para editar textos, integrantes, links, discografia, galeria e merch, altere aqui**: os componentes apenas renderizam esse objeto.
- **`components.jsx`** — utilitários (`pick`, `useReveal`/`Reveal`), set de ícones SVG inline (`Icon`), e `Nav`, `Hero`, `About`, `SectionHead`, `Ornament`, `Newsletter`, `AnnounceBar`.
- **`sections.jsx`** — seções `Listen`, `Videos`, `Tour`, `Gallery`, `Store`, `Booking` e `Footer`, mais as facades `LiteYouTube`/`LiteSpotify` e o hook `useBandsintown`.
- **`app.jsx`** — sistema de temas "Tweaks", o `App` raiz, o roteamento de idioma, a instrumentação de cliques, o scroll suave e o `ReactDOM.createRoot(...).render(...)`.
- **`styles.css`** — design system inteiro via CSS custom properties.

> ⚠️ **As datas de turnê NÃO estão no `data.js`.** A seção `Tour` busca os eventos na API do Bandsintown em runtime (`rest.bandsintown.com/artists/id_15504303/events`, hook `useBandsintown` em `sections.jsx`, constantes `BIT_ARTIST` e `BIT_APP_ID` no topo do arquivo). Datas se cadastram no Bandsintown, sem deploy. Se a seção aparecer vazia, o lugar de olhar é a API, não o repositório.

## Convenções específicas deste projeto

**i18n.** Toda string visível ao usuário tem o formato `{ pt: "...", en: "..." }` e é resolvida por `pick(valor, lang)` (de `components.jsx`). Ao adicionar conteúdo, sempre forneça as duas línguas. Uma string crua não quebra a build: só aparece igual nos dois idiomas.

**Idioma ligado à URL (bilíngue indexável).** `/` serve PT e `/en/` serve EN, duas URLs estáticas, cada uma com o HTML no idioma certo (a EN é gerada pelo `build.mjs`), com `hreflang` cruzado e `canonical` próprio. Cada página injeta `window.EREBOROS_LANG` (`"pt"`/`"en"`), que define o idioma inicial do React (`app.jsx`). O toggle PT/EN na nav troca o idioma **sem recarregar** (History API `pushState` para `/` ou `/en/`) e mantém `document.documentElement.lang`; o botão Voltar é respeitado via `popstate`. **Não usa `localStorage`** para o idioma: a URL é a fonte da verdade. Por isso os assets são referenciados por **caminho absoluto** (`/assets/...`, `/app.js` etc.) no HTML e no JS (`components.jsx` nav, `sections.jsx` galeria, `data.js` merch), para resolverem tanto em `/` quanto em `/en/`. As `url()` do `styles.css` são relativas ao próprio CSS (raiz), então não precisam de ajuste.

**Analytics.** GA4 (`G-H3N99TLRFJ`) está em **todas** as páginas; **Vercel Web Analytics** (`/_vercel/insights/script.js`) só na home; **Meta Pixel** só em `/sl/` e `/merch/`, deliberadamente (a home e a landing do álbum medem só com GA4, não é lacuna). A instrumentação de clique é **declarativa**: qualquer elemento com `data-ga-type`, `data-ga-item` e `data-ga-loc` dispara `select_content` no GA4, via um listener único em `document` com `capture: true`. Ele existe em dois lugares equivalentes: dentro do `App` (`app.jsx`) para a home, e num `<script>` inline do template para smartlinks e produtos. Os tipos em uso são `listen`, `presave`, `video`, `navigate` e `merch`. Os parâmetros `content_type`, `item_id` e `location` estão registrados como dimensões personalizadas na propriedade GA4. **Ao adicionar um link ou botão novo, inclua os três atributos**, senão ele fica invisível nos relatórios sem nada acusar. Guia para a banda (convenção de UTM etc.) em `docs-internos/ANALYTICS.md`.

**Temas "Tweaks".** O objeto `TWEAK_DEFAULTS` em `app.jsx` está cercado pelos marcadores `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/`: não remova esses marcadores. `applyTweaks` traduz accent e background para CSS custom properties (`--oxide`, `--oxide-bright`, `--ink`, `--ink-2`, `--ink-3`) no `:root`, o que significa que mudar essas cinco no CSS pode ser sobrescrito em runtime. Há um protocolo de "edit mode" via `postMessage` (mensagens `__edit_mode_available`, `__activate_edit_mode`, `__deactivate_edit_mode`, `__edit_mode_set_keys`) para integração quando o site roda dentro de um frame de uma ferramenta de edição externa.

**Numerais das seções.** São algarismos romanos por padrão; o tweak `capitals: "arabic"` reescreve `i18n.sections.*.num` clonando o objeto i18n em runtime.

**Cache-busting.** `index.html` referencia os assets com query de versão (atualmente `?v=45`): `styles.css`, `data.js`, `components.js`, `sections.js`, `app.js`. **Ao editar qualquer um desses arquivos (ou seu `.jsx` de origem), incremente o número de versão** (de preferência todos juntos) para invalidar o cache do navegador. Isso é ainda mais importante porque o `vercel.json` serve `.js`, `.css` e imagens com `Cache-Control: max-age=31536000, immutable`: o navegador não revalida, só refaz o fetch quando a URL (com `?v=`) muda. O `en/index.html` herda o `?v=` do PT porque é gerado a partir dele, mas **a landing do álbum tem o seu próprio, escrito à mão**. As imagens em `assets/` não usam `?v=` (o `immutable` vale pelo nome do arquivo); ao reotimizar uma imagem mantendo o nome, troque o nome ou adicione uma query.

**Logo.** O wordmark é renderizado por CSS `mask-image` sobre `assets/ereboros-logo.webp` (classe `.logo-mark`), colorido por `--oxide-bright`: não é uma `<img>` no hero nem no footer. O `.webp` é **lossless** (preserva o canal alpha que define a forma da máscara). A nav usa o mesmo `.webp` numa `<img>`.

**Assets / imagens.** As imagens de conteúdo são servidas em **WebP** (`band-promo.webp`, `band-promo-mobile.webp`, `merch-1/2/3.webp`, capas de single, `ereboros-logo.webp`). Os JPG/PNG originais permanecem no repositório como origem e fallback; **`band-promo.jpg` é mantido de propósito** porque é o `og:image` (alguns scrapers de redes sociais não processam WebP), e vale o mesmo para os `*-og.jpg` de capas e produtos. Ao reotimizar, regenere o WebP com `npx sharp-cli -i <origem> -o assets/ -f webp -q 80` (logo: `--lossless`). As imagens acima da dobra têm `<link rel="preload" as="image">` no `index.html` por serem candidatas a LCP: `band-promo.webp` (`min-width: 721px`), `band-promo-mobile.webp` (`max-width: 720px`) e `ereboros-logo.webp`. **Mantenha a URL do preload idêntica à usada no CSS**, senão o navegador baixa as duas versões. A pasta `uploads/` contém os arquivos-fonte originais (nomes com espaços) e **não é referenciada em runtime**. Os PNG soltos na raiz (`accent-*.png`, `contato*.png`, `newsletter-*.png` etc.) são capturas de referência visual, não assets servidos.

**Performance — fontes e terceiros.** As fontes do Google são carregadas **sem bloquear a renderização** (`<link rel="preload" as="style" onload="...rel='stylesheet'">` mais `<noscript>` fallback). O **MailerLite** (`universal.js`) **não** é carregado no boot: ele é injetado **sob demanda**, na primeira vez que o popover de newsletter abre (ver `Newsletter` em `components.jsx`), o que tira JS e CSS de terceiro do carregamento inicial. Os embeds de Spotify e YouTube usam **facade** (`LiteSpotify`/`LiteYouTube` em `sections.jsx`): uma capa clicável é renderizada primeiro e o iframe só é injetado quando o usuário clica, cortando JS e cookies de terceiro do carregamento inicial. Ao acrescentar um embed novo, use as facades em vez de um `<iframe>` direto. O menu hambúrguer fecha com `Esc`, e o `vercel.json` envia `X-Content-Type-Options` e `Referrer-Policy` em todas as rotas.

**Catch-all 404 → home.** O `vercel.json` tem um redirect permanente (308) que manda **qualquer URL inexistente para `/`** (e `/en/qualquer-coisa` para `/en/`), herança das URLs do site antigo (WordPress) que ficaram indexadas. Antes do catch-all há **redirects específicos por seção** que mapeiam URLs antigas para âncoras da página (`/biography` → `/#about`, `/product/*` e `/shop` → `/#store`, `/tour` e `/agenda` → `/#tour`, `/contact` e `/contato` → `/#booking` etc.). Ao descobrir novas URLs 404 no Search Console, adicione-as à regra da seção correspondente. Há ainda o redirect do apex (`ereboros.com` → `www.ereboros.com`), `/epk` e `/presskit` para a pasta do EPK no Google Drive, e `/fotg` para a landing do álbum. No Vercel, `redirects` são avaliados **antes** do filesystem, então o catch-all usa lookaheads negativos para excluir o que existe de verdade: `en`, `from-oblivion-to-the-grave`, `sl/`, `merch/`, `assets/`, o HTML de verificação do Google e as extensões de asset (`js`, `css`, `xml`, `txt`, imagens, fontes, `json`, `webmanifest`). **Ao adicionar uma página ou rota nova (ex.: `/press/`), adicione-a às exclusões do regex do catch-all**, senão ela será redirecionada para a home. Efeito colateral conhecido: `docs/` e `docs-internos/` são publicados mas não constam nas exclusões, portanto não são alcançáveis pela web.

**Nav responsiva.** No desktop a barra é um grid `1fr auto 1fr` (links · logo · links); o `.nav-panel` usa `display: contents` para que os grupos `.nav-left`/`.nav-right` participem desse grid (ordenados por `order`). Em telas `≤720px` ela vira um **menu hambúrguer**: o `.nav-burger` aparece e o `.nav-panel` vira um drawer abaixo da barra, controlado pelo estado `menuOpen` em `Nav`. Ao mexer na nav, valide os dois breakpoints, e cuide para que nenhuma seção crie scroll horizontal no mobile (o caso clássico foi `.contact-row`, com coluna fixa e URL sem quebra). O scroll suave (em `app.jsx`) recalcula o alvo a cada frame para compensar a altura variável da nav e da barra de anúncio.

## Documentação estrutural

Existe um caderno de manutenção mais detalhado no vault do Obsidian, em `Ereboros/Site/` (`C:\Users\falec\Documents\Obsidian Vault`): diretivas, decisões com o porquê de cada escolha, e referência de rotas, analytics, assets e integrações. Este `CLAUDE.md` é o resumo operacional; o caderno é onde mora o raciocínio.
