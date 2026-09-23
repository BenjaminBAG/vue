<template>
    <div id="panel_central_inicio">
        <div id="contenedor_documento" v-html="contenidoRenderizado"></div>
    </div>
</template>

<script>
    import MarkdownIt from 'markdown-it';
    import markdownItAnchor from 'markdown-it-anchor';

    const MI_MARKDOWN = `# ¡Hola!<br><p style="color: gray">Selecciona un documento para empezar a leer...</p>`;

    export default {
        name: 'PanelCentralInicio',
        props: {
            documento: {
                type: Object,
                default: () => ({})
            },
            documentoEnEdicion: {
                type: String,
                default: ''
            },
            vistaActiva: {
                type: String,
                default: 'selector'
            }
        },
        computed: {
            textoMarkdown() {
                if (this.vistaActiva === 'editar' || this.vistaActiva === 'nuevo') {
                    return this.documentoEnEdicion || MI_MARKDOWN
                }

                return (
                    this.documento?.contenidoMarkdown ||
                    this.documento?.markdown ||
                    this.documento?.contenido ||
                    this.documento?.texto ||
                    MI_MARKDOWN
                )
            },
            contenidoRenderizado() {
                const titulos = [];

                const md = new MarkdownIt({ html: true, linkify: true })
                    .use(markdownItAnchor, {
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

                md.renderer.rules.paragraph_open = () => '<p class="p-markdown">';

                const html = md.render(this.textoMarkdown);

                this.$nextTick(() => {
                    this.$emit('titulos-extraidos', titulos);
                });

                return html;
            }
        }
    }
</script>

<style scoped>
    #contenedor_documento >>> .p-markdown {
        line-height: 1.6;
        margin-bottom: 1em;
        white-space: normal;
    }

    #panel_central_inicio {
        grid-column: 2;
        grid-row: 2;
        padding: 2em;
    }
    @media (max-width: 768px) {
        #panel_central_inicio {
            grid-column: 1 / 3;
            padding: 0;
        }
    }
    #panel_central_inicio #contenedor_documento {
        min-height: 300px;
        padding: 3em 6em;
        box-shadow: 0 0 0.5em 0.2em var(--beige);
    }
    @media (max-width: 768px) {
        #panel_central_inicio #contenedor_documento {
            box-shadow: none;
        }
    }
    #contenedor_documento {
        overflow: auto;
        max-width: 100%
    }
</style>