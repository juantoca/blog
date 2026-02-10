import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'

import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import expressiveCode from 'astro-expressive-code'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import tailwindcss from '@tailwindcss/vite'
import mermaid from 'astro-mermaid'

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Custom integration to force preload of interactive islands
function preloadInteractiveIslands() {
  return {
    name: 'preload-interactive-islands',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        
        // 1. Recursive function to find HTML files
        async function getHtmlFiles(dir) {
          const files = await fs.readdir(dir, { withFileTypes: true });
          let htmlFiles = [];
          for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
              htmlFiles = [...htmlFiles, ...(await getHtmlFiles(fullPath))];
            } else if (file.name.endsWith('.html')) {
              htmlFiles.push(fullPath);
            }
          }
          return htmlFiles;
        }

        const htmlFiles = await getHtmlFiles(distDir);

        // 2. Process each HTML file
        for (const file of htmlFiles) {
          let html = await fs.readFile(file, 'utf-8');
          
          // Find all island entry points (component-url attributes)
          // Matches: component-url="/_astro/mobile-menu.Br_hJrjG.js"
          const islandRegex = /(component-url|renderer-url)="([^"]+)"/g;
          const matches = [...html.matchAll(islandRegex)];
          
          if (matches.length > 0) {
            // Deduplicate URLs
            const scripts = [...new Set(matches.map(m => m[2]))];
            
            // Create preload tags
            const links = scripts
              .map(src => `<link rel="modulepreload" href="${src}">`)
              .join('');
            
            // Inject into <head>
            html = html.replace('</head>', `${links}</head>`);
            await fs.writeFile(file, html);
            console.log(`Preloaded ${scripts.length} islands in ${path.relative(distDir, file)}`);
          }
        }
      },
    },
  };
}


export default defineConfig({
  site: 'https://juantoca.net', // Update with your domain
  // Static output - API routes are handled by Cloudflare Pages Functions in /functions folder
  integrations: [
    preloadInteractiveIslands(),
    mermaid(),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme="${theme.name.split('-')[1]}"]`,
      defaultProps: {
        wrap: true,
        collapseStyle: 'collapsible-auto',
        overridesByLang: {
          'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
            {
              showLineNumbers: false,
            },
        },
      },
      styleOverrides: {
        codeFontSize: '0.75rem',
        borderColor: 'var(--border)',
        codeFontFamily: 'var(--font-mono)',
        codeBackground:
          'color-mix(in oklab, var(--muted) 25%, transparent)',
        frames: {
          editorActiveTabForeground: 'var(--muted-foreground)',
          editorActiveTabBackground:
            'color-mix(in oklab, var(--muted) 25%, transparent)',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBorderRadius: '0',
          editorTabBarBackground: 'transparent',
          editorTabBarBorderBottomColor: 'transparent',
          frameBoxShadowCssValue: 'none',
          terminalBackground:
            'color-mix(in oklab, var(--muted) 25%, transparent)',
          terminalTitlebarBackground: 'transparent',
          terminalTitlebarBorderBottomColor: 'transparent',
          terminalTitlebarForeground: 'var(--muted-foreground)',
        },
        lineNumbers: {
          foreground: 'var(--muted-foreground)',
        },
        uiFontFamily: 'var(--font-sans)',
      },
    }),
    mdx(),
    react(),
    sitemap(),
    icon(),
  ],
  vite: {
    // Type assertion needed due to Vite plugin type incompatibility between Astro and @tailwindcss/vite
    // This is the recommended approach per Astro documentation for Vite plugins
    plugins: [tailwindcss() as any],
    build: {
      rollupOptions: {
        output: {
          // Instruct Vite to bundle react components in a single component.
          // This reduces roundtrips and webpage loading cascading
          manualChunks(id) {
            return "bundle"
          },
        },
      },
    },
  },
  server: {
    port: 1234,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noreferrer', 'noopener'],
        },
      ],
      rehypeHeadingIds,
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'github-light',
            dark: 'github-dark',
          },
        },
      ],
    ],
    remarkPlugins: [remarkMath, remarkEmoji],
  },
  i18n : {
    locales: ["es", "en"],
    defaultLocale: "en",
    fallback: {
      es: "en"
    },
    routing: {
      fallbackType: "rewrite",
      prefixDefaultLocale: true
    }
  },
  prefetch: {
      prefetchAll: true
  }
})
