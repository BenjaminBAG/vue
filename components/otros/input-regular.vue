<template>
    <input
        spellcheck="false"
        :value="$attrs.modelValue"
        @input="$emit('update:modelValue', $event.target?.[ 'value' ])"
    />
</template>

<script>
    export default {
        name: 'InputRegular'
    }
</script>

<style scoped>
    input {
        padding: 0.5em;
        border: 1px solid var(--beige);
        transition: border-color 0.2s ease, background-color 0.2s ease;
    }
    input:focus {
        border: 2px solid var(--azul);
        outline: none;
        border-radius: 0px;
        background-color: var(--azul);
        color: var(--blanco);
    }
</style>
