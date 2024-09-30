# OLX Killer App

## Overview
This project aims to build a marketplace platform similar to [OLX](https://olx.ua) with a key difference: strict filtering and verification processes to eliminate realtors, resellers, and other intermediaries. The platform is designed to ensure that all listings are genuine and directly from individual sellers.

## Tech Stack
- **React + Vite**: For building the user interface and optimizing the development workflow.
- **Tailwind CSS**: For styling the application with utility-first CSS.
- **Shadcn/ui**: For utilizing pre-built UI components.
- **React Router DOM**: For client-side routing.
- **Auth0**: For handling user authentication and authorization.
- **TanStack Query**: For managing server-state and data-fetching.
- **Zustand/Context/LocalStorage**: For state management.
- **i18next**: For internationalization support.

## Project Structure
The project follows a combination of Feature-Sliced Design (FSD), Domain-Driven Design (DDD), and Atomic Design principles to ensure scalability, maintainability, and a clear separation of concerns.

### src Directory Layout
```plaintext
src/
├── api/
│   └── axios.ts
├── app/
│   ├── providers.tsx
│   └── routes.tsx
├── assets/
│   └── react.svg
├── components/
│   ├── Footer/
│   ├── Header/
│   └── ui/
├── constants/
│   └── page.const.ts
├── data/
│   └── links.data.ts
├── helpers/
│   └── api.helpers.ts
├── hooks/
│   └── .gitkeep
├── layouts/
│   └── root-layout.tsx
├── lib/
│   └── cn-merge.ts
├── pages/
│   ├── Home/
│   └── Profile/
├── services/
│   └── category/
│       └── category.service.ts
├── types/
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Setup and Installation
To get started with the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/zim89/okiller-client.git
    cd okiller-client
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the development server**:
    ```bash
    npm run dev
    ```

## Features
- **User Authentication**: Secure login and registration with Auth0.
- **Responsive Design**: Fully responsive design with Tailwind CSS.
- **Product Listings**: Browse and search for products with detailed filters.
- **Profile Management**: User profiles to manage listings and account settings.
- **Strict Verification**: Robust verification system to ensure all listings are genuine and from individual sellers.

## Contact
For any questions or feedback, please reach out to us at [email@example.com](mailto:email@example.com).

---

We are committed to building a secure and reliable marketplace platform. Thank you for your interest and support!
