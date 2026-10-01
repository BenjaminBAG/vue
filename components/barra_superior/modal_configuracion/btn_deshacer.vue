<script setup>
    import { Undo } from 'lucide-vue-next'
    import { ref } from 'vue'

    const estaDesactivado = ref(false)
    const deshacer = () => {
        estaDesactivado.value = true
    }
</script>

<template>
    <button
    class="btn-deshacer"
    @click="deshacer"
    :disabled="estaDesactivado"
    >
        <Undo />
        Deshacer
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

