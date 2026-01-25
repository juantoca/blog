import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu'
import { NAV_LINKS } from '@/consts'
import { Menu, ExternalLink } from 'lucide-react'
import { getLocalizedUrl, localizeString, localizeStringFromLanguage } from '@/lib/i18n'

const MobileMenu = ({ language, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleViewTransitionStart = () => {
      setIsOpen(false)
    }
    document.addEventListener('astro:before-swap', handleViewTransitionStart)
    return () => {
      document.removeEventListener(
        'astro:before-swap',
        handleViewTransitionStart,
      )
    }
  }, [])

  const isExternalLink = (href: string) => {
    return href.startsWith('http')
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DropdownMenuTrigger asChild onClick={() => setIsOpen((val) => !val)}>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          title="Menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        {children}
        {NAV_LINKS.map((item) => {
          const isExternal = isExternalLink(item.href)
          const isInsideLink = item.label.toLowerCase() === 'inside'
          return (
            <DropdownMenuItem key={getLocalizedUrl(item.href, language)} asChild>
              <a
                href={getLocalizedUrl(item.href, language)}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`flex w-full items-center gap-2 text-lg font-medium capitalize ${
                  isInsideLink
                    ? 'text-primary hover:text-primary/80'
                    : isExternal
                      ? 'text-primary/90 hover:text-primary'
                      : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>{localizeStringFromLanguage(language, item.translations)}</span>
                {isExternal && (
                  <ExternalLink
                    className={`h-4 w-4 flex-shrink-0 opacity-80 ${isInsideLink ? 'text-primary' : ''}`}
                    aria-hidden="true"
                  />
                )}
              </a>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileMenu
