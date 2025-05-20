# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Coordinate App UI Guidelines

## Build Commands
- **Start Development Server**: `npm start`
- **Build Project**: `npm run build`
- **Build Production**: `npm run build-prod`
- **Watch Mode**: `npm run watch`

## Test Commands
- **Run All Tests**: `npm test`
- **Run Single Test**: `ng test --include=**/my-component.spec.ts`
- **Run Specific Test Case**: `ng test --include=**/my-component.spec.ts --test-name="should do something specific"`

## Lint/Style Commands
- **Lint**: `ng lint`
- **ESLint Check**: `eslint src/**/*.ts`

## Code Style Guidelines
- **Naming**: PascalCase for classes, interfaces, components; camelCase for variables, methods, properties
- **Components**: Use Angular component architecture with separate HTML, SCSS, TS files
- **Services**: Use dependency injection, implement interfaces for clear APIs
- **Typing**: Always use TypeScript types and interfaces; avoid 'any' type
- **Error Handling**: Use proper error handling with appropriate user feedback
- **Imports**: Group imports by Angular modules, third-party libraries, and app modules
- **Directory Structure**: Feature-based organization with shared components, services, and models
- **Testing**: Write unit tests for components and services with meaningful assertions