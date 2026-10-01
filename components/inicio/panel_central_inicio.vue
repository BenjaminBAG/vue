<template>
    <AreaDesplazamiento id="contenedor_panel_central_inicio">
        <div id="panel_central_inicio">
            <div id="contenedor_documento" v-html="contenidoRenderizado"></div>
        </div>
    </AreaDesplazamiento>
</template>

<script>
    import AreaDesplazamiento from '../otros/area_desplazamiento.vue';
    import { inicializarMarkdownEnPagina, procesarMarkdown } from '../../utils/markdown/markdown.js';

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
        components: {
            AreaDesplazamiento
        },
        mounted() {
            this.$nextTick(() => {
                inicializarMarkdownEnPagina(this.$el.querySelector('#contenedor_documento'));
            });
        },
        updated() {
            this.$nextTick(() => {
                inicializarMarkdownEnPagina(this.$el.querySelector('#contenedor_documento'));
            });
        },
        methods: {
            renderizarMermaid() {
                if (typeof window !== 'undefined' && window.mermaid) {
                    window.mermaid.initialize({
                        startOnLoad: false,
                        securityLevel: 'loose',
                        theme: 'default'
                    });
                }
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
                return procesarMarkdown(this.textoMarkdown, (titulos) => {
                    this.$nextTick(() => {
                    this.$emit('titulos-extraidos', titulos);
                    });
                });
            }
        },
        beforeUnmount() {
            if (typeof window !== 'undefined' && window.mermaid) {
                window.mermaid.initialize({ startOnLoad: false });
            }
        }
    };
</script>

<style scoped>
    #panel_central_inicio {
        grid-column: 2;
        grid-row: 2;
        padding: 2em;
        min-height: 0;
        overflow: visible;
    }
    @media (max-width: 768px) {
        #contenedor_panel_central_inicio{
            grid-column: 1 / 3;
            #panel_central_inicio {
                padding: 0;
                #contenedor_documento {
                    box-shadow: none;
                    padding: 1.5em 3em;
                }
            }
        }
    }
    #panel_central_inicio #contenedor_documento {
        height: 100%;
        min-height: calc(100vh - 10em);
        padding: 3em 6em;
        box-shadow: 0 0 0.5em 0.2em var(--beige);
        background-color: var(--blanco);
        font-size: 1em;
        max-width: 100%;
        box-sizing: border-box;
    }
</style>