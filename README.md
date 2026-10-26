
# Celebrare Photo Gallery

A simple photo gallery built with React, Vite and Tailwind CSS as part of the Celebrare Frontend React Internship pre-screening assignment.

The application loads photos from the Picsum Photos API and displays them in a responsive grid. Users can search for photographers by name and mark photos as favourites.

## Features

- Fetches 30 photos from the Picsum Photos API.
- Displays a loading indicator while photos are being fetched.
- Shows an error message if the request fails.
- Provides a responsive gallery for mobile, tablet and desktop screens.
- Filters photos by author name as the user types.
- Allows users to add and remove favourites using heart buttons.
- Saves favourites in localStorage so they remain after refreshing the page.

## Technologies Used

- React
- Vite
- Tailwind CSS
- JavaScript
- Picsum Photos API
- Browser localStorage

## Getting Started

Make sure Node.js and npm are installed on your computer.

Clone this repository and open the project directory in your terminal.

Install the required packages:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in your terminal to view the application.

## Available Commands

- `npm run dev` — starts the development server.
- `npm run lint` — checks the code using ESLint.
- `npm run build` — creates a production build.

## API

This project uses the following endpoint to retrieve photo records:

https://picsum.photos/v2/list?limit=30

## Project Structure

```text
src/
├── components/
│   └── Gallery.jsx
├── hooks/
│   └── useFetchPhotos.js
├── App.jsx
├── index.css
└── main.jsx
```

## Assignment

Created for the Celebrare Frontend React Internship pre-screening assignment.
