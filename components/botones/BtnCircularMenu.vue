<script setup>
    import { Menu } from 'lucide-vue-next'
</script>

<template>
    <button>
        <Menu />
    </button>
</template>

<script>
    export default {
        name: 'BtnCircularMenu'
    }
</script>

<style scoped>
    button {
        width: 3em;
        height: 3em;
        border-radius: 50%;
        border: none;
        background-color: var(--negro-siempre);
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    button svg {
        color: var(--blanco-siempre);
    }
    button:hover {
        background-color: color-mix(var(--negro), var(--blanco) 20%);
        transform: rotate(7deg) scale(1.1);
    }
    button.is-active {
        background-color: var(--negro);
    }
    button.is-active svg {
        color: var(--blanco);
    }
</style>