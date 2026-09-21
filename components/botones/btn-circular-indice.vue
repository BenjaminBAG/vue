<script setup>
    import { List } from 'lucide-vue-next'

    defineProps({
        activo: {
            type: Boolean,
            default: false
        }
    })
</script>

<template>
    <button :class="{ 'is-active': activo }">
        <List />
    </button>
</template>

<script>
    export default {
        name: 'BtnCircularLista'
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
    }
    svg {
        width: 70%;
        height: auto;
        border: none;
    }
    button:hover {
        background-color: var(--verde);
        color: var(--blanco);
    }
    button.is-active {
        background-color: var(--negro);
        color: var(--blanco);
    }
</style>