<script setup>
    import { User, Settings, History , Info } from 'lucide-vue-next'
    import { ref } from 'vue'

    const vistaActiva = ref(null)

    const botones = [ 
        { id: 'perfil', nombre: 'Perfil', icono: User },
        { id: 'historial', nombre: 'Historial', icono: History  },
        { id: 'administrador', nombre: 'Administrador', icono: Settings },
        { id: 'acerca_de', nombre: 'Acerca de', icono: Info }
    ]

    // el evento que el padre va a escuchar
    const emit = defineEmits(['actualizacion-vista'])

    const cambiarVista = (id) => {
        vistaActiva.value = id
        emit('actualizacion-vista', id)
    }

</script>

<template>
    <div class="seccion-menu-modal">
        <ul>
            <li v-for="item in botones">
                <button
                    :class="{'boton_activo': vistaActiva === item.id}"
                    @click="cambiarVista(item.id)"
                >
                    <component :is="item.icono" class="icono" />
                    <p>{{ item.nombre }}</p>
                </button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .seccion-menu-modal {
        grid-column: 1;
        padding: 2em;
        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            li {
                button {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    height: 2em;
                    margin: 0.2em 0;
                    padding: 0.5em 0.5em 0.5em 1em;
                    font-size: 1em;
                    text-align: left;
                    border-radius: 10px;
                    border: none;
                    background-color: var(--blanco);
                    transition: all 0.3s ease-in-out;
                    display: flex;
                    align-items: center;
                    &::before {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translateY(-50%) translateX(-15px);
                        opacity: 0;
                        border-top: 8px solid transparent;
                        border-bottom: 8px solid transparent;
                        border-left: 10px solid var(--naranja);
                        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
                    }
                    &:hover {
                        cursor: pointer;
                        padding-left: 1.5em;
                        background-color: color-mix(var(--naranja), var(--blanco) 70%);
                        &::before {
                            opacity: 1;
                            transform: translateY(-50%) translateX(5px);
                        }
                    }
                    .icono {
                        width: 1em;
                        height: auto;
                        margin-right: 0.5em;
                    }
                }
                .boton_activo {
                    padding-left: 1.5em;
                    background-color: color-mix(var(--naranja), var(--blanco) 70%);
                }
            }
        }
    }
    @media (max-width: 768px) {
        .seccion-menu-modal {
            padding-left: 0;
            max-width: 15%;
            ul {
                li {
                    button {
                        width: 4em;
                    }
                    p {
                        display: none;
                    }
                }
            }
        }
    }
</style>