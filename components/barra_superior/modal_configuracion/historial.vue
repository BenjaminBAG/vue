<script setup>
    import { Clock, User, List } from 'lucide-vue-next'
    const cambios = [
        { id: '1', usuario: 'user-001', tipo: 'cambio', fecha_hora: '12/05/25', id_registro: '005' }
    ]
    const usuarios = [
        { id: 'user-001', nombre: 'benjamín' }
    ]

    const obtenerNombreUsuario = (idUsuario) => {
        const usuarioEncontrado = usuarios.find(u => u.id === idUsuario)
        return usuarioEncontrado ? usuarioEncontrado.nombre : idUsuario
    }
</script>

<template>
    <AreaDesplazamiento :altura-max="'calc(100vh * 0.6)'">
        <div class="historial">
            <h2>Historial de cambios</h2>
            <table>
                <tr class="cabecera">
                    <th class="tiempo"><Clock />Tiempo</th>
                    <th class="nombre"><User />Nombre</th>
                    <th class="descripcion"><List />Descripción</th>
                </tr>
                <tr v-for="item in cambios">
                    <td>{{ item.fecha_hora }}</td>
                    <td>{{ obtenerNombreUsuario(item.usuario) }}</td>
                    <td>{{ item.tipo }} en {{ item.id_registro }}</td>
                </tr>
            </table>
        </div>
    </AreaDesplazamiento>
</template>

<style scoped>
    .historial {
        padding: 2em;
        table {
            width: 100%;
            .cabecera {
                .tiempo {
                    width: 50px;
                    text-align: left;
                }
                .nombre {
                    width: 100px;
                    text-align: left;
                }
                .descripcion {
                    width: 200px;
                    text-align: left;
                }
                svg {
                    height: 1em;
                    width: auto;
                    margin-right: 0.5em;
                    stroke-width: 0.2em;
                }
            }
        }
    }
</style>