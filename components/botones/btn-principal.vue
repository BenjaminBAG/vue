<template>
    <button type="submit">
        {{ texto }}
    </button>
</template>

<script>
    export default {
        props: {
            texto: String
        }
    }
</script>

<style scoped>
    button {
        width: 100%;
        padding: 1em;
        font-family: var(--fuente-estilizada);
        text-transform: uppercase;
        background-color: var(--blaco);
        font-weight: bold;
        border: none;
    }
    button:hover {
        box-shadow: 0 0 5px 2px var(--beige);
        cursor: pointer;
    }
    button:active {
        box-shadow: 0 0 5px 2px var(--azul);
    }
</style>