<template>
  <input
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
        padding: 0.5rem;
        border: 1px solid var(--beige);
        border-radius: 10px;
        transition: border-color 0.5s ease; /* Suaviza el cambio de color */
        transition: border-radius 0.5s ease; /* Suaviza el cambio de color */

    }
    input:focus {
        border: 2px solid var(--azul);
        outline: none;
        border-radius: 0px;
    }
</style>
