<template> 
    <div class="input-container">
        <!-- v-bind="$attrs" hereda el type, placeholder, etc., que le pase desde fuera -->
        <input 
            v-bind="$attrs"
            spellcheck="false" 
            :value="modelValue" 
            @input="$emit('update:modelValue', $event.target?.value)" 
        /> 
    </div>
</template> 

<script> 
export default { 
  name: 'InputRegular',
  inheritAttrs: false,    // Evita que los atributos se apliquen automáticamente al div contenedor
  props: {
    modelValue: String
  }
}
</script> 

<style scoped> 
    .input-container {
        position: relative;
        display: inline-block;
        width: 100%;
        margin: 0.5em 0 1.5em 0;
        &::after {
            content: "";
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%) scale(0);
            width: 10px;
            height: 10px;
            background-color: var(--azul);
            transition: transform 0.25s ease;
            pointer-events: none; /* Evita que interfiera con los clics en el input */
        }
        &:focus-within::after {
            transform: translateY(-50%) scale(1);
        }
        input { 
            width: 100%;
            max-width: 400px;
            box-sizing: border-box;
            padding: 0.5em 0.5em 0.5em 1.8em; 
            border: none; 
            border-radius: 10px; 
            background-color: var(--blanco);
            color: var(--negro);
            font-size: 1em; 
            outline: none;
        } 
    }
</style>
