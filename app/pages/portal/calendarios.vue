<template>
    <div id="pantalla_general_inicio">
        <BarraSuperiorInicio />
        <PanelLateralCalendarios
            @calendarios-seleccionados="actualizarCalendariosSeleccionados"
        />
        <PanelCentralCalendarios
            :calendarios-seleccionados="calendariosSeleccionados"
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
                calendariosSeleccionados: []
            }
        },
        methods: {
            actualizarCalendariosSeleccionados(calendarios) {
                this.calendariosSeleccionados = calendarios
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