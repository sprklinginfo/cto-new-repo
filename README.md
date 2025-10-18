# LingoLearn

LingoLearn is a mobile-first English learning experience that combines vocabulary drills, practice tests, and progress insights. The app is powered by React, TypeScript, Vite, and Chakra UI to deliver a fast development workflow and a touch-friendly interface.

## Getting started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Development server
```bash
npm run dev
```
> `npm run dev` starts the Vite development server. Use `-- --host` when developing on a different device or network.

### Available scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot module replacement |
| `npm run test` | Run the Vitest test suite once (CI-friendly) |
| `npm run lint` | Lint all source files with ESLint (TypeScript strict mode, Chakra UI style) |
| `npm run format` | Check formatting with Prettier |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Preview the production build locally |

## Project structure
```
src/
├── assets/        # Static assets (images, icons, fonts)
├── components/    # Reusable presentational components
├── data/          # Static datasets and mocks
├── hooks/         # Shared React hooks
├── pages/         # Route-level components (Home screen, etc.)
├── theme/         # Chakra UI theme configuration
├── App.tsx        # Root application component
└── main.tsx       # Application entry point
```

## Key tooling
- **Vite + React 19** for a modern, fast development environment
- **TypeScript** with strict mode enabled across the project
- **Chakra UI 2** for accessible UI primitives and theming
- **ESLint & Prettier** enforcing single quotes and no semicolons
- **Vitest + Testing Library** for component and hook testing

## Next steps
The scaffold includes sample content for the home page, Chakra UI theme configuration, and placeholder directories for future modules. Extend the pages, components, and data folders as you build out LingoLearn features.
