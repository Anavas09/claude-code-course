# AGENTS.md - Development Guidelines for uigen

This document provides essential information for agentic coding assistants working in the uigen repository. Follow these guidelines to maintain consistency and quality in the codebase.

## Build, Lint, and Test Commands

### Core Commands
- **Development server**: `npm run dev` (uses Turbopack for fast builds)
- **Production build**: `npm run build`
- **Production server**: `npm run start`
- **Linting**: `npm run lint` (ESLint with Next.js config)
- **Testing**: `npm test` (Vitest test runner)
- **Setup**: `npm run setup` (installs deps, generates Prisma client, runs migrations)

### Testing Specific Commands
- **Run all tests**: `npm test`
- **Run single test file**: `npm test -- --run src/path/to/test.ts`
- **Run tests matching pattern**: `npm test -- --run --testNamePattern="test name"`
- **Watch mode**: `npm test -- --watch`
- **Coverage report**: `npm test -- --coverage`
- **Type checking during tests**: `npm test -- --typecheck`

### Database Commands
- **Reset database**: `npm run db:reset` (drops and recreates database)
- **Generate Prisma client**: `npx prisma generate`

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled - all code must pass strict TypeScript checks
- **Target**: ES2017
- **JSX**: Preserve (for Next.js)
- **Path aliases**: `@/*` maps to `./src/*`
- **Module resolution**: Bundler (for modern module resolution)

### Import Organization
```typescript
// 1. External imports (React, libraries)
import * as React from "react"
import { useState } from "react"
import { Button } from "@radix-ui/react-dialog"

// 2. Internal imports (use @/ aliases)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// 3. Relative imports (only when necessary)
import { helper } from "./helpers"
```

### Component Patterns
```typescript
// Use proper TypeScript typing with React.ComponentProps
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Styling with Tailwind CSS
- Use shadcn/ui components with class-variance-authority (CVA) for variants
- Apply conditional classes with the `cn()` utility function
- Follow Tailwind CSS best practices and shadcn/ui design tokens
- Use CSS variables for theming (configured in components.json)

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`, `ChatInterface`)
- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names
- **Test files**: `*.test.ts` or `*.test.tsx` colocated with source files

### Comments
- Use comments sparingly
- Only comment complex code

### Error Handling
```typescript
// Graceful error handling with user-friendly messages
try {
  const result = await riskyOperation()
  return { success: true, data: result }
} catch (error) {
  console.error("Operation failed:", error)
  return { success: false, error: "User-friendly error message" }
}
```

### Testing Patterns
```typescript
// Use Vitest with descriptive test names
test("transformJSX handles transform errors gracefully", () => {
  // Mock dependencies
  vi.mocked(Babel.transform).mockImplementationOnce(() => {
    throw new Error("Transform failed")
  })

  const result = transformJSX("invalid code", "test.jsx", new Set())

  expect(result.code).toBe("")
  expect(result.error).toBe("Transform failed")
})
```

### Database and API Patterns
- Use Prisma Client for database operations
- Implement proper error handling for database queries
- Use Server Components for data fetching where possible
- Implement proper authentication checks in API routes

### Database Schema
- The database schema is defined in the `prisma/schema.prisma` file
- Reference it anytime you need to understand the structure of data stored in database
- **Models**:
  - `User`: id, email, password, createdAt, updatedAt, projects (relation)
  - `Project`: id, name, userId, messages, data, createdAt, updatedAt, user (relation)
- **Database**: SQLite with file-based storage (`dev.db`)

### Security Considerations
- Never commit secrets or API keys to the repository
- Use environment variables for sensitive configuration
- Implement proper input validation and sanitization
- Follow Next.js security best practices

### File Organization
```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat-related components
│   └── editor/            # Editor components
├── lib/                   # Utilities and business logic
│   ├── __tests__/         # Test files
│   ├── contexts/          # React contexts
│   ├── tools/             # Utility functions
│   └── prompts/           # AI prompt templates
├── actions/               # Server actions
├── hooks/                 # Custom React hooks
├── middleware.ts          # Next.js middleware
└── generated/             # Generated files (Prisma, etc.)
```

### Git Workflow
- Write clear, concise commit messages focusing on "why" not "what"
- Use conventional commit format when appropriate
- Run `npm run lint` and `npm test` before committing
- Never commit directly to main branch without review

### Development Workflow
1. Run `npm run setup` for initial setup
2. Use `npm run dev` for development with hot reloading
3. Write tests alongside new features using Vitest
4. Run `npm run lint` to check code quality
5. Run `npm test` to ensure tests pass
6. Use `npm run build` to verify production build works

This document should be updated when development practices evolve or new tools are added to the project.</content>
<parameter name="filePath">C:\Users\angel\OneDrive\Documentos\Programación\uigen\AGENTS.md