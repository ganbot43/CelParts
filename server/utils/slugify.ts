import slugifyLib from 'slugify'

export function makeSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: 'es' })
}
