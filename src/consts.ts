import type { IconMap, SocialLink, Site, Language, NavLink } from '@/types'

// Default language - this will be used for URLs without language prefix
export const DEFAULT_LANGUAGE = 'en'

// Supported languages configuration
export const LANGUAGES: Record<string, Language> = {
  es: {
    code: 'es',
    name: 'Español',
    locale: 'es-ES',
  },
  en: {
    code: 'en',
    name: 'English',
    locale: 'en-US',
  },
}

export const SITE: Site = {
  title: 'Juan Toca',
  description:
    'A blog on engineering, projects, life, the universe and everything',
  href: 'https://juantoca.net',
  author: 'juantoca',
  locale: 'es-ES',
  featuredPostCount: 2,
  postsPerPage: 6,
}

export const NAV_LINKS: NavLink[] = [
  {
    href: '/blog',
    label: 'Blog',
    translations: {
      en: "Blog",
      es: "Blog"
    }
  },
  {
    href: '/about',
    label: 'About',
    translations: {
      en: "About",
      es: "Sobre mi"
    }
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/juantoca',
    label: 'GitHub',

  },
  {
    href: 'mailto:juantocamateo17@gmail.com',
    label: 'Email',
  },
  {
    href: 'https://www.linkedin.com/in/juantocamateo/',
    label: 'LinkedIn',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
