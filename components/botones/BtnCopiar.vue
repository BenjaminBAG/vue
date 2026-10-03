<template>
    <button
        type="button"
        :class="{ 'is-active': activo }"
        :disabled="!ruta"
        :title="ruta ? 'Abrir documento' : 'Selecciona un documento'"
        @click="abrirDocumento"
    >
        <Copy />
    </button>
</template>

<script setup>
    import { Copy } from 'lucide-vue-next'

    const props = defineProps({
        activo: {
            type: Boolean,
            default: false
        },
        ruta: {
            type: String,
            default: ''
        }
    })

    const abrirDocumento = () => {
        const ruta = props.ruta + '/copy'
        const url = ruta?.trim()

        if (!url) return
        window.open(url, '_blank', 'noopener,noreferrer')
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
    button:hover { 
        background-color: var(--rojo); 
        transform: rotate(7deg) scale(1.1);
        svg {
            color: var(--blanco); 
        }
    }
    button.is-active {
        background-color: var(--negro);
    }
    button.is-active svg {
        color: var(--blanco);
    }
</style>