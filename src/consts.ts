import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Your Blog Name',
  description:
    'A brief description of your blog. This will be used in meta tags and social sharing.',
  href: 'https://yourdomain.com',
  author: 'your-author-id',
  locale: 'en-US',
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
    href: 'https://github.com/username',
    label: 'GitHub',
  },
  {
    href: 'https://twitter.com/username',
    label: 'Twitter',
  },
  {
    href: 'mailto:your@email.com',
    label: 'Email',
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

// Newsletter consent text (centralized for GDPR compliance)
export const NEWSLETTER_CONSENT_TEXT = {
  text: 'I agree to receive newsletter emails.',
  privacyLink: '/privacy',
  privacyText: 'Privacy Policy',
}
