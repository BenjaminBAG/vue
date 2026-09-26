<template>
    <div id="seccion_formulario_login">
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
        name: 'SeccionFormularioLogin',
        components: {
            BtnPrincipal,
            InputRegular
        }
    }
</script>

<style scoped>
    #seccion_formulario_login {
      grid-column: 1;
      grid-row: 2;
      width: calc(100% - padding);
      height: calc(100% - padding);
      padding: 2em;
      background-color: var(--beige);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    @media (max-width: 768px) {
      #seccion_formulario_login {
        grid-column: 1 / 3;
      }
    }
    #seccion_formulario_login form {
        max-width: 600px;
        min-width: 300px;
        color: var(--blanco);
        display: flex;
        flex-direction: column;
        gap: 2em;
    }
    #seccion_formulario_login #seccion_inputs_formulario_login {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
</style>