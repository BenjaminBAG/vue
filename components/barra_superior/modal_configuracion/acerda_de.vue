<script setup>
    const pilares = [
        "La calidad no se negocia. Desde el diseño hasta la ejecución, cuidamos cada detalle. Trabajamos con estándares altos y entrega impecable. La calidad es nuestro sello.",
        "Actuamos “como si”. Cuando un cliente tiene una necesidad, nos movemos. Investigamos, aprendemos y resolvemos. Nada se deja al azar: siempre encontramos cómo lograrlo.",
        "Elegimos con criterio. Solo aceptamos proyectos donde podamos aportar valor. No llenamos la agenda por llenar. Protegemos lo que construimos: nuestro tiempo, energía y reputación.",
        "Asumimos la responsabilidad. Si algo falla, damos la cara. No culpamos, resolvemos con honestidad, justicia y compromiso. Respondemos con claridad.",
        "Ganamos para fortalecer. Las ganancias no son el fin, son el medio para crecer. Reinvertimos en nuestro equipo y nuestra empresa. El talento comprometido es nuestra prioridad.",
        "Invertimos con visión. Lo barato sale caro. Elegimos materiales, procesos y personas con visión de largo plazo. Construir bien desde el inicio nos evita conflictos y reprocesos.",
        "Diseñamos y construimos con propósito. No solo cumplimos contratos, proponemos ideas. Nuestro trabajo transforma espacios, vidas y ciudades. Siempre con intención, eficiencia y visión a futuro."
    ]
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="acerca_de">
            <h2>Acerca de</h2>
            <h3>Pilares Fundamentales</h3>
            <ol>
                <li v-for="item in pilares"> {{ item }} </li>
            </ol>
        </div>
    </AreaDesplazamiento>
</template>

<style>
    .acerca_de {
        padding: 2em;
        h3 {
            font-family: var(--fuente-estilizada);
            font-size: 3em;
            color: var(--azul);
        }
    }
</style>