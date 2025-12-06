# Pokemon Shakespearean Description

## Setup

The project was setup with the following commands:

### React Vite template
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
- npm create vite@latest shakespearean-pkmn -- --template react

### React Vitest
- npm i @testing-library/dom @testing-library/jest-dom @testing-library/react jsdom vitest -D
- npm install --save-dev @testing-library/user-event

### Material UI
- npm install @mui/material @emotion/react @emotion/styled
- npm install @mui/icons-material

### TanStack Query
- npm i @tanstack/react-query 


## Running locally

- npm run dev

## Testing

### Running Vitest Unit Tests
- npm run test

## Deploying (Github Pages)

Install github pages package
- npm install --save-dev gh-pages

Added repo name inside vite.config

Run the following commands to deploy:
- npm run predeploy
- npm run deploy

Once deployed, application is accessible through: 
https://andrewker.github.io/shakespearean-pkmn/
