<template>
    <div id="seccion_titulo_login">
        <img src="../../assets/logos/logo_blanco/MG_BAG_PrincipalNombre/MG_BAG_PrincipalNombre.png" alt="logo">
    </div>
</template>

<script>
    export default {
      name: 'SeccionTituloLogin'
    }
</script>

<style scoped>
    #seccion_titulo_login {
      grid-column: 1 / 3;
      grid-row: 1;
      width: 100%;
      padding-left: 3em;
      display: flex;
      justify-content: space-between;
      background-image: url('../../assets/imagenes/SJ_terraza abierta.jpg');
      background-position: top left;
      background-repeat: no-repeat;
      background-size: 100% auto;
  }
    #seccion_titulo_login img {
    }
</style>