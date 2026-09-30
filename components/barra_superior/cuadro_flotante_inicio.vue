<script setup>
    import { ref } from 'vue'
    import { CircleQuestionMark, Bell, Settings } from 'lucide-vue-next'
    import CerrarSesion from './cerrar_sesion.vue'
    import ModalConfiguracion from './modal_configuracion/modal_configuracion.vue'
    import ModalNotificaciones from './modal_notificaciones.vue'

    defineOptions({
        name: 'CuadroFlotanteInicio'
    })

    const estaActivado = ref(false)
    const modalActivo = ref(null)

    const mostrarCuadroFlotante = () => {
        estaActivado.value = !estaActivado.value
    }

    const abrirModal = (nombreModal) => {
        estaActivado.value = false
        modalActivo.value = nombreModal
    }

    const actualizarModal = (nombreModal, abierto) => {
        if (!abierto && modalActivo.value === nombreModal) {
            modalActivo.value = null
        }
    }

    defineExpose({ mostrarCuadroFlotante })
</script>

<template>
    <div v-if="estaActivado" class="cuadro-flotante">
        <ul>
            <button>
                <CircleQuestionMark />
                <p>Ayuda</p>
            </button>
            <button @click="abrirModal('notificaciones')">
                <Bell />
                <p>Notificaciones</p>
            </button>
            <button @click="abrirModal('configuracion')">
                <Settings />
                <p>Configuración</p>
            </button>
            <CerrarSesion/>
        </ul>
    </div>

    <ModalConfiguracion
        :model-value="modalActivo === 'configuracion'"
        @update:model-value="actualizarModal('configuracion', $event)"
    />
    <ModalNotificaciones
        :model-value="modalActivo === 'notificaciones'"
        @update:model-value="actualizarModal('notificaciones', $event)"
    />
</template>

<style>
    .cuadro-flotante {
        position: absolute;
        top: 150%;
        right: 0;
        margin-top: 0.5em;
        background-color: transparent;
        color: var(--blanco);
        min-width: 150px;
        z-index: 100;
    }
    .cuadro-flotante ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    .cuadro-flotante button {
        display: flex;
        background-color: var(--negro-siempre);
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 0 5px 2px var(--beige);
        transition: background-color 0.3s, padding 0.3s;
        border: none;
        display: flex;
        align-items: center;
    }
    .cuadro-flotante button svg {
        width: 1.5em;
        height: 1.5em;
        margin-left: 0.5em;
        color: var(--blanco-siempre);
    }
    .cuadro-flotante button p {
        display: block;
        padding: 0 0.5em;
        text-decoration: none;
        color: var(--blanco-siempre);
        font-size: 1em;
    }
    .cuadro-flotante button:hover {
        background-color: var(--azul);
        padding: 0.5em 0.5em;
    }
    .cuadro-flotante .rojo:hover {
        background-color: var(--rojo);
    }
</style>
