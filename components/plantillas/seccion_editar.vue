<template>
    <div id="seccion_editar">
        <div class="titulo_h2">
            <Pencil class="icono"/>
            <h2>Llenar plantilla</h2>
        </div>
    </div>
    <form action="">
        <div v-for="item in claves">
            <div :class="item.tipo">
                <p>{{ item.nombre }}</p>
                <InputRegular
                :type="item.tipo"
                :placeholder="item.placeholder"
                :value="item.valor_predeterminado"
                />
            </div>
        </div>
        <BtnPrincipal texto="Guardar"/>        
    </form>
</template>

<script>
    import InputRegular from '../otros/input-regular.vue';
    import BtnPrincipal from '../botones/btn-principal.vue';

    export default {
        name: 'seccion_editar',
        components: {
            InputRegular,
            BtnPrincipal
        },
        data() {
            return {
                claves: [
                    {id: '1', nombre: 'clave 1', tipo: 'url', placeholder: 'ejemplo', requerido: true, valor_predeterminado: ''},
                    {id: '2', nombre: 'clave 2', tipo: 'date', placeholder: '2026-01-01', requerido: false, valor_predeterminado: ''},
                    {id: '3', nombre: 'clave 3', tipo: 'number', placeholder: 'ejemplo', requerido: false, valor_predeterminado: ''}
                ]
            }
        }
    }
</script>