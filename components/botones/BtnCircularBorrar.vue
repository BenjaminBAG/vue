<script setup>
    import { Trash2 } from 'lucide-vue-next'

    const props = defineProps({
        activo: {
            type: Boolean,
            default: false
        },
        deshabilitado: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['borrar'])
</script>

<template>
    <button
        type="button"
        :class="{ 'is-active': activo }"
        :disabled="deshabilitado"
        :title="deshabilitado ? 'Selecciona un registro para borrarlo' : 'Borrar registro'"
        @click="emit('borrar')"
    >
        <Trash2 />
    </button>
</template>

<script>
    export default {
        name: 'BtnCircularBorrar'
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
        &:hover:not(:disabled) {
            background-color: var(--rojo);
            transform: rotate(7deg) scale(1.1);
            svg {
                color: var(--blanco);
            }
        }
        &:disabled {
            cursor: not-allowed;
            opacity: 0.45;
        }
        &.is-active {
            background-color: var(--negro);
            svg {
                color: var(--blanco);
            }
        }
    }
</style>
