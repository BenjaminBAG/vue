<template>
    <div id="pantalla_general_inicio">
        <BarraSuperiorInicio />
        <PanelLateralCalendarios
            :titulos="titulos"
            :vista-activa="vistaActiva"
            @documento-seleccionado="actualizarDocumentoSeleccionado"
            @vista-cambiada="actualizarVista"
            @contenido-editor-cambiado="actualizarContenidoEnEdicion"
        />
        <PanelCentralCalendarios
            :documento="documentoSeleccionado"
            :documento-en-edicion="documentoEnEdicion"
            :vista-activa="vistaActiva"
            @titulos-extraidos="actualizarTitulos"
        />
    </div>
</template>

<script>
    import BarraSuperiorInicio from '../../../components/barra_superior/barra_superior_inicio.vue'
    import PanelLateralCalendarios from '../../../components/calendarios/panel_lateral_calendarios.vue'
    import PanelCentralCalendarios from '../../../components/calendarios/panel_central_calendarios.vue'

    export default {
        components: {
            BarraSuperiorInicio,
            PanelLateralCalendarios,
            PanelCentralCalendarios
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