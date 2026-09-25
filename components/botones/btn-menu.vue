<template>
    <button class="boton_menu">
        <span class="boton_menu_texto">{{ texto }}</span>
    </button>
</template>

<script>
    export default {
        name: 'BtnMenu',
        props: {
            texto: String
        }
    }
</script>

<style scoped>
    .boton_menu {
        position: relative;
        overflow: visible;
        font-weight: bold;
        background-color: color-mix(in srgb, var(--blaco), var(--gris) 0%);
        color: var(--blanco);
        padding: 0 1em;
        margin: 0.5em;
        height: 3em;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s, box-shadow 0.2s, padding-bottom 0.2s ease;
    }

    .boton_menu::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        width: 0;
        height: 0;
        /* Crea el triángulo con bordes CSS */
        border-left: 0.7em solid transparent;
        border-right: 0.7em solid transparent;
        border-bottom: 0.7em solid var(--naranja);
        opacity: 0;
        transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .boton_menu:hover {
        cursor: pointer;
        padding-bottom: 0.5em;
    }
    .boton_menu:hover::after {
        opacity: 1;
        transform: translate(-50%, -5px);
    }
</style>
