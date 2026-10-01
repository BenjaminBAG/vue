<script setup>
    import { computed, ref } from 'vue'
    import * as iconos from 'lucide-vue-next'

    const menus = computed(() => ['Secciones', 'Texto', 'Listas', 'Multimedia'])
    const menuActivo = ref('Títulos')

    const herramientas = computed(() => [
        {
            id: 'h1',
            menu: 'Secciones',
            nombre: 'Título H1',
            icono: 'Heading1',
            insercion: '\n\n# Título principal'
        },
        {
            id: 'h2',
            menu: 'Secciones',
            nombre: 'Título H2',
            icono: 'Heading2',
            insercion: '\n\n## Subtítulo'
        },
        {
            id: 'h3',
            menu: 'Secciones',
            nombre: 'Título H3',
            icono: 'Heading3',
            insercion: '\n\n### Subtítulo'
        },
        {
            id: 'h4',
            menu: 'Secciones',
            nombre: 'Título H4',
            icono: 'Heading4',
            insercion: '\n\n#### Subtítulo'
        },
        {
            id: 'link',
            menu: 'Texto',
            nombre: 'Enlace',
            icono: 'Link2',
            insercion: '[Portal de ejemplo](https://www.example.com)'
        },
        {
            id: 'resaltado',
            menu: 'Texto',
            nombre: 'Resaltado',
            icono: 'PenLine',
            insercion: '==texto resaltado=='
        },
        {
            id: 'italica',
            menu: 'Texto',
            nombre: 'Itálica',
            icono: 'Italic',
            insercion: '*texto en itálica*'
        },
        {
            id: 'negrita',
            menu: 'Texto',
            nombre: 'Negrita',
            icono: 'Bold',
            insercion: '**Texto destacado**'
        },
        {
            id: 'comando',
            menu: 'Texto',
            nombre: 'Comando',
            icono: 'Code',
            insercion: '`Ctrl + C`'
        },
        {
            id: 'nota-al-pie',
            menu: 'Texto',
            nombre: 'Nota al pie',
            icono: 'StickyNote',
            insercion: '\n\nTexto con referencia.[^1]\n\n[^1]: Esta es la nota al pie del contenido.'
        },
        {
            id: 'icono-inline',
            menu: 'Texto',
            nombre: 'Ícono en línea',
            icono: 'Star',
            insercion: '\n\n:check:'
        },
        {
            id: 'tabla2x2',
            menu: 'Listas',
            nombre: 'Tabla 2*2',
            icono: 'Grid2X2',
            insercion: '\n\n| Proyecto | Estado |\n| :-- | :-- |\n| Portal 2 | En progreso |'
        },
        {
            id: 'tabla3x3',
            menu: 'Listas',
            nombre: 'Tabla 3*3',
            icono: 'Grid3X3',
            insercion: '\n\n| Proyecto | Estado | Fecha |\n| :-- | :-- | :-- |\n| Portal 2 | En progreso | 01/01/2027 |\n| Documentación | Revisar | 02/02/2027 |'
        },
        {
            id: 'lista-no-ordenada',
            menu: 'Listas',
            nombre: 'Lista no ordenada',
            icono: 'List',
            insercion: '\n\n- Revisión del contenido\n- Ajuste del diseño\n- Publicación final'
        },
        {
            id: 'lista-ordenada',
            menu: 'Listas',
            nombre: 'Lista ordenada',
            icono: 'ListOrdered',
            insercion: '\n\n1. Abrir el documento\n2. Editar el texto\n3. Guardar cambios'
        },
        {
            id: 'cita',
            menu: 'Secciones',
            nombre: 'Cita',
            icono: 'Quote',
            insercion: '\n\n> La documentación clara evita errores y acelera la entrega.'
        },
        {
            id: 'bloque-codigo',
            menu: 'Secciones',
            nombre: 'Bloque de código',
            icono: 'CodeXml',
            insercion: '\n\n```markdown\n# Portada\n## Sección principal\nTexto de ejemplo\n```'
        },
        {
            id: 'callout',
            menu: 'Secciones',
            nombre: 'Callout',
            icono: 'PanelTop',
            insercion: '\n\n::: warning\nRevisa antes de publicar este contenido.\n:::'
        },
        {
            id: 'detalles',
            menu: 'Secciones',
            nombre: 'Detalles',
            icono: 'EyeOff',
            insercion: '\n\n:::details Ver más\nAquí va el contenido oculto.\n:::'
        },
        {
            id: 'imagen',
            menu: 'Multimedia',
            nombre: 'Imagen',
            icono: 'Image',
            insercion: '\n\n![Logo del proyecto](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80)'
        },
        {
            id: 'video',
            menu: 'Multimedia',
            nombre: 'Video',
            icono: 'Clapperboard',
            insercion: '\n\n```video\nhttps://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4\n```'
        },
        {
            id: 'flowchart',
            menu: 'Multimedia',
            nombre: 'Diagrama de flujo',
            icono: 'Workflow',
            insercion: '\n\n```mermaid\nflowchart TD\nA[Inicio] --> B[Procesar]\nB --> C[Fin]\n```'
        },
        {
            id: 'chart-pie',
            menu: 'Multimedia',
            nombre: 'Gráfico de pastel',
            icono: 'ChartPie',
            insercion: '\n\n```mermaid\npie title Mascotas rescatadas por voluntarios\n"Perros" : 386\n"Gatos" : 85\n"Ratas" : 15\n```'
        },
        {
            id: 'main-map',
            menu: 'Multimedia',
            nombre: 'Mapa mental',
            icono: 'Share2',
            insercion: '\n\n```mermaid\nmindmap\nRoot\n  A\n    B\n    C\n```'
        },
        {
            id: 'tree-view',
            menu: 'Multimedia',
            nombre: 'Vista de árbol',
            icono: 'FolderTree',
            insercion: '\n\n```mermaid\n---\n---\nconfig:\n  treeView:\n    showIcons: true\n---\ntreeView-beta\n    01-carpeta_madre/\n        archivo ::: highlight ## detalles\n    archivo ## detalles\n```'
        },
    ])

    const herramientasFiltradas = computed(() =>
        herramientas.value.filter((herramienta) => herramienta.menu === menuActivo.value)
    )

    const emit = defineEmits(['insertar-texto'])

    const insertarTexto = (texto) => {
        emit('insertar-texto', texto)
    }
</script>

<template>
    <div id="barra-herramientas-edicion">
      <div>
        <button
            v-for="item in menus"
            :key="item"
            type="button"
            :class="{ activo: menuActivo === item }"
            :aria-pressed="menuActivo === item"
            @click="menuActivo = item"
        >
            {{ item }}
        </button>
      </div>
      <div>
        <button
            v-for="herramienta in herramientasFiltradas"
            :key="herramienta.id"
            type="button"
            :title="herramienta.nombre"
            @click="insertarTexto(herramienta.insercion)"
        >
            <component :is="iconos[herramienta.icono]" />
        </button>
      </div>
    </div>
</template>

<style scoped>
    #barra-herramientas-edicion {
        width: 100%;
        background-color: var(--beige);
        border-radius: 10px 10px 0 0;
        border: none;
        field-sizing: content;
        padding: 0.2em;
        gap: 0.2em;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: column;
        div {
            margin: 0;
            border: none;
            button {
                border: none;
                background-color: transparent;
                cursor: pointer;
                color: var(--negro);
                align-items: center;
                justify-content: center;
                padding: 0.2em 0.5em;
                border-radius: 8px;
                transition: background-color 0.2s ease, transform 0.2s ease;
                display: inline;
                font-size: 0.8em;
                &:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                    transform: translateY(-1px);
                }
                &.activo {
                    background-color: rgba(0, 0, 0, 0.1);
                }
                svg {
                    width: 1.5em;
                    height: 1.5em;
                }
            }
        }
    }
</style>