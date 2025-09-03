# FoodShare Community - Client Side

This is the client-side application for the FoodShare Community platform, built with React. It provides a user-friendly interface for browsing, adding, managing, and requesting surplus food items.

**Live Site Link: [Netlify Live Site](https://food-share-hub.netlify.app/)**

---

## Project Overview

FoodShare Community is a full-stack MERN platform designed to connect communities by enabling users to share surplus food, reducing waste and helping those in need. This client-side application handles all user interactions, from authentication to managing food listings and requests, offering a seamless and dynamic user experience.

## Key Features

-   **User Authentication**: Secure user registration and login system using Firebase for both email/password and Google social login.
-   **Dynamic Food Listings**: Users can view all available food items, with options to search by name and sort by expiration date.
-   **Interactive UI**: The "Available Foods" page features a layout toggle button, allowing users to switch between a 3-column and 2-column grid view.
-   **CRUD Operations for Food**: Authenticated users can Add, View, Update, and Delete their own food listings through dedicated private routes.
-   **Food Request System**: Users can request an available food item, which opens a modal with pre-filled information and updates the food's status upon confirmation.
-   **Personalized Dashboards**: Private pages for "Manage My Foods" and "My Food Requests" allow users to easily track their activities on the platform.
-   **Secure & Responsive**: The application is fully responsive for mobile, tablet, and desktop. Private routes are protected using JSON Web Tokens (JWT) to ensure data security.
-   **Engaging Animations**: The UI is enhanced with subtle animations using Framer Motion to improve the user experience.

## Technologies & Packages Used

-   **Core**: React, Vite
-   **Styling**: Tailwind CSS, DaisyUI
-   **Routing**: React Router
-   **Data Fetching & State Management**: TanStack Query (React Query)
-   **HTTP Client**: Axios
-   **Authentication**: Firebase
-   **UI/UX**:
    -   Framer Motion (for animations)
    -   Sweetalert (for notifications)
-   **Hosted on**: Netlify

## Environment Variables

To run this project locally, you need to create a `.env.local` file in the root of the client folder with the following variables:

#### Firebase Configuration

```
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage
VITE_messagingSenderId=your_firebase_sender_id
VITE_appId=your_firebase_app_id
```
> **Note**: This file should be added to your `.gitignore` to prevent leaking sensitive keys.

## Getting Started

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/mottasimsadi/food-share-client
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd food-share-client
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Create your `.env.local` file** and add your Firebase and API configurations as shown above.
5.  **Run the development server:**
    ```sh
    npm run dev
    ```
The application will be available at `http://localhost:5173`.
