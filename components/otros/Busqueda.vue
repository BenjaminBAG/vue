<script setup> 
    import { Search } from 'lucide-vue-next' 
</script> 

<template> 
    <form action=""> 
        <div class="barra-busqueda">
            <Search />
            <input type="search" name="q" placeholder="Buscar contenido..." required>
        </div>
    </form> 
</template> 

<style> 
    form { 
        margin-bottom: 1em; 
        .barra-busqueda {
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 100%;
            max-width: 300px;
            svg {
                width: 1em;
                position: absolute;
                left: 0.75em;
                color: var(--negro);
                opacity: 0.5;
                pointer-events: none;
            }
            input[type="search"] { 
                width: 100%;
                padding: 0.5em 0.5em 0.5em 2.5em;
                border-radius: 10px; 
                border: none; 
                background-color: var(--blanco); 
                color: var(--negro); 
                font-size: 1em; 
                outline: none; 
                &::-webkit-search-cancel-button {
                    cursor: pointer;
                }
            } 
        }
    } 
</style>