<script setup>
    import { UserRound } from 'lucide-vue-next'

    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const alternarFiltro = () => {
        emit('update:modelValue', !props.modelValue)
    }
</script>

<template>
    <button
        class="filtro-solo-yo"
        :class="{ 'item-activo': modelValue }"
        type="button"
        :aria-pressed="modelValue"
        @click="alternarFiltro"
    >
        <UserRound class="icono-filtro" />
        <span>Solo yo</span>
    </button>
</template>

<style scoped>
    .filtro-solo-yo {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        gap: 0.4em;
        margin: 0 0 1em;
        padding: 0.35em 0.6em;
        border: 0;
        border-radius: 8px;
        background-color: var(--blanco);
        color: var(--negro);
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0.35em;
            width: 0.7em;
            height: 0.7em;
            transform: translateY(-50%) scale(0);
            border-radius: 50%;
            background-color: var(--verde);
            transition: transform 0.2s ease-in-out;
        }

        &:hover,
        &.item-activo {
            padding-left: 1.5em;
            background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%);
        }

        &:hover::before {
            transform: translateY(-50%) scale(1);
        }
    }

    .icono-filtro {
        width: 1em;
        height: 1em;
        flex: 0 0 auto;
    }
</style>