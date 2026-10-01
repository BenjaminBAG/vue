import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import markdownItHighlightJs from 'markdown-it-highlightjs';
import markdownItMark from 'markdown-it-mark';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItKatex from 'markdown-it-katex';
import mermaid from 'mermaid';
import hljs from 'highlight.js';

const ICONOS_MAP = {
  info: 'info',
  warning: 'triangle-alert',
  danger: 'octagon-alert',
  success: 'circle-check',
  note: 'sticky-note',
  tip: 'lightbulb',
  important: 'zap',
  check: 'check',
  sparkles: 'sparkles',
  play: 'play',
  video: 'clapperboard',
  link: 'link',
  star: 'star',
  heart: 'heart',
  moon: 'moon',
  code: 'code-xml',
  camera: 'camera'
};

function convertirCalloutsGitHub(texto = '') {
  if (!texto) return '';

  const lineas = texto.split(/\r?\n/);
  const salida = [];
  let indice = 0;

  while (indice < lineas.length) {
    const linea = lineas[indice];
    const coincidencia = linea.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);

    if (!coincidencia) {
      salida.push(linea);
      indice += 1;
      continue;
    }

    const tipo = coincidencia[1].toLowerCase();
    salida.push(`::: ${tipo}`);
    indice += 1;

    while (indice < lineas.length && lineas[indice].startsWith('>')) {
      const contenidoLinea = lineas[indice].replace(/^>\s?/, '');
      if (contenidoLinea.trim() !== '') {
        salida.push(contenidoLinea);
      }
      indice += 1;
    }

    salida.push(':::');
  }

  return salida.join('\n');
}

function reemplazarIconosInline(texto = '') {
  if (!texto) return '';

  return texto.replace(/:([a-zA-Z0-9_-]+):/g, (total, nombre) => {
    const clave = nombre.toLowerCase();
    const icono = ICONOS_MAP[clave] || clave;
    return `<img class="md-icon md-icon--${clave}" src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${icono}.svg" alt="${nombre}" loading="lazy" />`;
  });
}

function esVideoUrl(url = '') {
  if (!url) return false;
  const valor = url.toLowerCase();
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/.test(valor)
    || /youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com/.test(valor);
}

function convertirTablasMarkdown(texto = '') {
  if (!texto) return '';

  const lineas = texto.split(/\r?\n/);
  const salida = [];
  let indice = 0;

  while (indice < lineas.length) {
    const lineaActual = lineas[indice] ?? '';
    const siguiente = lineas[indice + 1] ?? '';
    const tieneCabecera = lineas[indice] && lineas[indice].includes('|');
    const esSeparador = /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(siguiente.trim());

    if (!tieneCabecera || !esSeparador) {
      salida.push(lineaActual);
      indice += 1;
      continue;
    }

    const filas = [lineaActual];
    let j = indice + 2;
    while (j < lineas.length && lineas[j].includes('|')) {
      filas.push(lineas[j]);
      j += 1;
    }

    const parsearFila = (fila) => fila
      .trim()
      .split('|')
      .map((celda) => celda.trim())
      .filter((_, indiceCelda, arreglo) => {
        if (indiceCelda === 0 && !arreglo[0]) return false;
        if (indiceCelda === arreglo.length - 1 && !arreglo[arreglo.length - 1]) return false;
        return true;
      });

    const cabeceras = parsearFila(filas[0]);
    const filasDatos = filas.slice(1).map((fila) => parsearFila(fila));

    const crearCelda = (valor, tipo = 'td') => `<${tipo}>${valor}</${tipo}>`;
    const html = [
      '<table class="md-table">',
      '<thead><tr>' + cabeceras.map((valor) => crearCelda(valor, 'th')).join('') + '</tr></thead>',
      '<tbody>' + filasDatos.map((fila) => '<tr>' + fila.map((valor) => crearCelda(valor)).join('') + '</tr>').join('') + '</tbody>',
      '</table>'
    ].join('');

    salida.push(html);
    indice = j;
  }

  return salida.join('\n');
}

function registrarContenedor(md, nombre) {
  md.use(markdownItContainer, nombre, {
    validate: (params) => params.trim().match(new RegExp(`^${nombre}(?:\\s+(.*))?$`)),
    render: (tokens, idx) => {
      const token = tokens[idx];
      const info = token.info ? token.info.trim() : '';
      const match = info.match(new RegExp(`^${nombre}(?:\\s+(.*))?$`));
      const titulo = match && match[1] ? match[1].trim() : nombre.toUpperCase();

      if (token.nesting === 1) {
        if (nombre === 'details') {
          return `<details class="md-container md-container--details"><summary>${md.utils.escapeHtml(titulo)}</summary><div class="md-container__content">\n`;
        }

        return `<div class="md-container md-container--${nombre}"><p class="md-container__title">${md.utils.escapeHtml(titulo)}</p><div class="md-container__content">\n`;
      }

      return nombre === 'details' ? '</div></details>\n' : '</div></div>\n';
    }
  });
}

function crearInstanciaMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
        } catch (err) {
          // fallback silencioso
        }
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {
        return md.utils.escapeHtml(str);
      }
    }
  })
    .use(markdownItFootnote)
    .use(markdownItKatex, { throwOnError: false, errorColor: '#cc0000', delimiters: 'dollars' })
    .use(markdownItMark)
    .use(markdownItHighlightJs, { inline: false });

  ['info', 'warning', 'danger', 'success', 'note', 'tip', 'important', 'details'].forEach((tipo) => {
    registrarContenedor(md, tipo);
  });

  const mapeoClases = {
    paragraph_open: 'md-p',
    heading_open: (token) => `md-h md-${token.tag}`,
    bullet_list_open: 'md-ul',
    ordered_list_open: 'md-ol',
    list_item_open: 'md-li',
    blockquote_open: 'md-blockquote',
    table_open: 'md-table',
    table_close: 'md-table',
    hr: 'md-hr'
  };

  Object.entries(mapeoClases).forEach(([regla, clase]) => {
    md.renderer.rules[regla] = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const nombreClase = typeof clase === 'function' ? clase(token) : clase;
      token.attrJoin('class', nombreClase);
      return self.renderToken(tokens, idx, options);
    };
  });

  md.renderer.rules.code_inline = (tokens, idx) => {
    const token = tokens[idx];
    return `<code class="md-code-inline">${md.utils.escapeHtml(token.content)}</code>`;
  };

  md.renderer.rules.code_block = (tokens, idx) => {
    const token = tokens[idx];
    const codigo = token.content || '';
    return `<pre class="md-code-block"><code class="hljs md-code-fence">${md.utils.escapeHtml(codigo)}</code></pre>`;
  };

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const info = token.info ? token.info.trim() : '';
    const lang = info.split(/\s+/)[0].toLowerCase();
    const codigo = token.content || '';

    if (lang === 'mermaid') {
      return `<pre class="md-code-block md-mermaid-block"><code class="mermaid">${md.utils.escapeHtml(codigo)}</code></pre>`;
    }

    if (lang === 'video' || lang === 'mp4' || lang === 'webm' || lang === 'ogg') {
      return `<video class="md-video" controls preload="metadata" src="${md.utils.escapeHtml(codigo.trim())}"></video>`;
    }

    const highlighted = lang && hljs.getLanguage(lang)
      ? hljs.highlight(codigo, { language: lang, ignoreIllegals: true }).value
      : hljs.highlightAuto(codigo).value;

    return `<pre class="md-code-block"><code class="hljs md-code-fence language-${lang || 'plaintext'}">${highlighted}</code></pre>`;
  };

  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx];
    const src = token.attrGet('src') || '';
    const alt = token.content || token.attrGet('alt') || '';
    const titulo = token.attrGet('title') ? ` title="${md.utils.escapeHtml(token.attrGet('title'))}"` : '';

    if (esVideoUrl(src)) {
      return `<video class="md-video" controls preload="metadata" src="${md.utils.escapeHtml(src)}"${titulo}></video>`;
    }

    return `<img class="md-image" src="${md.utils.escapeHtml(src)}" alt="${md.utils.escapeHtml(alt)}" loading="lazy"${titulo} />`;
  };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const href = token.attrGet('href') || '';
    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer nofollow');

    if (esVideoUrl(href)) {
      token.attrJoin('class', 'md-link-video');
    }

    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.footnote_ref = (tokens, idx) => {
    const id = tokens[idx].meta.id;
    return `<sup class="md-footnote__ref"><a href="#fn${id}" id="fnref${id}" class="md-footnote__link">[^${id}]</a></sup>`;
  };

  md.renderer.rules.footnote_block_open = () => '<section class="md-footnote">';
  md.renderer.rules.footnote_block_close = () => '</section>';

  return md;
}

export function procesarMarkdown(texto, onTitulosExtraidos) {
  const titulos = [];
  const md = crearInstanciaMarkdown();

  const textoPreparado = convertirTablasMarkdown(
    reemplazarIconosInline(convertirCalloutsGitHub(texto || ''))
  );

  md.use(markdownItAnchor, {
    slugify: (str) =>
      encodeURIComponent(
        String(str)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
      ),
    callback: (token, info) => {
      titulos.push({
        texto: info.title,
        slug: token.attrGet('id'),
        nivel: Number(token.tag.replace('h', ''))
      });
    }
  });

  const html = md.render(textoPreparado);

  if (typeof onTitulosExtraidos === 'function') {
    onTitulosExtraidos(titulos);
  }

  return html;
}

export function inicializarMarkdownEnPagina(rootElement) {
  if (typeof window === 'undefined' || !rootElement) return;

  if (!window.mermaid) {
    window.mermaid = mermaid;
  }

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'default'
  });

  const diagramas = rootElement.querySelectorAll('.mermaid');
  diagramas.forEach((bloque, indice) => {
    if (bloque.dataset.mermaidRendered === 'true') return;

    const codigo = (bloque.textContent || '').trim();
    if (!codigo) return;

    const contenedor = document.createElement('div');
    contenedor.className = 'md-mermaid';
    contenedor.dataset.mermaidRendered = 'true';
    bloque.replaceWith(contenedor);

    window.mermaid.render(`mermaid-${Date.now()}-${indice}`, codigo)
      .then(({ svg }) => {
        contenedor.innerHTML = svg;
      })
      .catch(() => {
        contenedor.innerHTML = `<pre class="md-code-block">${document.createTextNode(codigo).textContent}</pre>`;
      });
  });
}
