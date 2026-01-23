import React from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Rss,
  Globe,
  MessageCircleQuestion,
} from 'lucide-react'
import type { SocialLink } from '@/types'

// Map labels to Lucide React components
const IconMap: Record<string, React.ElementType> = {
  Website: Globe,
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Email: Mail,
  RSS: Rss,
}

interface SocialIconsProps {
  links: SocialLink[]
}

const SocialIcons: React.FC<SocialIconsProps> = ({ links }) => {
  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {links.map(({ href, label }) => {
        const IconComponent = IconMap[label] || MessageCircleQuestion
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              title={label}
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconComponent className="h-4 w-4" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SocialIcons
