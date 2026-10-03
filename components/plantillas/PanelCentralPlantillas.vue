<template>
    <div id="panel_central_plantilla">
        <iframe 
            id="contenedor_documento" 
            :src="urlPlantilla" 
            frameborder="0"
            >
        </iframe>
    </div>
</template>

<script>
    export default {
        name: 'PanelCentralPlantillas',
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
            urlPlantilla() {
                if (this.vistaActiva === 'nuevo') return this.documentoEnEdicion || '';
                return this.documento?.urlDocumento || this.documentoEnEdicion || '';
            },
        }
    }
</script>

<style scoped>
    #panel_central_plantilla {
        grid-column: 2;
        grid-row: 2;
        padding: 2em;
        #contenedor_documento {
            width: 100%;
            max-width: 100%;
            min-height: calc(100vh - 10em);
            padding: 0;
            box-shadow: 0 0 0.5em 0.2em var(--beige);
            background-color: var(--blanco);
            overflow: auto;
        }
    }
    @media (max-width: 768px) {
        #panel_central_plantilla {
            grid-column: 1 / 3;
            padding: 0;
            #contenedor_documento {
                box-shadow: none;
            }
        }
    }
</style>
