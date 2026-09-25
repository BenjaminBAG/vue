<template>
    <button
    type="button"
    class="boton-limpiar-filtro"
    :disabled="disabled"
    @click="$emit('limpiar-filtro')"
    >
        <CircleX class="icono"/>
        Limpiar filtro
    </button>
</template>

<script setup>
    import { CircleX } from 'lucide-vue-next'

    defineProps({
        disabled: {
            type: Boolean,
            default: false
        }
    })

    defineEmits([
        'limpiar-filtro'
    ])
</script>

<style scoped>
    .boton-limpiar-filtro {
        margin-top: 1em;
        border: none;
        border-radius: 10px;
        background-color: var(--beige);
        color: var(--negro);
        padding: 0.5em 1em;
        cursor: pointer;
        transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s, color 0.2s;
        align-items: center;
        display: flex;
        gap: 0.5em;
    }

    .boton-limpiar-filtro:disabled {
        display: none;
    }

    .boton-limpiar-filtro:not(:disabled):hover {
        transform: translateY(-2px);
        background-color: var(--negro);
        color: var(--blanco)
    }
    .boton-limpiar-filtro .icono {
        height: auto;
        width: 15px;
    }
</style>
