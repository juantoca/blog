import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Juan Toca',
  description:
    'My own personal blog were I post about engineering matters or other topics',
  href: 'https://juantoca.net',
  author: 'juantoca',
  locale: 'es-ES',
  featuredPostCount: 2,
  postsPerPage: 6,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/about',
    label: 'About',
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