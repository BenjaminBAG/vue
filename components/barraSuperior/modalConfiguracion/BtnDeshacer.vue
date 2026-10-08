<script setup>
    import { Undo } from 'lucide-vue-next'

    defineProps({
        deshabilitado: {
            type: Boolean,
            default: false
        },
        cargando: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['deshacer'])
</script>

<template>
    <button
        class="btn-deshacer"
        type="button"
        :disabled="deshabilitado || cargando"
        @click="emit('deshacer')"
    >
        <Undo />
        {{ cargando ? 'Deshaciendo...' : 'Deshacer' }}
    </button>
</template>

<style scoped>
    .btn-deshacer {
        background-color: var(--blanco);
        border: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5em;
        cursor: pointer;
        transition: transform 0.3s ease;
        &:hover:not(:disabled) {
            transform: scale(1.05);
            background-color: var(--negro);
            color: var(--blanco);
            svg {
                color: var(--blanco);
            }
        }
        &:disabled {
            background-color: transparent;
            color: var(--gris);
            cursor: not-allowed;
            svg {
              color: var(--gris);
            }
        }
    }
</style>

