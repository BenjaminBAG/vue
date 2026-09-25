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
        transition: transform 0.3s ease;
    }
    button:hover {
        background-color: color-mix(var(--negro), var(--blanco) 20%);
        transform: rotate(7deg) scale(1.1);
    }
    button:active {
        background-color: var(--blanco);
        color: var(--negro);
    }
</style>