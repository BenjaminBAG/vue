<template>
  <div class="loading-overlay">
    <div class="animation-container">
      <!-- Triángulo Isósceles Naranja (Entra 1ro, Estaciona a la Derecha, Sale 1ro) -->
      <svg class="shape triangle" viewBox="0 0 100 100">
        <polygon points="15,15 15,85 85,50" fill="#ef7a6b" />
      </svg>
      
      <!-- Cuadro Azul (Entra 2do, Estaciona al Centro, Sale 2do) -->
      <svg class="shape square" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="4" fill="#3f81ac" />
      </svg>
      
      <!-- Círculo Verde (Entra 3ro, Estaciona a la Izquierda, Sale 3ro) -->
      <svg class="shape circle" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill="#38814b" />
      </svg>
    </div>
  </div>
</template>

<script setup>
// Lógica controlada enteramente por CSS
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.animation-container {
  position: relative;
  width: 260px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shape {
  position: absolute;
  width: 85px;
  height: 85px;
  opacity: 0;
}

.triangle {
  animation: slide-triangle 0.5s infinite;
}
.square {
  animation: slide-square 0.5s infinite;
}
.circle {
  animation: slide-circle 0.5s infinite;
}

/* 
  POSICIONES DE ESTACIONAMIENTO:
  Triángulo (Posición 3): 85px (Derecha)
  Cuadro (Posición 2): 0px (Centro)
  Círculo (Posición 1): -85px (Izquierda)
  
  Nota: Aumenté el punto de inicio/fin a -200px y 200px para garantizar 
  que nazcan y mueran lo suficientemente lejos sin pisarse fuera de escena.
*/

@keyframes slide-triangle {
  0% {
    transform: translateX(-200px) scale(0.5);
    opacity: 0;
  }
  0.01% {
    animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
  }
  15% {
    transform: translateX(85px) scale(1);
    opacity: 1;
  }
  55% {
    transform: translateX(85px) scale(1);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.75, 0);
  }
  70%, 100% {
    transform: translateX(200px) scale(0.5);
    opacity: 0;
  }
}

@keyframes slide-square {
  0%, 15% {
    transform: translateX(-200px) scale(0.5);
    opacity: 0;
  }
  15.01% {
    animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
  }
  30% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  70% {
    transform: translateX(0) scale(1);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.75, 0);
  }
  85%, 100% {
    transform: translateX(200px) scale(0.5);
    opacity: 0;
  }
}

@keyframes slide-circle {
  0%, 30% {
    transform: translateX(-200px) scale(0.5);
    opacity: 0;
  }
  30.01% {
    animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
  }
  45% {
    transform: translateX(-85px) scale(1);
    opacity: 1;
  }
  85% {
    transform: translateX(-85px) scale(1);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.75, 0);
  }
  100% {
    transform: translateX(200px) scale(0.5);
    opacity: 0;
  }
}
</style>