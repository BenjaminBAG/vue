<template>
    <div id="pantalla_general_inicio">
        <BarraSuperiorInicio />
        <PanelLateralInicio
            :titulos="titulos"
            :vista-activa="vistaActiva"
            @documento-seleccionado="actualizarDocumentoSeleccionado"
            @vista-cambiada="actualizarVista"
            @contenido-editor-cambiado="actualizarContenidoEnEdicion"
        />
        <PanelCentralInicio
            :documento="documentoSeleccionado"
            :documento-en-edicion="documentoEnEdicion"
            :vista-activa="vistaActiva"
            @titulos-extraidos="actualizarTitulos"
        />
    </div>
</template>

<script>
    import BarraSuperiorInicio from '../../../components/barra_superior/barra_superior_inicio.vue'
    import PanelLateralInicio from '../../../components/inicio/panel_lateral_inicio.vue'
    import PanelCentralInicio from '../../../components/inicio/panel_central_inicio.vue'

    export default {
        components: {
            BarraSuperiorInicio,
            PanelLateralInicio,
            PanelCentralInicio
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