<template>
    <div id="panel_central_inicio">
        <div id="contenedor_documento" v-html="contenidoRenderizado"></div>
    </div>
</template>

<script>
    import MarkdownIt from 'markdown-it';
    // Para instalar: npm install markdown-it

const MI_MARKDOWN = `
# Título Personalizado
## Subtitulo
1. sd
2. sdfsd
3. dsfdf
    1. sdf
    2. sdffd

Este es un enlace a [Google](https://google.com).
`;

    export default {
        name: 'PanelCentralInicio',
        data() {
            return {
            textoMarkdown: MI_MARKDOWN
            }
        },
        computed: {
            contenidoRenderizado() {
            // 1. Instanciamos markdown-it con opciones básicas (ej. habilitar HTML si lo deseas)
            const md = new MarkdownIt({
                html: true,
                linkify: true
            });

            // 2. Ajustamos el parseo: Añadimos una clase de CSS a todos los párrafos (<p>)
            md.renderer.rules.paragraph_open = () => {
                return '<p class="parrafo-markdown">';
            };

            // 3. Renderizamos
            return md.render(this.textoMarkdown);
            }
        }
    }
</script>

<style scoped>
    /* Ahora puedes controlar los estilos directamente apuntando a las clases inyectadas */
    #contenedor_documento >>> .parrafo-markdown {
    color: var(--naranja);
    font-weight: bold;
    line-height: 1.6;
    margin-bottom: 1em;
    }
    #panel_central_inicio {
        grid-column: 2;
        grid-row: 2;
        padding: 2em;
    }
    #panel_central_inicio #contenedor_documento {
        min-height: 300px;
        padding: 3em 6em;
        box-shadow: 0 0 0.5em 0.2em var(--beige);
    }
</style>
