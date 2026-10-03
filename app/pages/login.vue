<template>
    <div id="pantalla_general_login">
        <SeccionTitulo />
        <SeccionFormulario />
        <SeccionPresentacion />
        <SeccionPie />
    </div>
</template>

<script setup>
    import SeccionTitulo from '../../components/login/SeccionTituloLogin.vue'
    import SeccionFormulario from '../../components/login/SeccionFormularioLogin.vue'
    import SeccionPresentacion from '../../components/login/SeccionPresentacionLogin.vue'
    import SeccionPie from '../../components/login/SeccionPieLogin.vue'

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