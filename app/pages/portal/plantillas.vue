<script setup>
    import { ref } from 'vue'
    import BarraSuperiorInicio from '../../../components/barraSuperior/BarraSuperiorInicio.vue'
    import PanelLateralPlantillas from '../../../components/plantillas/PanelLateralPlantillas.vue'
    import PanelCentralPlantillas from '../../../components/plantillas/PanelCentralPlantillas.vue'

    const titulos = ref([])
    const menuAbierto = ref(false)
    const vistaActiva = ref('selector')
    const documentoSeleccionado = ref(null)
    const documentoEnEdicion = ref('')

    const actualizarTitulos = (listaTitulos) => {
        titulos.value = listaTitulos
    }
    const actualizarVista = (nuevaVista) => {
        vistaActiva.value = nuevaVista
        if (nuevaVista === 'nuevo') {
            documentoEnEdicion.value = ''
        }
    }
    const actualizarDocumentoSeleccionado = (documento) => {
        documentoSeleccionado.value = documento
        documentoEnEdicion.value = documento?.contenidoMarkdown || documento?.contenido || ''
        menuAbierto.value = false
    }
    const actualizarContenidoEnEdicion = (nuevoTexto) => {
        documentoEnEdicion.value = nuevoTexto
    }
</script>

<template>
    <div id="pantalla_general_inicio" :class="{ 'menu-abierto': menuAbierto }">
        <BarraSuperiorInicio />
        <PanelLateralPlantillas
            class="panel-lateral-movil"
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
        .boton-toggle-movil {
            display: none;
        }
    }
    @media (max-width: 768px) {
        #pantalla_general_inicio {
            grid-template-columns: minmax(0, 1fr);
            & > #barra_superior {
                grid-column: 1;
            }
            & > #panel_central_plantilla {
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
                &:active {
                    transform: scale(0.9);
                }
            }
            & > .panel-lateral-movil {
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
            &.menu-abierto > .panel-lateral-movil {
                transform: translateX(0);
                background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
            }
        }
    }
</style>