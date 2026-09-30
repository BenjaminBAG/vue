<template>
    <div id="pantalla_general_inicio" :class="{ 'menu-abierto': menuAbierto }">
        <BarraSuperiorInicio />
        <PanelLateralCalendarios
            class="panel-lateral-movil"
            @calendarios-seleccionados="actualizarCalendariosSeleccionados"
        />
        <PanelCentralCalendarios
            :calendarios-seleccionados="calendariosSeleccionados"
        />
        <button
            class="boton-toggle-movil"
            type="button"
            :aria-expanded="menuAbierto"
            :aria-label="menuAbierto ? 'Cerrar menú lateral' : 'Abrir menú lateral'"
            @click="menuAbierto = !menuAbierto"
        >
            {{ menuAbierto ? '✕' : '☰' }}
        </button>
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
                calendariosSeleccionados: [],
                menuAbierto: false
            }
        },
        methods: {
            actualizarCalendariosSeleccionados(calendarios) {
                this.calendariosSeleccionados = calendarios
                this.menuAbierto = false
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
        height: 100vh;
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 75px minmax(0, 1fr);
        background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
        overflow: hidden;
    }
    .boton-toggle-movil {
        display: none;
    }
    @media (max-width: 768px) {
        #pantalla_general_inicio {
            grid-template-columns: minmax(0, 1fr);
        }
        #pantalla_general_inicio > #barra_superior {
            grid-column: 1;
        }
        #pantalla_general_inicio > #contenedor_panel_central_calendarios {
            grid-column: 1;
            grid-row: 2;
            min-width: 0;
        }
        .boton-toggle-movil {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            right: 1.25em;
            bottom: 1.25em;
            width: 55px;
            height: 55px;
            border: 0;
            border-radius: 50%;
            background: #333;
            color: #fff;
            font-size: 1.5em;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            z-index: 2000;
            transition: transform 0.2s ease;
        }
        .boton-toggle-movil:active {
            transform: scale(0.9);
        }
        #pantalla_general_inicio > .panel-lateral-movil {
            position: fixed;
            top: 75px;
            left: 0;
            width: min(280px, 85vw);
            height: calc(100vh - 75px);
            box-sizing: border-box;
            background-color: var(--blanco, #fff);
            z-index: 1999;
            box-shadow: 5px 0 15px rgba(0, 0, 0, 0.15);
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }
        #pantalla_general_inicio.menu-abierto > .panel-lateral-movil {
            transform: translateX(0);
        }
    }
</style>