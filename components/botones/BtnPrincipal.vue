<template>
    <div class="contenedor_boton_principal">
        <button class="boton_principal" type="submit" :disabled="disabled">
            <Check class="icono"/>
            <p>{{ texto }}</p>
        </button>
    </div>
</template>

<script>
    import { Check } from 'lucide-vue-next'
    
    export default {
        name: 'BtnPrincipal',
        components: {
            Check
        },
        props: {
            texto: {
                type: String,
                default: 'Ingresar'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped>
    .contenedor_boton_principal {
        width: 100%;
        display: flex;
        justify-content: right;
        .boton_principal {
            width: auto;
            margin: 1em 0;
            padding: 0.5em 3em;
            text-transform: uppercase;
            background-color: transparent;
            border-radius: 10px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background-color 0.3s ease;
            .icono {
                transition: transform 0.3s ease;
                height: 2em;
                width: 2em;
                padding-right: 0.5em;
            }
            &:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            &:hover {
                background-color: var(--beige);
                .icono {
                    transform: rotate(7deg) scale(1.1);
                }
                p {
                    transform: scale(1.1);
                }
            }
            p {
                transition: transform 0.3s ease;
            }
        }
    }
</style>