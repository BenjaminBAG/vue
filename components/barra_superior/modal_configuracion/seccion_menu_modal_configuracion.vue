<script setup>
    import { User, UsersRound, History , Info } from 'lucide-vue-next'
    import { ref } from 'vue'
import ChipUnico from '../../otros/ChipUnico.vue'

    const vistaActiva = ref(null)

    const botones = [ 
        { id: 'perfil', nombre: 'Perfil', icono: User },
        { id: 'historial', nombre: 'Historial', icono: History  },
        { id: 'usuarios', nombre: 'Usuarios', icono: UsersRound },
        { id: 'acerca_de', nombre: 'Acerca de', icono: Info }
    ]

    // el evento que el padre va a escuchar
    const emit = defineEmits(['actualizacion-vista'])

    const cambiarVista = (id) => {
        vistaActiva.value = id
        emit('actualizacion-vista', id)
    }

</script>

<template>
    <div class="seccion-menu-modal">

        <ChipUnico v-for="item in botones"
            :key="item.id"
            :item="item"
            :docSeleccionado="vistaActiva"
            :icono="item.icono"
            :acortar="true"
            @click="cambiarVista(item.id)"
            :class="{'boton_activo': vistaActiva === item.id}"
        />

    </div>
</template>

<style scoped>
    .seccion-menu-modal {
        grid-column: 1;
        padding: 3em 1em; 
        display: flex;
        flex-direction: column;
        min-width: 50px; 
    }
    .boton_activo {
        padding-left: 1.5em;
        background-color: color-mix(var(--naranja), var(--blanco) 70%);
    }
</style>