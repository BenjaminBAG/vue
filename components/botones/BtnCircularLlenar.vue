<script setup>
    import { FileText } from 'lucide-vue-next'

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
        aria-label="Llenar plantilla"
        :title="deshabilitado ? 'Selecciona una plantilla para llenarla' : 'Llenar plantilla'"
    >
        <FileText aria-hidden="true" />
    </button>
</template>

<style scoped>
    button {
        width: 3em;
        height: 3em;
        border: 0;
        border-radius: 50%;
        background-color: var(--blanco);
        color: var(--negro);
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    button:hover:not(:disabled) {
        background-color: var(--verde);
        transform: rotate(7deg) scale(1.1);
    }

    button:hover:not(:disabled) svg,
    button.is-active svg {
        color: var(--blanco);
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }

    button.is-active {
        background-color: var(--negro);
    }

    button svg {
        width: 70%;
        height: auto;
    }
</style>