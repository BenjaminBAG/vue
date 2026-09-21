<template>
    <div id="seccion_lista">
        <div class="titulo_h2">
            <File class="icono"/>
            <h2>Documentos</h2>
        </div>
        <ul>
            <li v-for="item in chips" :key="item.nombre">
                <button>{{ item.nombre }}</button>
            </li>
        </ul>
    </div>
</template>

<script>
    import { File } from 'lucide-vue-next'

    export default {
        name: 'SeccionLista',
        components: {
            File
        },
        data() {
            return {
            chips: [
                { nombre: 'Manual de Cobranza', tipo: 'Manual' },
                { nombre: 'Manual de Políticas', tipo: 'Política' },
                { nombre: 'Glosario de Procesos', tipo: 'Guía' },
            ]
            }
        }
    }
</script>

<style>
    #seccion_lista {
        padding: 1em;
    }
    .titulo_h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
    }
    .titulo_h2 .icono {
        width: 1.5em;
        height: 1.5em;
        flex-shrink: 0;
        stroke-width: 0.2em;
    }
    .titulo_h2 h2 {
        margin: 0;
        font-size: 1.5rem;
    }
    #seccion_lista ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    #seccion_lista ul li button {
        position: relative;
        overflow: hidden;
        width: 90%;
        padding: 0.5em 0.5em 0.5em 1em;
        margin: 0.2em;
        text-align: left;
        border-radius: 0;
        border: none;
        background-color: var(--blanco);
        transition: all 0.3s ease-in-out;
    }
    #seccion_lista ul li button::before {
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
    #seccion_lista ul li button:hover {
        cursor: pointer;
        padding-left: 1.5em;
        background-color: color-mix(var(--beige), var(--blanco) 70%);
    }
    #seccion_lista ul li button:hover::before {
        opacity: 1;
        transform: translateY(-50%) translateX(5px); /* Se mueve suavemente hacia la derecha */
    }
</style>
