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
        background-color: var(--nergo);
        color: var(--blanco);
        cursor: pointer;
    }
    svg {
        width: 70%;
        height: auto;
        border: none;
    }
    button:hover {
        background-color: color-mix(var(--negro), var(--blanco) 20%);
    }
    button:active {
        background-color: var(--blanco);
        color: var(--negro);
    }
</style>