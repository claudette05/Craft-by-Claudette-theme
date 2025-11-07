# AI Development Rules for Craft by Claudette

This document outlines the core technologies and best practices to follow when developing for the Craft by Claudette application. Adhering to these guidelines ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

The Craft by Claudette application is built using a modern, component-based frontend stack:

*   **React:** The primary JavaScript library for building user interfaces.
*   **TypeScript:** Used for all application code to provide type safety, improve code quality, and enhance developer experience.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
*   **Framer Motion:** A powerful library for declarative animations and interactive components.
*   **Vite:** A fast development server and build tool for modern web projects.
*   **React Router:** (To be implemented for navigation) A standard library for client-side routing.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Lucide React:** A library for beautiful and customizable open-source icons.

## Library Usage Rules

To maintain a cohesive and efficient codebase, please follow these rules for library usage:

*   **React:** All UI elements must be developed as React components. Focus on creating small, reusable, and functional components.
*   **TypeScript:** All new `.tsx` files must be written in TypeScript. Existing JavaScript files should be migrated to TypeScript when modified significantly.
*   **Tailwind CSS:** All styling must be done using Tailwind CSS utility classes. Avoid writing custom CSS in separate files unless absolutely necessary for global styles (e.g., scrollbar hiding).
*   **Framer Motion:** Use Framer Motion for all animations, transitions, and interactive gestures to ensure a smooth and consistent user experience.
*   **React Router:** For any new pages or navigation flows, implement routing using React Router. Keep the main route definitions within `src/App.tsx`.
*   **shadcn/ui:** Prioritize using components from the shadcn/ui library for common UI elements (e.g., buttons, forms, dialogs, cards). Only create custom components if shadcn/ui does not offer a suitable alternative or if significant customization is required.
*   **Lucide React:** Use Lucide React for all icons throughout the application. Replace any custom SVG icons with their Lucide React equivalents when making changes to existing components.
*   **File Structure:** New pages should be placed in `src/pages/` and new components in `src/components/`.
*   **Responsiveness:** All designs must be fully responsive and adapt gracefully to different screen sizes using Tailwind's responsive utilities.
*   **Toasts:** Implement toast notifications for user feedback on important actions or events.