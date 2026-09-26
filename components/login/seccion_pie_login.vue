<template>
    <footer id="seccion_pie_login">
        <div>
            <p>
                BAG Group
                <br>
                Todos los derechos reservados
            </p>
        </div>
        <div>
            <p>
                soporte@bag-g.com
                <br>
                procesos@bag-g.com
        </p>
        </div>
    </footer>
</template>

<script>
    export default {
      name: 'SeccionPieLogin'
    }
</script>

<style scoped>
    #seccion_pie_login {
      grid-column: 1 / 3;
      grid-row: 3;
      width: calc(100% - padding);
      padding: 0.5em 3em;
      color: var(--blanco);
      display: flex;
      justify-content: space-between;
      background-color: var(--verde);
    }
</style>