<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      
        <!-- Grupo contenedor que gira de manera ininterrumpida -->
        <g class="morph-loader">
            <!-- Forma central que cambia de geometría y color dinámicamente -->
            <path class="morph-shape" d="M 100 35 L 156 133 L 44 133 L 44 133 Z" fill="#FF7A00" />
        </g>
    </svg>
</template>

<style>
    .morph-loader {
        transform-origin: center;
        /* Animación continua de rotación infinita */
        animation: continuousRotate 3s linear infinite;
    }

    .morph-shape {
        /* Animación de la forma y el color */
        animation: morphShape 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Rotación constante de 0 a 360 grados sin interrupción */
    @keyframes continuousRotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /* Transición fluida de Puntos (d) y Colores (fill) */
    @keyframes morphShape {
        /* Estado 0%: Triángulo Naranja */
        0% {
            /* P1: Arriba, P2: Abajo Derecha, P3: Abajo Izquierda, P4: Duplicado para interpolar a 4 puntos */
            d: path('M 100 35 L 156 133 L 44 133 L 44 133 Z');
            fill: var(--naranja);
        }
        
        /* Estado 33.3%: Cuadrado Azul */
        33.33% {
            d: path('M 145 55 L 145 145 L 55 145 L 55 55 Z');
            fill: var(--azul);
        }

        /* Estado 66.6%: Círculo Verde/Rosa/Púrpura o Turquesa (Círculo Azul-Púrpura elegante usando curvas Beziers simples) 
          Para suavizar SVG d-path morph a Círculo usamos un trazado con curvas o forma de octágono/aproximación */
        66.66% {
            /* Aproximación suave curva a círculo usando comandos C/S o puntos bien distribuídos */
            d: path('M 100 40 C 133 40 160 67 160 100 C 160 133 133 160 100 160 C 67 160 40 133 40 100 C 40 67 67 40 100 40 Z');
            fill: var(--verde);
        }

        /* Regreso a Triángulo Naranja sin pausas */
        100% {
            d: path('M 100 35 L 156 133 L 44 133 L 44 133 Z');
            fill: var(--naranja);
        }
    }
</style>