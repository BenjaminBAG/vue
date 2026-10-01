<script setup>
    import { X } from 'lucide-vue-next'
    import SeccionMenu from './seccion_menu_modal_configuracion.vue'
    import seccionVista from './seccion_vista_modal_configuracion.vue'
    import { ref } from 'vue'
    import btnCircularCerrar from '~~/components/botones/btn-circular-cerrar.vue'

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

    const vistaActiva = ref(null)
    const actualizarVista = (nuevaVista) => {
        vistaActiva.value = nuevaVista
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
                    <btnCircularCerrar type="button" aria-label="Cerrar configuración" @click="cerrar"/>
                </header>
                <div class="contenido-modal">
                    <SeccionMenu @actualizacion-vista="actualizarVista"/>
                    <section v-if="vistaActiva === null">
                        <img src="../../../assets/imagenes/config-humaans.png" alt="configuración">
                        <p>Selecciona un menú para comenzar...</p>
                    </section>
                    <seccionVista :vista="vistaActiva" />
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
        .modal-configuracion {
            width: 80%;
            height: 80%;
            padding: 1.5rem;
            color: var(--negro);
            background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
            box-shadow: 0 12px 40px rgb(0 0 0 / 35%);
            header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                h2 {
                    margin: 0;
                    font-size: 1.25rem;
                }
            }
            .contenido-modal {
                display: grid;
                grid-template-columns: 30% 70%;
                section {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    img {
                        width: 30%;
                        height: auto;
                        text-align: center;
                    }
                }
            }
            p {
                margin: 1.25rem 0;
            }
        }
        @media (max-width: 768px) {
            .modal-configuracion {
                height: 100%;
                width: 100%;
                .contenido-modal {
                    grid-template-columns: 15% 85%;
                }
            }
        }
    }
</style>