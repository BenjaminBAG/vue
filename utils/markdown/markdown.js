import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItContainer from 'markdown-it-container';
import markdownItHighlightJs from 'markdown-it-highlightjs';
import markdownItMark from 'markdown-it-mark'; // Soporte para ==texto==
import hljs from 'highlight.js';

// Helper para contenedores tipo ::: info
function registrarContenedor(md, nombre) {
  md.use(markdownItContainer, nombre, {
    validate: (params) => params.trim().match(new RegExp(`^${nombre}\\s*(.*)$`)),
    render: (tokens, idx) => {
      const match = tokens[idx].info.trim().match(new RegExp(`^${nombre}\\s*(.*)$`));
      if (tokens[idx].nesting === 1) {
        const titulo = match && match[1] ? match[1] : nombre.toUpperCase();
        return `<div class="md-container md-container--${nombre}">
                  <p class="md-container__title">${md.utils.escapeHtml(titulo)}</p>
                  <div class="md-container__content">\n`;
      } else {
        return '</div></div>\n';
      }
    }
  });
}

function crearInstanciaMarkdown() {
  const md = new MarkdownIt({ html: true, linkify: true, highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (err) {
        // fallback silencioso
      }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {
      return md.utils.escapeHtml(str);
    }
  }})
    .use(markdownItMark)
    .use(markdownItHighlightJs, { inline: false });

  ['info', 'warning', 'danger', 'success', 'note'].forEach((tipo) => {
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

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    return `<code class="md-code-inline">${md.utils.escapeHtml(token.content)}</code>`;
  };

  md.renderer.rules.code_block = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const codigo = token.content || '';
    return `<pre class="md-code-block"><code class="hljs md-code-fence">${md.utils.escapeHtml(codigo)}</code></pre>`;
  };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const lang = token.info ? token.info.trim().split(/\s+/)[0] : 'plaintext';
    const codigo = token.content || '';
    const highlighted = lang && hljs.getLanguage(lang)
      ? hljs.highlight(codigo, { language: lang, ignoreIllegals: true }).value
      : hljs.highlightAuto(codigo).value;
    return `<pre class="md-code-block"><code class="hljs md-code-fence language-${lang}">${highlighted}</code></pre>`;
  };

  return md;
}

/**
 * Función principal para renderizar Markdown y emitir los títulos.
 */
export function procesarMarkdown(texto, onTitulosExtraidos) {
  const titulos = [];
  const md = crearInstanciaMarkdown();

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

  const html = md.render(texto || '');

  if (typeof onTitulosExtraidos === 'function') {
    onTitulosExtraidos(titulos);
  }

  return html;
}