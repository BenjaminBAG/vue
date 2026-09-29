<script setup>
    import { X } from 'lucide-vue-next'
    import SeccionMenu from './seccion_menu_modal_configuracion.vue'
    import seccionVista from './seccion_vista_modal_configuracion.vue'

    defineProps({
        modelValue: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const cerrar = () => {
        emit('update:modelValue', false)
    }
</script>

<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-fondo" @click.self="cerrar">
            <section
                class="modal-configuracion"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-configuracion"
            >
                <header>
                    <h2 id="titulo-configuracion">Configuración</h2>
                    <button
                        class="modal-cerrar-icono"
                        type="button"
                        aria-label="Cerrar configuración"
                        @click="cerrar"
                    >
                        <X />
                    </button>
                </header>
                <div class="contenido-modal">
                    <SeccionMenu />
                    <seccionVista />
                </div>
            </section>
        </div>
    </Teleport>
</template>

<style scoped>
    .modal-fondo {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 1rem;
        background-color: rgb(0 0 0 / 60%);
    }
    .modal-configuracion {
        width: 80%;
        height: 80%;
        padding: 1.5rem;
        color: var(--negro);
        background-color: var(--blanco);
        box-shadow: 0 12px 40px rgb(0 0 0 / 35%);
    }
    .modal-configuracion header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    .modal-configuracion h2 {
        margin: 0;
        font-size: 1.25rem;
    }
    .modal-configuracion p {
        margin: 1.25rem 0;
    }
    .modal-cerrar-icono,
    .modal-cerrar {
        color: var(--blanco-siempre);
        background-color: var(--negro-siempre);
        border: 1px solid var(--blanco-siempre);
        border-radius: 6px;
        cursor: pointer;
    }
    .modal-cerrar-icono {
        display: grid;
        width: 2rem;
        height: 2rem;
        place-items: center;
    }
    .modal-cerrar-icono svg {
        width: 1rem;
        height: 1rem;
        color: var(--blanco-siempre);
    }
    .modal-cerrar {
        padding: 0.5rem 0.75rem;
    }
    .modal-cerrar:hover,
    .modal-cerrar-icono:hover {
        background-color: var(--naranja);
    }
    .contenido-modal {
        display: grid;
        grid-template-columns: 30% 70%;
    }
</style>