<script setup>
    import { User, Settings, Info } from 'lucide-vue-next'

    const opciones = [ 
        {nombre: 'Perfil', icono: User},
        {nombre: 'Administrador', icono: Settings},
        {nombre: 'Acerca de', icono: Info}
    ]
</script>

<template>
    <div class="seccion-menu-modal">
        <ul>
            <li v-for="item in opciones">
                <button>
                    <component :is="item.icono" class="icono" />
                    {{ item.nombre }}
                </button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .seccion-menu-modal {
        grid-column: 1;
        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            li {
              button {
                position: relative;
                overflow: hidden;
                width: 100%;
                margin: 0.2em 0;
                padding: 0.5em 0.5em 0.5em 1em;
                font-size: 1em;
                text-align: left;
                border-radius: 10px;
                border: none;
                background-color: var(--blanco);
                transition: all 0.3s ease-in-out;
                &::before {
                  content: "";
                  position: absolute;
                  top: 50%;
                  left: 0;
                  transform: translateY(-50%) translateX(-15px);
                  opacity: 0;
                  border-top: 8px solid transparent;
                  border-bottom: 8px solid transparent;
                  border-left: 10px solid var(--naranja);
                  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
                }
                &:hover {
                  cursor: pointer;
                  padding-left: 1.5em;
                  background-color: color-mix(var(--naranja), var(--blanco) 70%);
                  &::before {
                    opacity: 1;
                    transform: translateY(-50%) translateX(5px);
                  }
                }
              }
              .icono {
                  width: 1em;
                  height: auto;
              }
            }
            .documento_activo {
                padding-left: 1.5em;
                background-color: color-mix(var(--naranja), var(--blanco) 70%);
            }
        }
    }
</style>