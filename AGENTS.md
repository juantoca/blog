# Agent Instructions for `merox-erudite` (Astro + React + Tailwind)

This file contains instructions for AI coding agents (such as Cursor, Copilot, or opencode) operating in this repository. Please read this file carefully before making changes to understand the architectural patterns and style guidelines.

## 1. Project Overview & Architecture

- **Tech Stack:** Astro 5, React 19, TailwindCSS 4, TypeScript.
- **Goal:** A feature-rich blog theme with MDX support, UI components (shadcn-ui), newsletter integration, and multi-language support (i18n).
- **Core Strategy:**
  - **Astro First:** Default to `.astro` components for static content, layouts, routing, and SEO. Astro is the primary framework.
  - **React for Interactivity:** Only use `.tsx` React components when client-side interactivity or complex state is strictly required.
  - **Hydration:** Use appropriate Astro client directives (e.g., `client:load`, `client:visible`, `client:idle`) when embedding React components inside Astro pages.

### Directory Structure

- `src/components`: UI components. Contains both `.astro` (static) and `.tsx` (interactive) files.
- `src/pages`: Astro file-based routing.
- `src/content`: MDX blog posts, authors, and other collections.
- `src/lib`: Utility functions, i18n logic, and helpers (e.g., `utils.ts` for `cn()`).
- `src/styles`: Global CSS and Tailwind configurations.
- `src/consts.ts`: Global configuration and constants.
- `src/types.ts`: Global shared TypeScript types.

## 2. Build, Lint, and Test Commands

Agents must use these commands to verify changes before concluding a task.

### Development & Build

- **Development Server:** `npm run dev`
- **Production Build:** `npm run build`
  - _Agent Rule:_ **Always run `npm run build`** after making significant code changes to ensure there are no compilation errors or broken imports.
- **Preview Production:** `npm run preview`

### Formatting & Linting

- **Format Code:** `npm run prettier`
  - The project uses Prettier with specialized plugins (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`, `prettier-plugin-astro-organize-imports`).
  - Do not manually format code or reorder Tailwind classes/imports; let Prettier handle it.
- **Type Checking:** `npx astro check`
  - Note: `strict` mode is disabled in `tsconfig.json`, but `astro check` verifies basic type safety and component props.

### Testing

- **Current State:** The project has Playwright installed (`playwright` in dependencies). No explicit test runner script exists in `package.json` yet.
- **Running a Single Test (Playwright):**
  ```bash
  npx playwright test <path-to-test-file> --project=chromium
  ```
- **Running a Single Test (Vitest/Jest if added in future):**
  ```bash
  npx vitest run <path-to-test-file>
  ```
  _(Agents: Use glob/grep to find existing tests before attempting to run them. If asked to write tests, prefer standard Playwright e2e structures unless instructed otherwise)._

## 3. Code Style Guidelines

### 3.1. Formatting & Conventions

- **Quotes & Semicolons:** Prettier uses `singleQuote: true` and `semi: false`. Do not use semicolons unless necessary to prevent ASI issues.
- **Tailwind:** Class sorting is automatic. Use standard Tailwind syntax. For complex dynamic classes, use the `cn()` utility located in `src/lib/utils.ts` (which wraps `clsx` and `tailwind-merge`).

### 3.2. Imports & Exports

- **Organization:** Imports are automatically organized by Prettier. Do not worry about manual grouping, but keep them at the top of the file.
- **Path Aliases:** Use the `@/` alias for absolute imports pointing to the `src/` directory.
  - _Good:_ `import Button from '@/components/Button'`
  - _Bad:_ `import Button from '../../components/Button'`
- **Exports:** Prefer named exports for utilities and constants. Default exports are standard for Astro pages/components and default React components.

### 3.3. TypeScript & Types

- **Strictness:** `tsconfig.json` has `strict: false`. While you should avoid `any`, be aware that the typing context is loose.
- **Location:** Keep shared types/interfaces in `src/types.ts`. Component-specific types can be co-located with the component.
- **Syntax:** Prefer `interface` over `type` for object shapes, unless union or intersection types are required.
- **Props:** Always define an interface for component `Props`. For Astro components, use `interface Props { ... }` in the frontmatter.

### 3.4. Naming Conventions

- **Components/Files:** PascalCase for UI components (`BlogPost.astro`, `ThemeToggle.tsx`).
- **Pages:** kebab-case or standard lowercase for routes (`blog.astro`, `about-us.astro`).
- **Variables/Functions:** camelCase (`fetchPosts`, `formatDate`).
- **Constants:** UPPER_SNAKE_CASE for global constants in `src/consts.ts` (`SITE_TITLE`, `PAGE_SIZE`).
- **Directories:** kebab-case for everything.

### 3.5. State Management & Data Fetching

- **React State:** Use standard React hooks (`useState`, `useEffect`) for isolated component state. Avoid introducing global state managers (Zustand/Redux) unless specifically requested by the user.
- **Astro State:** Astro pages are static/server-rendered. Use URL parameters or query strings to pass state between Astro pages where possible.
- **Data Fetching:** Prefer fetching data in Astro frontmatter at build-time (e.g., using `getCollection` for Markdown) over client-side fetching in React, unless the data changes dynamically per user.

### 3.6. Architecture Specifics

- **Internationalization (i18n):** The project uses a custom i18n implementation in `src/lib/i18n.ts`. When adding strings to the UI, verify if they should be localized using `UI_TRANSLATIONS` and `localizeString`.
- **Error Handling:**
  - Use standard `try/catch` blocks for async operations.
  - Avoid swallowing errors silently. If a fetch fails or content is missing, render a fallback UI or log a descriptive error.
  - For non-existent content in Astro pages, return a 404 response: `return new Response(null, { status: 404 })` instead of throwing a generic error.

## 4. Workflows & Agent Mandates

When executing a task, AI agents must adhere to the following workflow:

1. **Understand Context:** Use `glob` and `grep` to find relevant files, understand the existing architecture, and look for similar patterns (e.g., how other `.astro` components receive props).
2. **Verify Dependencies:** Do not assume a library is available. Check `package.json` before trying to import new tools. If a tool is missing, ask the user before installing it.
3. **Write & Edit:** Modify files using idiomatic code that matches the surrounding style. Add concise comments only for complex logic (focusing on _why_, not _what_).
4. **Self-Verification:**
   - Format modified files: `npm run prettier`
   - Check types: `npx astro check`
   - Build the project: `npm run build`
5. **Report:** After successfully verifying, report completion concisely. Do not over-explain your steps unless requested.
