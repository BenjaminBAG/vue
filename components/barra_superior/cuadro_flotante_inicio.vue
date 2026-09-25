<script setup>
    import { ref } from 'vue'
    import { User, Bell, Settings, Info, SquareArrowRightExit } from 'lucide-vue-next'

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
                <Bell class="icono" />
                <a href="#">Notificaciones</a>
            </li>
            <li>
                <Settings class="icono" />
                <a href="#">Configuración</a>
            </li>
            <li>
                <Info class="icono" />
                <a href="#">Acerca de</a>
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
        top: 150%;          /* Lo coloca justo debajo del botón */
        right: 0;           /* Lo alinea al borde derecho del botón */
        margin-top: 0.5em;  /* Separación sutil del botón */
        background-color: transparent; 
        color: var(--blanco);
        min-width: 150px;
        z-index: 100;       /* Asegura que flote sobre otros elementos */
    }
    .cuadro-flotante ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    .cuadro-flotante li {
        display: flex;
        padding: 0.5em 0.5em;
        background-color: var(--negro);
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s, padding 0.3s;
    }
    .cuadro-flotante li .icono {
        width: 1em;
        height: auto;
        margin-left: 0.5em;
    }
    .cuadro-flotante li a {
        display: block;
        padding: 0 0.5em;
        text-decoration: none;
        color: var(--blanco);
        font-size: 0.9em;
    }
    .cuadro-flotante li:hover {
        background-color: var(--naranja);
        padding: 0.8em 0.5em;
    }
    .cuadro-flotante .rojo:hover {
        background-color: var(--rojo);
    }
</style>