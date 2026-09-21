<template>
    <div id="pantalla_general_inicio">
        <BarraSuperiorInicio />
        <PanelLateralInicio />
        <PanelCentralInicio />
    </div>
</template>

<script>
    import BarraSuperiorInicio from '../../../components/inicio/barra_superior_inicio.vue'
    import PanelLateralInicio from '../../../components/inicio/panel_lateral_inicio.vue'
    import PanelCentralInicio from '../../../components/inicio/panel_central_inicio.vue'

    export default {
        components: {
            BarraSuperiorInicio,
            PanelLateralInicio,
            PanelCentralInicio
        }
    }
</script>

<style>
    * {
        font-family: var(--fuente-regular);
    }
    #pantalla_general_inicio {
        width: 100%;
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 75px 100%;
    }
</style>