<script setup>
    defineProps({
        icono: {
            type: Object,
            required: false,
            default: null
        },
        titulo: {
            type: String,
            required: true
        }
    })
</script>

<template>
    <div class="titulo-seccion">
        <component :is="icono" />
        <h2>
            {{ titulo }}
        </h2>
    </div>
</template>

<style scoped>
    .titulo-seccion {
        display: flex;
        align-items: center;
        gap: 0.7em;
        padding-bottom: 1em;
        svg {
            width: 1.5em;
            height: 1.5em;
            flex-shrink: 0;
            stroke-width: 0.2em;
            color: var(--negro);
        }
    }
</style>