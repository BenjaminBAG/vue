<script setup>
    import { ref } from 'vue'
    import { User, Settings, SquareArrowRightExit } from 'lucide-vue-next'

    const estaActivado = ref(false)

    const mostrarCuadroFlotante = () => {
        estaActivado.value = !estaActivado.value
        console.log('Acción ejecutada en el hijo')
    }

    defineExpose({
        mostrarCuadroFlotante
    })
</script>

<template>
    <div v-if="estaActivado" class="cuadro-flotante">
        <ul>
            <li>
                <User class="icono" />
                <a href="#">Mi Perfil</a>
            </li>
            <li>
                <Settings class="icono" />
                <a href="#">Configuración</a>
            </li>
            <li class="rojo">
                <SquareArrowRightExit class="icono" />
                <a href="#">Cerrar Sesión</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'CuadroFlotanteInicio',
    }
</script>

<style>
.cuadro-flotante {
    position: absolute;
    top: 100%;          /* Lo coloca justo debajo del botón */
    right: 0;           /* Lo alinea al borde derecho del botón */
    margin-top: 0.5em;  /* Separación sutil del botón */
    background-color: #ffffff; 
    color: #333333;
    border: 1px solid #ddd;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 150px;
    z-index: 100;       /* Asegura que flote sobre otros elementos */
}
.cuadro-flotante ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.cuadro-flotante li {
    display: flex;
}
.cuadro-flotante li .icono {
    width: 1em;
    height: auto;
    margin-left: 0.5em;
}
.cuadro-flotante li a {
    display: block;
    padding: 10px 15px;
    text-decoration: none;
    color: #333333;
    font-size: 0.9em;
}
.cuadro-flotante li:hover {
    background-color: var(--beige);
}
.cuadro-flotante .rojo:hover {
    background-color: color-mix(var(--rojo), var(--blanco) 70%);
}
</style>