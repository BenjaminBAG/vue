<script setup>
    import InputRegular from '../../otros/InputRegular.vue'
    import AreaDesplazamiento from '../../otros/AreaDesplazamiento.vue'
    import BtnPrincipal from '../../botones/btn-principal.vue'
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="panel_administracion">
            <h2>Usuarios</h2>
            <hr>
            <form action="">
                <h3>Nuevo Usuario</h3>
                <InputRegular label="Nombre" type="text" placeholder="Escribe el nombre completo del usuario" required/>
                <InputRegular label="Email" type="email" placeholder="Escribe el email del usuario" required />
                <InputRegular label="Clave" type="password" placeholder="Escribe una contraseña de 8 caracteres" required />
                <InputRegular label="Rol" type="text" placeholder="Administrador || Lector" required />
                <BtnPrincipal texto="Guardar" />
            </form>
        </div>
    </AreaDesplazamiento>
</template>

<style scoped>
    .panel_administracion {
        padding: 2em;
    }
</style>