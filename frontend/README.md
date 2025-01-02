Collecting workspace information

# OLX Killer Frontend

This repository contains the frontend code for the OLX Killer App, a modern web application built with React, TypeScript, and Tailwind CSS. The frontend interacts with the backend services to provide a seamless user experience for buying and selling products.

## Table of Contents

- Tech Stack
- Project Structure
- Getting Started
   - Prerequisites
   - Installation
   - Running the Development Server
   - Building the Project
   - Linting the Project
- Configuration
- Key Features
- Development Tools
- Dependencies
- License

## Tech Stack

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Vite**: Next-generation frontend tooling for fast builds and hot module replacement.
- **Auth0**: Authentication and authorization platform.
- **i18next**: Internationalization framework for JavaScript.

## Project Structure

```
frontend/
  ├── .env
  ├── .env.example
  ├── .eslintrc.cjs
  ├── .gitignore
  ├── .prettierrc
  ├── components.json
  ├── index.html
  ├── package.json
  ├── postcss.config.js
  ├── tailwind.config.ts
  ├── tsconfig.app.json
  ├── tsconfig.json
  ├── tsconfig.node.json
  ├── vite.config.ts
  ├── src/
  │   ├── app/
  │   │   ├── main.tsx
  │   │   ├── providers.tsx
  │   │   └── styles/
  │   │       └── index.css
  │   ├── entities/
  │   ├── features/
  │   ├── pages/
  │   ├── shared/
  │   │   ├── api/
  │   │   ├── assets/
  │   │   ├── config/
  │   │   ├── constants/
  │   │   ├── library/
  │   │   └── ui/
  │   └── widgets/
  └── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (>= 14.x)
- npm (>= 6.x) or Yarn (>= 1.x)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/itsproutorg/olx-killer-monorepo.git
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

   or

   ```sh
   yarn install
   ```

### Running the Development Server

Start the development server:

```sh
npm run dev
```

or

```sh
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building the Project

Build the project for production:

```sh
npm run build
```

or

```sh
yarn build
```

The built files will be in the `dist` directory.

### Linting the Project

Lint the project:

```sh
npm run lint
```

or

```sh
yarn lint
```

## Configuration

Configuration files are located in the root directory of the

frontend folder:

- `.env`: Environment variables for development.
- `.env.example`: Example environment variables file.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration.

## Key Features

- **Responsive Design**: The application is fully responsive and works on all devices.
- **Authentication**: Secure authentication using Auth0.
- **Internationalization**: Supports multiple languages using i18next.
- **State Management**: Efficient state management using React hooks and context.
- **API Integration**: Seamless integration with backend services using Axios.
- **Component Library**: Reusable UI components built with Tailwind CSS.

## Development Tools

- **ESLint**: Linter for identifying and reporting on patterns in JavaScript.
- **Prettier**: Code formatter for consistent code style.
- **Husky**: Git hooks for running scripts before committing.
- **Lint-Staged**: Run linters on git staged files.
- **PostCSS**: Tool for transforming CSS with JavaScript plugins.

## Dependencies

### Main Dependencies

- **@auth0/auth0-react**: Auth0 SDK for React Single Page Applications (SPA).
- **@chakra-ui/spinner**: Chakra UI Spinner component.
- **@hookform/resolvers**: Validation resolvers for React Hook Form.
- **@radix-ui/react-accordion**: Unstyled, accessible components for building high-quality design systems and web apps.
- **@tanstack/react-query**: Hooks for fetching, caching, and updating asynchronous data in React.
- **axios**: Promise-based HTTP client for the browser and node.js.
- **i18next**: Internationalization framework for JavaScript.
- **react**: A JavaScript library for building user interfaces.
- **react-dom**: Entry point to the DOM and server renderers for React.
- **react-hook-form**: Performant, flexible, and extensible forms with easy-to-use validation.
- **tailwindcss**: Utility-first CSS framework for rapid UI development.
- **vite**: Next-generation frontend tooling.

### Development Dependencies

- **@typescript-eslint/eslint-plugin**: TypeScript plugin for ESLint.
- **@vitejs/plugin-react**: Vite plugin for React.
- **eslint**: Linter for identifying and reporting on patterns in JavaScript.
- **prettier**: Code formatter for consistent code style.
- **tailwindcss**: Utility-first CSS framework for rapid UI development.
- **typescript**: Typed superset of JavaScript that compiles to plain JavaScript.

For a complete list of dependencies, refer to the package.json file.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
