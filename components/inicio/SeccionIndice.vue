<script setup>
    import TituloSeccion from '../otros/TituloSeccion.vue';
    import { List } from 'lucide-vue-next'

    defineProps({
        titulos: {
            type: Array,
            required: true,
            default: () => []
        }
    })
    const irASeccion = (slug) => {
            const elemento = document.getElementById(slug);
            if (elemento) {
                elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
</script>

<template>
    <div id="indice_documentos">
        <TituloSeccion :icono=List titulo="Índice del Documento" />
        <ul v-if="titulos.length > 0">
                        <li
                            v-for="item in titulos"
                            :key="item.slug"
              :style="{ paddingLeft: `${(item.nivel - 1) * 1.2}rem` }"
            >
                <a :href="`#${item.slug}`" @click.prevent="irASeccion(item.slug)">
                    {{ item.texto }}
                </a>
            </li>
        </ul>
        <p v-else class="sin_titulos">El documento no pudo indexarse</p>
    </div>
</template>

<style scoped>
    h2, a {
        color: var(--negro);
    }
    #indice_documentos {
        padding: 2em 0;
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            li {
                margin: 0.5rem 0;
                a {
                    padding: 4px 0.7em 4px 0.7em;
                    font-size: 0.9rem;
                    text-decoration: none;
                    font-size: 1em;
                    background-color: var(--blanco);
                    border-radius: 10px;
                    display: inline-block;
                    position: relative; 
                    transition: all 0.2s ease;
                    &::before { 
                        content: ""; 
                        position: absolute; 
                        top: 50%; 
                        left: 4px; 
                        width: 10px;
                        height: 10px;
                        background-color: var(--azul);
                        transform: translateY(-50%) scale(0.5); 
                        opacity: 0; 
                        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out; 
                    }
                    &:hover {
                        cursor: pointer;
                        background-color: color-mix(var(--azul), var(--blanco) 70%);
                        padding: 4px 0.7em 4px 1.5em;
                        &::before {
                            opacity: 1;
                            transform: translateY(-50%) scale(1);
                        }
                    }
                }
            }
        }
        .sin_titulos {
            font-size: 0.85rem;
            color: var(--gris);
            padding: 0 16px;
        }
    }
</style>
