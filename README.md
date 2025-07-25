# Project Bragi

Project Bragi is a web-based interactive story and scene editor, allowing authors to create, save, and visually edit narrative scenarios.

## Features
- Create and save new scenarios via a JSON-based REST API
- Edit scenario details in a dedicated scene editor interface (WIP)
- Built with React, Vite, Tailwind CSS, Express, and Three.js

## Prerequisites
- Node.js (>= 14.x)
- npm (>= 6.x)

## Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd editor-braggi
npm install
```

## Running the Application
Start the backend server (for saving scenarios):
```bash
npm run start:server
```
In a separate terminal, start the frontend development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to access the app.

## Building for Production
```bash
npm run build
npm run preview
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
