<template>
    <div id="pantalla_general_login">
        <SeccionTitulo />
        <SeccionFormulario />
        <SeccionPresentacion />
        <SeccionPie />
    </div>
</template>

<script>
    import SeccionTitulo from '../../components/login/seccion_titulo_login.vue'
    import SeccionFormulario from '../../components/login/seccion_formulario_login.vue'
    import SeccionPresentacion from '../../components/login/seccion_presentacion_login.vue'
    import SeccionPie from '../../components/login/seccion_pie_login.vue'

    export default {
        components: {
            SeccionTitulo,
            SeccionFormulario,
            SeccionPresentacion,
            SeccionPie
        }
    }
</script>

<style scoped>
    #pantalla_general_login {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 20vh 70vh 10vh;
    }
</style>


<!-- <template>
    <div id="pantalla_general_login">
        <form>
            <section id="seccion_titulo_formulario_login">
                <h1>Iniciar sesión</h1>
                <span>Ingresa tus credenciales para acceder al portal</span>
            </section>
            <section id="seccion_inputs_formulario_login">
                <label>Dirección de correo electrónico</label>
                <InputRegular 
                    v-model="texto"
                    type="email"
                    placeholder="Escribe tu correo..."
                    required
                />
                <label>Contraseña</label>
                <InputRegular 
                    v-model="texto"
                    type="password"
                    placeholder="Escribe tu contraseña..."
                    minlength="8"
                    maxlength="12"
                    required
                />
                <BtnPrincipal texto="Ingresar" />
            </section>
        </form>
    </div>
</template>

<script>
    import BtnPrincipal from '../../components/botones/btn-principal.vue'
    import InputRegular from '../../components/otros/input-regular.vue'

    export default {
        components: {
            BtnPrincipal,
            InputRegular
        }
    }
</script>

<style scoped>
    #pantalla_general_login {
        height: 100vh;
        background-image: url('../../assets/logos/logo_gris/MG_BAG_PrincipalNombre/MG_BAG_PrincipalNombre.png');
        background-position: top left;
        background-repeat: no-repeat;
        background-size: 70% auto;
        background-color: color-mix(in srgb, var(--beige), var(--blanco) 80%);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    form {
        width: 50%;
        padding: 2em;
        min-width: 300px;
        margin: auto;
        background-color: var(--azul);
        color: var(--blanco);
        box-shadow: 0 0 10px 5px var(--beige);
        display: flex;
        flex-direction: column;
        gap: 2em;
    }
    #seccion_inputs_formulario_login {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
</style> -->