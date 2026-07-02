# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Site institucional de página única da banda **Ereboros** (death metal, Rio de Janeiro), bilíngue PT/EN. É um site **estático e sem dependências instaladas** (não há `package.json`, `node_modules`, bundler, testes nem linter): React 18 é carregado via CDN (`unpkg`). O JSX **não** é mais transpilado no navegador — ele é **pré-compilado para JS por um passo de build leve** (`build.mjs`, esbuild via `npx`, sem instalar nada no projeto). O navegador carrega apenas os `.js` gerados, sem Babel. Os `.jsx` são a **fonte editável**; os `.js` são artefatos.

> Histórico: até `?v=29` o site carregava `@babel/standalone` (~3 MB) e transpilava o JSX na main thread em runtime — era o maior gargalo de performance no mobile. Isso foi removido em favor da pré-compilação.

## Como rodar e publicar

```bash
# 1. Compilar o JSX → JS (necessário após editar qualquer .jsx)
node build.mjs

# 2. Servir localmente (qualquer servidor estático na raiz do projeto)
npx serve .
# ou
python -m http.server 8000
```

`build.mjs` faz duas coisas: (1) transpila `components.jsx`, `sections.jsx` e `app.jsx` para `.js` via esbuild (`npx`, nada instalado no projeto); (2) **gera `en/index.html`** a partir do `index.html` (PT), aplicando substituições de idioma validadas — se um alvo de tradução não for encontrado (texto editado), o build **falha** em vez de gerar uma página EN errada. **Sempre rode `node build.mjs` depois de editar um `.jsx` ou o `index.html`** e incremente o `?v=` (ver Cache-busting). `data.js` e `styles.css` são servidos direto (sem compilação). Ao editar meta tags/`<noscript>` do `index.html` que diferem por idioma, atualize também o array `REPLACEMENTS` em `build.mjs`.

Abra a porta servida. Não basta abrir `index.html` via `file://` — os scripts e os assets locais exigem origem HTTP.

Deploy é via **Vercel** (projeto já vinculado em `.vercel/project.json`):

```bash
vercel          # preview
vercel --prod   # produção
```

`.vercel/` está no `.gitignore` e não deve ser commitado.

## Arquitetura

`index.html` carrega os scripts **nesta ordem, que é significativa** (não há módulos/imports — tudo é global). Todos usam `defer`, que preserva a ordem de execução e não bloqueia o parse do HTML:

1. React + ReactDOM (CDN, com hashes SRI) — **sem Babel**
2. `data.js` — JS puro, define `window.EREBOROS_DATA`
3. `components.js`, `sections.js`, `app.js` — **gerados** por `build.mjs` a partir dos `.jsx`

**Padrão de globais:** cada `.jsx` define seus componentes/utilitários e os expõe com `Object.assign(window, {...})` no fim do arquivo; os arquivos seguintes os consomem como globais. Ao adicionar um componente novo, lembre de exportá-lo no `Object.assign` e de respeitar a ordem de carregamento (um componente só pode usar o que foi definido em arquivo anterior). O esbuild é rodado em modo `--minify-whitespace` (sem renomear identificadores), então os nomes globais são preservados intactos nos `.js`.

Divisão dos arquivos:

- **`data.js`** — todo o conteúdo e i18n num único objeto. **Para editar textos, faixas, datas de turnê, links etc., altere aqui** — os componentes apenas renderizam esse objeto.
- **`components.jsx`** — utilitários (`pick`, `useReveal`/`Reveal`), set de ícones SVG inline (`Icon`), e `Nav`, `Hero`, `About`, `SectionHead`, `Ornament`.
- **`sections.jsx`** — seções `Listen`, `Videos`, `Tour`, `Gallery`, `Store`, `Booking` e `Footer`.
- **`app.jsx`** — sistema de temas "Tweaks", o `App` raiz e o `ReactDOM.createRoot(...).render(...)`.
- **`styles.css`** — design system inteiro via CSS custom properties.

## Convenções específicas deste projeto

**i18n.** Toda string visível ao usuário tem o formato `{ pt: "...", en: "..." }` e é resolvida por `pick(valor, lang)` (de `components.jsx`). Ao adicionar conteúdo, sempre forneça as duas línguas.

**Idioma ligado à URL (bilíngue indexável).** `/` serve PT e `/en/` serve EN — duas URLs estáticas, cada uma com o HTML no idioma certo (a EN é gerada pelo `build.mjs`), com `hreflang` cruzado e `canonical` próprio. Cada página injeta `window.EREBOROS_LANG` (`"pt"`/`"en"`), que define o idioma inicial do React (`app.jsx`). O toggle PT/EN na nav troca o idioma **sem recarregar** (History API `pushState` para `/` ou `/en/`) e mantém `document.documentElement.lang`; o botão Voltar é respeitado via `popstate`. **Não usa mais `localStorage`** para o idioma — a URL é a fonte da verdade. Por isso os assets são referenciados por **caminho absoluto** (`/assets/...`, `/app.js` etc.) no HTML e no JS (`components.jsx` nav, `sections.jsx` galeria, `data.js` merch), para resolverem tanto em `/` quanto em `/en/`. As `url()` do `styles.css` são relativas ao próprio CSS (raiz), então não precisam de ajuste.

**Temas "Tweaks".** O objeto `TWEAK_DEFAULTS` em `app.jsx` está cercado pelos marcadores `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` — não remova esses marcadores. `applyTweaks` traduz accent/background para CSS custom properties (`--oxide`, `--oxide-bright`, `--ink`, `--ink-2`, `--ink-3`) no `:root`. Há um protocolo de "edit mode" via `postMessage` (mensagens `__edit_mode_available`, `__activate_edit_mode`, `__deactivate_edit_mode`, `__edit_mode_set_keys`) para integração quando o site roda dentro de um frame de uma ferramenta de edição externa.

**Numerais das seções.** São algarismos romanos por padrão; o tweak `capitals: "arabic"` reescreve `i18n.sections.*.num` clonando o objeto i18n em runtime.

**Cache-busting.** `index.html` referencia os assets com query de versão (atualmente `?v=35`): `styles.css`, `data.js`, `components.js`, `sections.js`, `app.js`. **Ao editar qualquer um desses arquivos (ou seu `.jsx` de origem), incremente o número de versão** (de preferência todos juntos) para invalidar o cache do navegador. Isso é ainda mais importante porque o `vercel.json` agora serve `.js`/`.css`/imagens com `Cache-Control: max-age=31536000, immutable` — o navegador não revalida, só refaz o fetch quando a URL (com `?v=`) muda. As imagens em `assets/` não usam `?v=` (o `immutable` vale pelo nome do arquivo); ao reotimizar uma imagem mantendo o nome, troque o nome ou adicione uma query.

**Logo.** O wordmark é renderizado por CSS `mask-image` sobre `assets/ereboros-logo.webp` (classe `.logo-mark`), colorido por `--oxide-bright` — não é uma `<img>` no hero/footer. O `.webp` é **lossless** (preserva o canal alpha que define a forma da máscara). A nav usa o mesmo `.webp` numa `<img>`.

**Assets / imagens.** As imagens de conteúdo são servidas em **WebP** (`band-promo.webp`, `merch-1/2/3.webp`, `ereboros-logo.webp`). Os JPG/PNG originais permanecem no repositório como origem e fallback; **`band-promo.jpg` é mantido de propósito** porque é o `og:image` (alguns scrapers de redes sociais não processam WebP). Ao reotimizar, regenere o WebP com `npx sharp-cli -i <origem> -o assets/ -f webp -q 80` (logo: `--lossless`). As imagens acima da dobra (`band-promo.webp` e `ereboros-logo.webp`) têm `<link rel="preload" as="image">` no `index.html` por serem candidatas a LCP — mantenha a URL do preload idêntica à usada no CSS. A pasta `uploads/` contém os arquivos-fonte originais (nomes com espaços) e **não é referenciada em runtime**.

**Performance — fontes e terceiros.** As fontes do Google são carregadas **sem bloquear a renderização** (`<link rel="preload" as="style" onload="...rel='stylesheet'">` + `<noscript>` fallback). O **MailerLite** (`universal.js`) **não** é carregado no boot: ele é injetado **sob demanda**, na primeira vez que o popover de newsletter abre (ver `Newsletter` em `components.jsx`) — isso tira JS e CSS de terceiro do carregamento inicial. Os embeds de Spotify/YouTube usam **facade** (`LiteSpotify`/`LiteYouTube` em `sections.jsx`): uma capa clicável é renderizada primeiro e o iframe só é injetado quando o usuário clica — corta JS e cookies de terceiro do carregamento inicial. O menu hambúrguer fecha com `Esc`, e o `vercel.json` envia `X-Content-Type-Options` e `Referrer-Policy` em todas as rotas.

**Catch-all 404 → home.** O `vercel.json` tem um redirect permanente (308) que manda **qualquer URL inexistente para `/`** (e `/en/qualquer-coisa` para `/en/`) — herança das URLs do site antigo (WordPress) que ficaram indexadas. Antes do catch-all há **redirects específicos por seção** que mapeiam URLs antigas para âncoras da página (`/biography` → `/#about`, `/product/*`,`/shop` → `/#store`, `/tour`,`/agenda` → `/#tour`, `/contact`,`/contato` → `/#booking` etc.) — ao descobrir novas URLs 404 no Search Console, adicione-as à regra da seção correspondente. No Vercel, `redirects` são avaliados **antes** do filesystem, então o catch-all usa lookaheads negativos para excluir o que existe de verdade: `/en`, `/assets/`, o HTML de verificação do Google e as extensões de asset (`js`, `css`, `xml`, `txt`, imagens, fontes...). **Ao adicionar uma página ou rota nova (ex.: `/press/`), adicione-a às exclusões do regex do catch-all**, senão ela será redirecionada para a home.

**Nav responsiva.** No desktop a barra é um grid `1fr auto 1fr` (links · logo · links); o `.nav-panel` usa `display: contents` para que os grupos `.nav-left`/`.nav-right` participem desse grid (ordenados por `order`). Em telas `≤720px` ela vira um **menu hambúrguer**: o `.nav-burger` aparece e o `.nav-panel` vira um drawer abaixo da barra, controlado pelo estado `menuOpen` em `Nav`. Ao mexer na nav, valide os dois breakpoints — e cuide para que nenhuma seção crie scroll horizontal no mobile (o caso clássico foi `.contact-row`, com coluna fixa + URL sem quebra).
