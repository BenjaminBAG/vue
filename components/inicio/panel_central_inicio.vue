<template>
    <div id="panel_central_inicio">
        <div id="contenedor_documento" v-html="contenidoRenderizado"></div>
    </div>
</template>

<script>
    import { procesarMarkdown } from '../../utils/markdown/markdown.js';

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
                return this.documentoEnEdicion || MI_MARKDOWN;
            }

            return (
                this.documento?.contenidoMarkdown ||
                this.documento?.markdown ||
                this.documento?.contenido ||
                this.documento?.texto ||
                MI_MARKDOWN
            );
            },
            contenidoRenderizado() {
                // Llamamos al helper passing el texto y escuchando la extracción de títulos
                return procesarMarkdown(this.textoMarkdown, (titulos) => {
                    this.$nextTick(() => {
                    this.$emit('titulos-extraidos', titulos);
                    });
                });
            }
        }
    };
</script>

<style scoped>
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
        min-height: 80%;
        padding: 3em 6em;
        box-shadow: 0 0 0.5em 0.2em var(--beige);
        background-color: var(--blanco);
        font-size: 1em;
    }
    @media (max-width: 768px) {
        #panel_central_inicio #contenedor_documento {
            box-shadow: none;
            padding: 1.5em 3em;
        }
    }
    #panel_central_inicio #contenedor_documento {
        overflow: auto;
        max-width: 100%;
    }
</style>