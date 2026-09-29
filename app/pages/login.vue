<template>
    <div id="pantalla_general_login">
        <SeccionTitulo />
        <SeccionFormulario />
        <SeccionPresentacion />
        <SeccionPie />
    </div>
</template>

<script setup>
    import SeccionTitulo from '../../components/login/seccion_titulo_login.vue'
    import SeccionFormulario from '../../components/login/seccion_formulario_login.vue'
    import SeccionPresentacion from '../../components/login/seccion_presentacion_login.vue'
    import SeccionPie from '../../components/login/seccion_pie_login.vue'

    definePageMeta({
        middleware: ['auth']
    })
</script>

<style scoped>
    #pantalla_general_login {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 20vh 70vh 10vh;
    }
</style>