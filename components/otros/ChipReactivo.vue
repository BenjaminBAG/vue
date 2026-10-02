<script setup>
    defineProps({
        valor: {
            type: Object,
            required: true
        },
        icono: {
            type: Object,
            required: false,
            default: () => ({})
        }
    })

    const emit = defineEmits(['emitir-filtros'])
</script>

<template>
    <label class="chip-reactivo":class="{ 'chip-activo': valor.seleccionado }">
        <input class="checkbox-oculto"
        type="checkbox"
        v-model="valor.seleccionado"
        @change="emit('emitir-filtros')"
        />
        <component :is="icono" />
        <p>{{ valor.nombre || valor.tipo }}</p>
    </label>
</template>

<style scoped>
    .chip-reactivo {
        margin: 0.2em;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: 0.5em 1.5em 0.5em 0.5em; 
        height: 1.5em;
        background-color: var(--blanco);
        border: none;
        border-radius: 10px;
        color: var(--negro);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            width: 0.7em;
            height: 0.7em;
            transform: translateY(-50%) translateX(-15px);
            border-radius: 50%;
            background-color: var(--verde);
            opacity: 0;
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }
        &:hover {
            padding: 0.5em 0.5em 0.5em 1.5em; 
            background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%);
        }
        &:hover::before {
            opacity: 1;
            transform: translateY(-50%) translateX(5px);
        }
        .checkbox-oculto {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }
        svg {
            width: auto;
            height: 1em;
            padding: 0 0.2em 0 0;
            stroke-width: 3px;
            transition: transform 0.3s ease;
        }
    }
    .chip-activo {
        padding: 0.5em 0.5em 0.5em 1.5em; 
        background-color: color-mix(in srgb, var(--verde), var(--blanco) 70%);
        color: var(--negro);
        &::before {
            opacity: 1;
        }
    }
</style>