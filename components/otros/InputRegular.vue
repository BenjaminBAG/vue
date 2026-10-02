<template>
    <div class="input-regular">
        <label>{{ label }}</label>
        <br/>
        <div class="contenedor-input">
            <input
            v-bind="$attrs"
            spellcheck="false"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target?.value)"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputRegular',
        inheritAttrs: false,
        props: {
            modelValue: String,
            label: String
        }
    }
</script>

<style scoped>
    .input-regular {
        display: inline-block;
        width: 100%;
        margin: 0 0 0.5em 0;
        label {
            margin-left: 0.5em;
        }
        .contenedor-input {
            position: relative;
            display: inline-block;
            width: 100%;
            max-width: 400px;
            margin: 0.5em 0 1em 0;
            &::after {
                content: "";
                position: absolute;
                left: 8px;
                top: 50%;
                transform: translateY(-50%) scale(0);
                width: 0.7em;
                height: 0.7em;
                background-color: var(--azul);
                transition: transform 0.25s ease;
                pointer-events: none;
            }
            &:focus-within::after {
                transform: translateY(-50%) scale(1);
            }
            input {
                width: 100%;
                box-sizing: border-box;
                padding: 0.5em 0.5em 0.5em 1.8em;
                margin: 0;
                border: none;
                border-radius: 10px;
                background-color: var(--blanco);
                color: var(--negro);
                font-size: 1em;
                outline: none;
                display: block;
            }
        }
    }
</style>