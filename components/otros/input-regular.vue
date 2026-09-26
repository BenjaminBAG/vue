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
  // Evita que los atributos se apliquen automáticamente al div contenedor
  inheritAttrs: false, 
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
}

input { 
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em 0.5em 0.5em 1.8em; 
  border: none; 
  border-radius: 10px; 
  background-color: var(--blanco);
  color: var(--negro);
  font-size: 1em; 
  outline: none;
} 

.input-container::after {
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

.input-container:focus-within::after {
  transform: translateY(-50%) scale(1);
}
</style>
