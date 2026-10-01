<template>
    <div id="pantalla_general_inicio" :class="{ 'menu-abierto': menuAbierto }">
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
                menuAbierto: false,
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
                this.menuAbierto = false
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
            grid-template-columns: 100%;
        }

        #pantalla_general_inicio > #barra_superior {
            grid-column: 1;
        }

        #pantalla_general_inicio > #contenedor_panel_central_inicio {
            grid-column: 1;
            grid-row: 2;
            min-width: 0;
        }

        .boton-toggle-movil {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            bottom: 2em;
            right: 2em;
            width: 55px;
            height: 55px;
            background-color: #333;
            color: #fff;
            border: none;
            border-radius: 50%;
            font-size: 1.5em;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            z-index: 2000;
            transition: transform 0.2s ease;
        }

        .boton-toggle-movil:active {
            transform: scale(0.9);
        }

        #pantalla_general_inicio > #panel_lateral_inicio {
            position: fixed;
            top: 75px;
            left: 0;
            width: 280px;
            height: calc(100vh - 75px);
            background-color: var(--blanco, #fff);
            z-index: 1999;
            box-shadow: 5px 0 15px rgba(0, 0, 0, 0.15);
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }

        #pantalla_general_inicio.menu-abierto > #panel_lateral_inicio {
            transform: translateX(0);
        }
    }
</style>