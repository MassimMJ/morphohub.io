# Morpho Hub

A web platform for sharing and analyzing morphological data.

## Setup and Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
morphohub/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   └── [model images]
│   └── index.html
├── server.js
├── package.json
└── README.md
```

## Features

- Browse 3D models with metadata
- Download models and associated Darwin Core data
- Purchase simulated services
- User account management
- Track downloads and purchases

## Local Storage

The application uses browser's localStorage to persist:
- User account information
- Download history
- Purchase history

## Adding New Models

To add new models manually:
1. Add model images to `/public/images/`
2. Update the `mockModels` array in `server.js`

## Development

This is a mock implementation with simulated functionality. In a production environment, you would need to:
1. Implement proper authentication
2. Add a real database
3. Implement actual file uploads and downloads
4. Add real payment processing
