import { DEFAULT_LANGUAGE, LANGUAGES} from '@/consts'
import type { Language, Translation, Translations } from '@/types'


export function localizeUrl(url: string, astro: any){
  return getLocalizedUrl(url, getLanguageFromUrl(astro.originPathname))
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
  
  // Add language prefix
  return `/${language}/${cleanPath}`
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

export function localizeString(astro: any, translations: Translations){
  const language = getLanguageFromUrl(astro.originPathname)
  return translations[language]
}

export function localizeStringFromLanguage(language: string, translations: Translations){
  return translations[language]
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
