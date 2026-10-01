<script setup>
    import InputRegular from '../../otros/input-regular.vue'
    import AreaDesplazamiento from '../../otros/area_desplazamiento.vue'
    import BtnPrincipal from '../../botones/btn-principal.vue'
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="panel_administracion">
            <h2>Usuarios</h2>
            <hr>
            <form action="">
                <h3>Nuevo Usuario</h3>
                <p>Nombre</p>
                <InputRegular type="text" placeholder="Escribe el nombre completo del usuario" required/>
                <p>Email</p>
                <InputRegular type="email" placeholder="Escribe el email del usuario" required />
                <p>Clave</p>
                <InputRegular type="password" placeholder="Escribe una contraseña de 8 caracteres" required />
                <p>Rol</p>
                <InputRegular type="text" placeholder="Administrador || Lector" required />
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