/**
 * Transliterate Cyrillic characters to Latin
 */
export const transliterate = (text: string): string => {
  const cyrillicToLatin: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  }

  return text
    .toLowerCase()
    .split('')
    .map((char) => cyrillicToLatin[char] || char)
    .join('')
}

export const SLUG_DELIMITERS = {
  DASH: '-',
  UNDERSCORE: '_',
  DOT: '.',
} as const

type SlugDelimiter = (typeof SLUG_DELIMITERS)[keyof typeof SLUG_DELIMITERS]


/**
 * Generate URL-friendly slug from text
 */
export const generateSlug = (
  text: string,
  delimiter: SlugDelimiter = SLUG_DELIMITERS.DASH,
): string => {
  if (!text.trim()) return ''

  return transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, delimiter)
    .replace(/^-+|-+$/g, '')
}
