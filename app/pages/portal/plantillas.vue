<template>
    <div id="pantalla_general_inicio">
        <BarraSuperiorInicio />
        <PanelLateralPlantillas
            :titulos="titulos"
            :vista-activa="vistaActiva"
            @documento-seleccionado="actualizarDocumentoSeleccionado"
            @vista-cambiada="actualizarVista"
            @contenido-editor-cambiado="actualizarContenidoEnEdicion"
        />
        <PanelCentralPlantillas
            :documento="documentoSeleccionado"
            :documento-en-edicion="documentoEnEdicion"
            :vista-activa="vistaActiva"
            @titulos-extraidos="actualizarTitulos"
        />
    </div>
</template>

<script>
    import BarraSuperiorInicio from '../../../components/barra_superior/barra_superior_inicio.vue'
    import PanelLateralPlantillas from '../../../components/plantillas/panel_lateral_plantillas.vue'
    import PanelCentralPlantillas from '../../../components/plantillas/panel_central_plantillas.vue'

    export default {
        components: {
            BarraSuperiorInicio,
            PanelLateralPlantillas,
            PanelCentralPlantillas
        },
        data() {
            return {
                titulos: [],
                vistaActiva: 'selector',
                documentoSeleccionado: null,
                documentoEnEdicion: ''
            }
        },
        methods: {
            actualizarTitulos(listaTitulos) {
                this.titulos = listaTitulos
            },
            actualizarVista(nuevaVista) {
                this.vistaActiva = nuevaVista
            },
            actualizarDocumentoSeleccionado(documento) {
                this.documentoSeleccionado = documento
                this.documentoEnEdicion = documento?.contenidoMarkdown || documento?.contenido || ''
            },
            actualizarContenidoEnEdicion(nuevoTexto) {
                this.documentoEnEdicion = nuevoTexto
            }
        }
    }
</script>

<style>
    * {
        font-family: var(--fuente-regular);
    }
    #pantalla_general_inicio {
        width: 100%;
        min-height: 100vh;
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 75px 100%;
        background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
    }
</style>