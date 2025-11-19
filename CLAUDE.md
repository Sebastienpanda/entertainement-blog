# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 blog application built with zoneless change detection, standalone components, and Tailwind CSS + DaisyUI for styling. The app uses pnpm as the package manager.

## Key Architecture Decisions

### Angular Configuration

- **Zoneless Change Detection**: The app uses `provideZonelessChangeDetection()` instead of Zone.js for improved performance (src/app/app.config.ts:9)
- **Standalone Components**: All components are standalone (no NgModules)
- **Strict TypeScript**: Enabled with strict templates and injection parameters
- **Signal-based Reactivity**: Uses Angular signals, computed values, and `toSignal()` for reactive state management
- **Component Input Binding**: Router bindings are enabled via `withComponentInputBinding()` (src/app/app.config.ts:10)

### Styling System

- Uses **Tailwind CSS v4** with PostCSS plugin (configured in .postcssrc.json)
- Uses **DaisyUI v5** component library with a custom light theme
- Theme colors and design tokens are defined directly in src/styles.css using CSS custom properties

**CRITICAL - CSS Classes Rules**:

⚠️ **ONLY use classes that exist in Tailwind v4 and DaisyUI v5**

- **FORBIDDEN classes from older versions**:
  - ❌ `form-control` (DaisyUI v4, removed in v5)
  - ❌ `form-input` (old Tailwind Forms plugin)
  - ❌ `btn-primary` without `btn` base class

- **DaisyUI v5 Component Classes** (always check documentation):
  - Buttons: `btn`, `btn-primary`, `btn-secondary`, `btn-accent`, `btn-ghost`, `btn-link`, `btn-sm`, `btn-lg`
  - Inputs: `input`, `input-bordered`, `input-primary`, `input-sm`, `input-lg`
  - Forms: `label`, `label-text`, `form-control` is REMOVED in v5
  - Cards: `card`, `card-body`, `card-title`, `card-actions`
  - Badges: `badge`, `badge-primary`, `badge-secondary`
  - Alerts: `alert`, `alert-info`, `alert-success`, `alert-warning`, `alert-error`

- **When in doubt**:
  1. Use pure Tailwind utility classes (e.g., `bg-blue-500`, `p-4`, `rounded-lg`)
  2. Check DaisyUI v5 docs: https://daisyui.com/components/
  3. Never invent or assume class names from older versions

- **Preferred approach**: Use Tailwind utilities first, DaisyUI components only when needed for complex UI patterns

### Service Architecture

Services use:

- `BehaviorSubject` for state management
- RxJS observables for reactive data streams
- `providedIn: 'root'` for singleton services
- LocalStorage for data persistence (articles.service.ts)

### Data Management

- **ArticlesService**: Uses faker.js to generate mock articles, cached in localStorage

## Development Commands

### Start Development Server

```bash
ng serve
# or using package.json script:
pnpm start
```

Server runs at http://localhost:4200/

### Build

```bash
pnpm build
```

Production build outputs to `dist/` with optimization enabled.

### Watch Mode (Development Build)

```bash
pnpm watch
```

### Run Tests

```bash
pnpm test
```

Uses Karma + Jasmine test runner.

### Generate Components

```bash
ng generate component component-name
```

## Project Structure

```
src/app/
├── core/
│   └── services/          # Singleton services (articles, compteur)
├── components/            # Reusable components (header)
├── articles/              # Article list and detail pages
├── home/                  # Home page
├── about/                 # About page
├── not-found/             # 404 page
├── app.config.ts          # Application configuration
└── app.routes.ts          # Route definitions
```

## Routing

Routes are defined in src/app/app.routes.ts:

- `/` - Home page
- `/about` - About page
- `/articles/:id` - Article detail page
- `**` - 404 Not Found (wildcard route)

Query parameters are supported (e.g., filtering articles by author).

## Component Patterns

### Component Naming

Components use class names without the "Component" suffix (e.g., `Home`, `Articles`, `Header` instead of `HomeComponent`).

### Template Files

Components use separate `.html` template files referenced via `templateUrl`.

### Naming Conventions

**IMPORTANT**: Follow these strict naming conventions throughout the codebase:

- **Private members**: Prefix with underscore `_`
  - Example: `private _userId = signal<string>('');`
  - Example: `private _initializeData() { ... }`

- **Observables**: Suffix with dollar sign `$`
  - Example: `articles$ = this.articlesService.getArticles();`
  - Example: `private _data$ = new BehaviorSubject<Data | null>(null);`

- **Signals**: Use plain names (no prefix/suffix)
  - Example: `count = signal(0);`
  - Example: `articles = toSignal(this.articles$, { initialValue: [] });`

- **Combined conventions**: For private observables, use both
  - Example: `private _articles$ = new BehaviorSubject<Article[]>([]);`

### TypeScript Strict Rules

**CRITICAL**: These rules are non-negotiable and MUST be followed:

- **Use `protected readonly` for injected services and dependencies**
  - ✅ CORRECT: `protected readonly articlesService = inject(ArticlesService);`
  - ❌ WRONG: `private articlesService = inject(ArticlesService);`
  - Rationale: `protected` allows testing access, `readonly` prevents accidental reassignment

- **NEVER use `any` type**
  - ✅ CORRECT: Use proper types, interfaces, or `unknown` if type is truly unknown
  - ❌ FORBIDDEN: `data: any`, `response: any`
  - If you don't know the type, use `unknown` and add type guards

- **NEVER use type assertions (`as`)**
  - ✅ CORRECT: Use type guards, proper typing, or type narrowing
  - ❌ FORBIDDEN: `data as Article`, `response as unknown as User`
  - Exception: Only acceptable for casting DOM elements with certainty (e.g., `event.target as HTMLInputElement`)

- **Always provide explicit return types for functions**
  - ✅ CORRECT: `getArticles(): Observable<Article[]> { ... }`
  - ❌ WRONG: `getArticles() { ... }`

### Reactive Patterns

- Use `signal()` for local component state
- Use `computed()` for derived state
- Use `toSignal()` to convert observables to signals
- Inject services with `inject()` function (no constructor injection)

## Testing

- Test framework: Jasmine + Karma
- Test files use `.spec.ts` suffix
- Budget limits: 500kB warning, 1MB error for initial bundle
