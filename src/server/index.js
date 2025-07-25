// Import necessary modules
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Basic Setup ---
// Since we are using ES modules, __dirname is not available directly.
// This is the standard way to get the directory name of the current module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express application
const app = express();
const PORT = 3000;

// --- Middleware ---
// This is a crucial piece of middleware. It tells Express to automatically
// parse incoming request bodies that are in JSON format.
// Without this, `req.body` would be undefined.
app.use(express.json());

// --- API Route ---
/**
 * @route   POST /api/savejson
 * @desc    Saves the JSON body of the request to a file named data.json
 * @access  Public
 */
app.post('/api/savejson', (req, res) => {
  console.log('Received request on /api/savejson');
  // The parsed JSON data from the request is available in `req.body`
  const dataToSave = req.body;

  // Check if the request body is empty or not an object
  if (!dataToSave || typeof dataToSave !== 'object' || Object.keys(dataToSave).length === 0) {
    // If no data is sent, return a 400 Bad Request error
    return res.status(400).json({
      success: false,
      message: 'No JSON data provided in the request body.'
    });
  }

  // Define the path where the file will be saved.
  // We'll save it as 'data.json' in the same directory as the script.
  const filePath = path.join(__dirname, 'data.json');

  // Convert the JavaScript object back into a formatted JSON string.
  // The `null, 2` arguments make the saved JSON file human-readable (pretty-printed).
  const jsonString = JSON.stringify(dataToSave, null, 2);

  // Write the string to the file system.
  fs.writeFile(filePath, jsonString, 'utf8', (err) => {
    if (err) {
      // If an error occurs during file writing, log it and send a 500 server error response.
      console.error('Error writing file:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save data to file.'
      });
    }
    // If the file is written successfully, log it and send a success response.
    console.log(`Data successfully saved to ${filePath}`);
    res.status(200).json({
      success: true,
      message: 'Data saved successfully.',
      data: dataToSave
    });
  });
});

// --- Start the Server ---
// Make the app listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Waiting for POST requests to /api/savejson...');
});