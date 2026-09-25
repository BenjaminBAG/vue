<template>
    <div id="panel_central_plantilla">
        <!-- Usamos v-bind (:src) para pasar la URL dinámica -->
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
            // Si pasas el objeto completo del documento
            documento: {
                type: Object,
                default: () => ({})
            },
            // Si prefieres pasar directamente la URL como string
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
    }
    @media (max-width: 768px) {
        #panel_central_plantilla {
            grid-column: 1 / 3;
            padding: 0;
    }
    }
    #panel_central_plantilla #contenedor_documento {
        width: 100%;
        min-height: 80%;
        padding: 0;
        box-shadow: 0 0 0.5em 0.2em var(--beige);
        background-color: var(--blanco);
        overflow: auto;
        max-width: 100%;
    }
    @media (max-width: 768px) {
        #panel_central_plantilla #contenedor_documento {
            box-shadow: none;
            padding: 1.5em 3em;
        }
    }
</style>
