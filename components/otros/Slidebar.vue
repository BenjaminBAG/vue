<script setup>
    import { useTamannoContenido } from '../../composables/useTamannoContenido'

    const props = defineProps({
        etiqueta: {
            type: String,
            default: 'Tamaño del contenido'
        },
        almacenamiento: {
            type: String,
            default: 'portal-tamanno-regular'
        },
        variableCss: {
            type: String,
            default: '--tamanno-regular'
        }
    })

    const { tamannoActual } = useTamannoContenido({
        almacenamiento: props.almacenamiento,
        cssVariable: props.variableCss
    })
</script>


<template>
    <div class="slider-box">
        <div class="slider-header">
            <label :for="`custom-slider-${almacenamiento}`">{{ etiqueta }}</label>
            <span class="value-badge">{{ tamannoActual }}px</span>
        </div>
        
        <div class="slider-wrapper">
            <input
              :id="`custom-slider-${almacenamiento}`"
              type="range"
              v-model.number="tamannoActual"
              min="12"
              max="22"
              step="1"
              :style="{ '--progress': ((tamannoActual - 12) * 100) / 10 + '%' }"
            />
        </div>
    </div>
</template>

<style scoped>
    /* Contenedor Principal */
    .slider-box {
        font-family: 'Segoe UI', system-ui, sans-serif;
        background: var(--blanco);
        padding: 24px;
        border-radius: 10px;
        max-width: 350px;
        margin: 20px auto;
    }

    /* Encabezado */
    .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1em;
    }

    label {
        color: var(--negro);
        font-weight: 600;
        font-size: 1em;
    }

    .value-badge {
        background: transparent;
        color: var(--negro);
        padding: 4px 10px;
        border-radius: 10px;
        font-size: 1em;
        font-weight: 700;
    }

    /* Contenedor del Input */
    .slider-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    /* Resetear estilos por defecto del Input */
    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 1em; /* Grosor de la barra */
        border-radius: 4px;
        background: color-mix(in srgb, var(--azul), var(--blanco) 90%); /* Fondo de la barra no rellenada */
        outline: none;
        /* Creamos un degradado dinámico usando la variable reactiva de Vue */
        background-image: linear-gradient(var(--azul), var(--azul));
        background-size: var(--progress) 100%;
        background-repeat: no-repeat;
    }

    /* Estilos para el Botón Deslizador (Thumb) - Webkit (Chrome, Safari, Edge, Opera) */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1em;
        height: 1em;
        border-radius: 0;
        background: var(--azul);
        border: none;
        cursor: pointer;
        transition: transform 0.1s ease, background-color 0.1s ease, border-radius 0.1s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(2);
        background: var(--verde);
        border-radius: 50%;
    }

    input[type="range"]::-webkit-slider-thumb:active {
        transform: scale(1.9);
        background: var(--verde);
        border-radius: 50%;
    }

    /* Estilos para el Botón Deslizador (Thumb) - Firefox */
    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--blanco);
        border: 3px solid var(--azul);
        cursor: pointer;
        transition: transform 0.1s ease;
    }

    input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.15);
    }
</style>
