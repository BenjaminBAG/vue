<script setup>
    import { Pencil } from 'lucide-vue-next'

    defineProps({
        activo: {
            type: Boolean,
            default: false
        },
        deshabilitado: {
            type: Boolean,
            default: false
        }
    })
</script>

<template>
    <button
        type="button"
        :class="{ 'is-active': activo }"
        :disabled="deshabilitado"
        :title="deshabilitado ? 'Selecciona un registro para editar' : 'Editar registro'"
    >
        <Pencil />
    </button>
</template>

<script>
    export default {
        name: 'BtnCircularEditar'
    }
</script>

<style scoped>
    button {
        width: 3em;
        height: 3em;
        border-radius: 50%;
        border: none;
        background-color: var(--blanco);
        color: var(--negro);
        cursor: pointer;
        transition: transform 0.3s ease;
        svg {
            width: 70%;
            height: auto;
            border: none;
        }
    }
    button:hover:not(:disabled) { 
        background-color: var(--verde); 
        transform: rotate(7deg) scale(1.1);
        svg {
            color: var(--blanco); 
        }
    }
    button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }
    button.is-active {
        background-color: var(--negro);
    }
    button.is-active svg {
        color: var(--blanco);
    }
</style>