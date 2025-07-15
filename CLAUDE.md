# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Docker-based Development
This project uses Docker Compose for the development environment. All development should be done through Docker containers.

**Initial Setup:**
```bash
# Build containers
docker compose build

# Install node_modules (required before development)
docker compose run --rm node npm install
```

**Development:**
```bash
# Start all services (frontend, backend, database)
docker compose up -d

# Access frontend at http://localhost:5173
# Access backend API at http://localhost:8080
# Access Storybook at http://localhost:6006 (after running storybook command)
```

**Frontend Commands (run inside container):**
```bash
# Enter frontend container
docker compose exec node bash

# Development server (already runs via compose)
npm run dev

# Build for production
npm run build

# Linting
npm run lint

# Storybook
npm run storybook
```

**Backend Commands:**
```bash
# Enter backend container
docker compose exec app bash

# Build Go application
go build -o myapp cmd/myapp/main.go

# Run Go application
./myapp
```

## Architecture Overview

### Project Structure
This is a full-stack protein supplement review application with:
- **Frontend**: React + TypeScript + Vite in `/frontend`
- **Backend**: Go with clean architecture in `/backend`
- **Database**: MySQL 8.4

### Frontend Architecture
- **Framework**: React 19 + TypeScript with Vite
- **Routing**: React Router DOM with routes in `src/routes/index.tsx`
- **Styling**: TailwindCSS v4 with Radix UI components
- **State Management**: Zustand (currently commented out in `src/store/useStore.ts`)
- **Component Development**: Storybook for isolated component development
- **Testing**: Vitest with Playwright browser testing

**Key Frontend Structure:**
- `src/pages/`: Main page components (Home, Profile, Discover)
- `src/components/`: Reusable UI components with Storybook stories
- `src/components/ui/`: Shadcn/ui-style components (button, card, dialog, etc.)
- `src/types/`: TypeScript type definitions
- `src/lib/utils.ts`: Utility functions using clsx and tailwind-merge

### Backend Architecture
- **Pattern**: Clean Architecture with layers
- **Structure**:
  - `cmd/myapp/main.go`: Application entry point
  - `internal/handler/`: HTTP handlers
  - `internal/service/`: Business logic
  - `internal/repository/`: Data access layer
  - `internal/model/`: Data models
- **Database**: MySQL with SQL driver
- **Configuration**: Environment variables via godotenv

### Domain Model
The application centers around protein supplement reviews with:
- **Users**: Profile management with levels and avatars
- **Reviews**: Product reviews with images, ratings, and detailed metrics
- **Products**: Protein supplements with flavor profiles and nutritional data

### Development Workflow
1. Use Docker containers for all development
2. Frontend components should be developed with Storybook
3. Follow the existing clean architecture patterns in the backend
4. Use the established TypeScript interfaces in `src/types/review.ts`
5. All UI components use Radix UI + TailwindCSS pattern

### Testing
- Frontend: Vitest with Storybook testing addon
- Browser testing: Playwright integration
- Run tests: `vitest` (inside frontend container)

### Important Notes
- Always install node_modules on host before development to avoid volume mount issues
- The application is in Japanese (as seen in README)
- State management (Zustand) is prepared but currently commented out
- Component library follows shadcn/ui patterns with Radix UI primitives