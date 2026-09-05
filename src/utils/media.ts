import type { ImageDTO } from '@/utils/types/api/generatedApiGo'

export type ImagePresetName = 'thumb' | 'card' | 'pdp' | 'zoom'
export type ImageFormat = 'webp' | 'jpeg'

const PRESET_FALLBACK: Record<ImagePresetName, ImagePresetName[]> = {
  thumb: ['thumb', 'card', 'pdp', 'zoom'],
  card: ['card', 'pdp', 'thumb', 'zoom'],
  pdp: ['pdp', 'zoom', 'card', 'thumb'],
  zoom: ['zoom', 'pdp', 'card', 'thumb'],
}

function presetPath(
  image: ImageDTO | null | undefined,
  preset: ImagePresetName,
  format: ImageFormat,
): string | undefined {
  const formats = image?.presets?.[preset]
  if (!formats) return undefined
  if (formats[format]) return formats[format]
  if (format === 'jpeg') return formats.jpg
  return undefined
}

function resolvePreset(
  image: ImageDTO | null | undefined,
  preset: ImagePresetName,
): ImagePresetName | undefined {
  return PRESET_FALLBACK[preset].find((candidate) =>
    Boolean(presetPath(image, candidate, 'jpeg') || presetPath(image, candidate, 'webp')),
  )
}

function storageBaseUrl(): string {
  const fromEnv = String(import.meta.env.VITE_FILE_STORAGE_URL || '').trim()
  if (fromEnv) return fromEnv

  const api = String(import.meta.env.VITE_API_URL || '').trim()
  if (!api) return ''
  try {
    return `${new URL(api).origin}/`
  } catch {
    return ''
  }
}

function joinStorageUrl(base: string, assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) return assetPath

  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
  if (!base) return path

  let origin = ''
  let basePath = ''
  try {
    const url = new URL(base)
    origin = url.origin
    basePath = url.pathname.replace(/\/$/, '')
  } catch {
    origin = base.replace(/\/$/, '')
    basePath = ''
  }

  // VITE_FILE_STORAGE_URL may be either the API origin or already ".../storage/"
  if (basePath === '/storage' || basePath.endsWith('/storage')) {
    return `${origin}${basePath}${path.replace(/^\/storage\/?/, '/')}`
  }

  return `${origin}${path}`
}

export function imageSrc(
  image: ImageDTO | null | undefined,
  preset: ImagePresetName = 'card',
  format: ImageFormat = 'jpeg',
): string {
  const resolved = resolvePreset(image, preset)
  if (!resolved) return ''
  const path = presetPath(image, resolved, format) || presetPath(image, resolved, 'jpeg')
  if (!path) return ''
  return joinStorageUrl(storageBaseUrl(), path)
}

export function fileSrc(path?: string | null): string {
  if (!path) return ''
  return joinStorageUrl(storageBaseUrl(), path)
}
