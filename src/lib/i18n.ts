import { DEFAULT_LANGUAGE, LANGUAGES, SITE_TRANSLATIONS } from '@/consts'
import type { Language } from '@/types'

/**
 * Get language from a post ID or path
 * Examples:
 * - "hello-world" -> "es" (default)
 * - "en/hello-world" -> "en"
 * - "es/hello-world" -> "es"
 */
export function getLanguageFromId(id: string): string {
  const parts = id.split('/')
  const firstPart = parts[0]
  
  if (firstPart in LANGUAGES) {
    return firstPart
  }
  
  return DEFAULT_LANGUAGE
}

/**
 * Get the slug without language prefix
 * Examples:
 * - "hello-world" -> "hello-world"
 * - "en/hello-world" -> "hello-world"
 * - "es/deep/nested/post" -> "deep/nested/post"
 */
export function getSlugWithoutLanguage(id: string): string {
  const parts = id.split('/')
  const firstPart = parts[0]
  
  if (firstPart in LANGUAGES) {
    return parts.slice(1).join('/')
  }
  
  return id
}

/**
 * Get language-specific URL
 * Examples:
 * - getLocalizedUrl("/blog/hello-world", "en") -> "/en/blog/hello-world"
 * - getLocalizedUrl("/blog/hello-world", "es") -> "/blog/hello-world" (default language)
 */
export function getLocalizedUrl(path: string, language: string): string {
  // Remove leading slash for consistent handling
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If it's the default language, don't add prefix
  if (language === DEFAULT_LANGUAGE) {
    return `/${cleanPath}`
  }
  
  // Add language prefix
  return `/${language}/${cleanPath}`
}


/**
 * Get the base slug for finding translations
 * This removes both language prefix and handles nested paths
 */
export function getBaseSlug(id: string): string {
  return getSlugWithoutLanguage(id)
}

/**
 * Get available languages list
 */
export function getAvailableLanguages(): Language[] {
  return Object.values(LANGUAGES)
}

/**
 * Check if a language is supported
 */
export function isValidLanguage(language: string): boolean {
  return language in LANGUAGES
}

/**
 * Get language from URL pathname
 * Examples:
 * - "/blog/hello-world" -> "es" (default)
 * - "/en/blog/hello-world" -> "en"
 */
export function getLanguageFromUrl(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (firstSegment && isValidLanguage(firstSegment)) {
    return firstSegment
  }
  
  return DEFAULT_LANGUAGE
}

/**
 * Get localized site information
 */
export function getLocalizedSite(language: string) {
  const baseTranslations = SITE_TRANSLATIONS[language] || SITE_TRANSLATIONS[DEFAULT_LANGUAGE]
  return {
    ...baseTranslations,
    locale: LANGUAGES[language]?.locale || LANGUAGES[DEFAULT_LANGUAGE].locale
  }
}

/**
 * Generate alternate language URLs for a given path
 */
export function getAlternateLanguageUrls(basePath: string): Record<string, string> {
  const alternates: Record<string, string> = {}
  
  Object.keys(LANGUAGES).forEach(lang => {
    alternates[lang] = getLocalizedUrl(basePath, lang)
  })
  
  return alternates
}

/**
 * Common UI translations
 */
export const UI_TRANSLATIONS = {
  es: {
    'nav.blog': 'Blog',
    'nav.about': 'Acerca de',
    'nav.projects': 'Proyectos',
    'post.readMore': 'Leer más',
    'post.readingTime': 'min de lectura',
    'post.publishedOn': 'Publicado el',
    'post.updatedOn': 'Actualizado el',
    'post.tags': 'Etiquetas',
    'post.author': 'Autor',
    'post.authors': 'Autores',
    'search.placeholder': 'Buscar artículos...',
    'search.noResults': 'No se encontraron resultados',
    'pagination.previous': 'Anterior',
    'pagination.next': 'Siguiente',
    'pagination.page': 'Página',
    'language.switch': 'Cambiar idioma',
    'language.current': 'Idioma actual',
  },
  en: {
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'post.readMore': 'Read more',
    'post.readingTime': 'min read',
    'post.publishedOn': 'Published on',
    'post.updatedOn': 'Updated on',
    'post.tags': 'Tags',
    'post.author': 'Author',
    'post.authors': 'Authors',
    'search.placeholder': 'Search articles...',
    'search.noResults': 'No results found',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.page': 'Page',
    'language.switch': 'Switch language',
    'language.current': 'Current language',
  }
}

/**
 * Get translated text for UI elements
 */
export function getTranslation(key: string, language: string = DEFAULT_LANGUAGE): string {
  const translations = UI_TRANSLATIONS[language] || UI_TRANSLATIONS[DEFAULT_LANGUAGE]
  return translations[key] || key
}