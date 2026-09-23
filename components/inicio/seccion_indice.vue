<template>
    <div id="indice_documentos">
        <div>
            <List class="icono"/>
            <h2>Índice del Documento</h2>
        </div>
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
        <!-- CORREGIDO: Cambiado sin_titulos por sin-titulos -->
        <p v-else class="sin_titulos">Sin secciones</p> 
    </div>
</template>

<script>
    import { List } from 'lucide-vue-next'

    export default {
        name: 'IndiceDocumento',
        props: {
            titulos: {
                type: Array,
                required: true,
                default: () => []
            }
        },
        methods: {
            irASeccion(slug) {
                const elemento = document.getElementById(slug);
                if (elemento) {
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        },
        components: {
            List
        }
    };
</script>

<style scoped>
    #indice_documentos {
        padding: 1em;
    }

    #indice_documentos div {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
    }

    #indice_documentos .icono {
        width: 1.5em;
        height: 1.5em;
        flex-shrink: 0;
        stroke-width: 0.2em;
    }

    #indice_documentos ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    #indice_documentos ul li {
        margin: 0.5rem 0;
    }

    #indice_documentos ul li a {
        text-decoration: none;
        color: var(--negro);
        font-size: 0.9rem;
        transition: all 0.2s ease;
        position: relative; 
        display: inline-block;
        padding: 4px 8px 4px 1.5rem;
    }

    #indice_documentos ul li a::before { 
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


    #indice_documentos ul li a:hover {
        cursor: pointer;
        background-color: color-mix(var(--beige), var(--blanco) 70%);
    }

    #indice_documentos ul li a:hover::before {
        opacity: 1;
        transform: translateY(-50%) scale(1);
    }

    .sin_titulos {
        font-size: 0.85rem;
        color: #999;
        padding: 0 16px;
    }
</style>
