<template>
    <div class="selector-container">
        <select :value="modelValue" @change="emit('update:modelValue', $event.target.value)">
            <slot />
        </select>
    </div>
</template>

<script setup>
    defineProps({
        modelValue: {
            type: String,
            default: ''
        }
    })

    const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
    .selector-container {
        position: relative;
        display: inline-block;
        width: 100%;
        margin: 0.5em 0 1.5em;
    }

    .selector-container::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 8px;
        width: 10px;
        height: 10px;
        transform: translateY(-50%) scale(0);
        background-color: var(--azul);
        transition: transform 0.25s ease;
        pointer-events: none;
    }

    .selector-container:focus-within::after {
        transform: translateY(-50%) scale(1);
    }

    .selector-container select {
        width: 100%;
        max-width: 400px;
        box-sizing: border-box;
        padding: 0.5em 0.5em 0.5em 1.8em;
        border: none;
        border-radius: 10px;
        background-color: var(--blanco);
        color: var(--negro);
        font: inherit;
        outline: none;
    }
</style>