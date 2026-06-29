# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Site institucional de página única da banda **Ereboros** (death metal, Rio de Janeiro), bilíngue PT/EN. É um site **estático, sem build e sem dependências instaladas**: React 18 e Babel são carregados via CDN (`unpkg`) e o JSX é transpilado **no navegador, em tempo de execução**. Não há `package.json`, `node_modules`, bundler, testes nem linter.

## Como rodar e publicar

```bash
# Servir localmente (qualquer servidor estático na raiz do projeto)
npx serve .
# ou
python -m http.server 8000
```

Abra a porta servida. Não basta abrir `index.html` via `file://` — os scripts `type="text/babel"` e os assets locais exigem origem HTTP.

Deploy é via **Vercel** (projeto já vinculado em `.vercel/project.json`):

```bash
vercel          # preview
vercel --prod   # produção
```

`.vercel/` está no `.gitignore` e não deve ser commitado.

## Arquitetura

`index.html` carrega os scripts **nesta ordem, que é significativa** (não há módulos/imports — tudo é global):

1. React + ReactDOM + Babel Standalone (CDN, com hashes SRI)
2. `data.js` — JS puro, define `window.EREBOROS_DATA`
3. `components.jsx`, `sections.jsx`, `app.jsx` — todos `type="text/babel"`

**Padrão de globais:** cada `.jsx` define seus componentes/utilitários e os expõe com `Object.assign(window, {...})` no fim do arquivo; os arquivos seguintes os consomem como globais. Ao adicionar um componente novo, lembre de exportá-lo no `Object.assign` e de respeitar a ordem de carregamento (um componente só pode usar o que foi definido em arquivo anterior).

Divisão dos arquivos:

- **`data.js`** — todo o conteúdo e i18n num único objeto. **Para editar textos, faixas, datas de turnê, links etc., altere aqui** — os componentes apenas renderizam esse objeto.
- **`components.jsx`** — utilitários (`pick`, `useReveal`/`Reveal`), set de ícones SVG inline (`Icon`), e `Nav`, `Hero`, `About`, `SectionHead`, `Ornament`.
- **`sections.jsx`** — seções `Listen`, `Videos`, `Tour`, `Gallery`, `Store`, `Booking` e `Footer`.
- **`app.jsx`** — hook de áudio `usePlayer` + `PlayerBar`, sistema de temas "Tweaks", o `App` raiz e o `ReactDOM.createRoot(...).render(...)`.
- **`styles.css`** — design system inteiro via CSS custom properties.

## Convenções específicas deste projeto

**i18n.** Toda string visível ao usuário tem o formato `{ pt: "...", en: "..." }` e é resolvida por `pick(valor, lang)` (de `components.jsx`). O idioma fica em estado React e persiste em `localStorage["ereboros.lang"]`. Ao adicionar conteúdo, sempre forneça as duas línguas.

**Temas "Tweaks".** O objeto `TWEAK_DEFAULTS` em `app.jsx` está cercado pelos marcadores `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` — não remova esses marcadores. `applyTweaks` traduz accent/background para CSS custom properties (`--oxide`, `--oxide-bright`, `--ink`, `--ink-2`, `--ink-3`) no `:root`. Há um protocolo de "edit mode" via `postMessage` (mensagens `__edit_mode_available`, `__activate_edit_mode`, `__deactivate_edit_mode`, `__edit_mode_set_keys`) para integração quando o site roda dentro de um frame de uma ferramenta de edição externa.

**Numerais das seções.** São algarismos romanos por padrão; o tweak `capitals: "arabic"` reescreve `i18n.sections.*.num` clonando o objeto i18n em runtime.

**Cache-busting.** `index.html` referencia os assets com query de versão (atualmente `?v=24`): `styles.css`, `data.js`, `components.jsx`, `sections.jsx`, `app.jsx`. **Ao editar qualquer um desses arquivos, incremente o número de versão** (de preferência todos juntos) para invalidar o cache do navegador — sem isso, o Babel/CSS pode rodar a versão antiga em cache, inclusive para visitantes recorrentes após o deploy.

**Logo.** O wordmark é renderizado por CSS `mask-image` sobre `assets/ereboros-logo.png` (classe `.logo-mark`), colorido por `--oxide-bright` — não é uma `<img>` no hero/footer.

**Assets.** O código referencia somente `assets/` (`ereboros-logo.png`, `band-promo.jpg`). A pasta `uploads/` contém os arquivos-fonte originais (nomes com espaços) e **não é referenciada em runtime** — são as origens das versões em `assets/`.
