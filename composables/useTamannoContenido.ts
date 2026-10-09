import { onMounted, watch } from 'vue'

const TAMANNO_MINIMO = 12
const TAMANNO_MAXIMO = 22
const TAMANNO_POR_DEFECTO = 14

interface OpcionesTamanno {
  almacenamiento?: string
  cssVariable?: string
  valorPorDefecto?: number
}

export function useTamannoContenido({
  almacenamiento = 'portal-tamanno-regular',
  cssVariable = '--tamanno-regular',
  valorPorDefecto = TAMANNO_POR_DEFECTO,
}: OpcionesTamanno = {}) {
  const tamannoActual = useState<number>(almacenamiento, () => valorPorDefecto)

  const aplicarTamanno = (tamanno: number) => {
    document.documentElement.style.setProperty(cssVariable, `${tamanno}px`)
  }

  const obtenerTamannoGuardado = () => {
    const valorGuardado = localStorage.getItem(almacenamiento)
    const valorNumerico = Number.parseInt(valorGuardado ?? '', 10)

    if (
      Number.isFinite(valorNumerico) &&
      valorNumerico >= TAMANNO_MINIMO &&
      valorNumerico <= TAMANNO_MAXIMO
    ) {
      return valorNumerico
    }

    return valorPorDefecto
  }

  onMounted(() => {
    tamannoActual.value = obtenerTamannoGuardado()
    aplicarTamanno(tamannoActual.value)
  })

  watch(tamannoActual, (tamanno) => {
    if (!import.meta.client) return

    aplicarTamanno(tamanno)
    localStorage.setItem(almacenamiento, String(tamanno))
  })

  return { tamannoActual }
}
