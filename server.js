import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Add CORS middleware before other routes/middleware
app.use(cors());
app.use(express.json());

app.post('/api/savejson', (req, res) => {
  console.log('Received request on /api/savejson');
  const dataToSave = req.body;

  if (!dataToSave || typeof dataToSave !== 'object' || Object.keys(dataToSave).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No JSON data provided in the request body.'
    });
  }

  const filePath = path.join(__dirname, 'data.json');
  const jsonString = JSON.stringify(dataToSave, null, 2);

  fs.writeFile(filePath, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save data to file.'
      });
    }
    console.log(`Data successfully saved to ${filePath}`);
    res.status(200).json({
      success: true,
      message: 'Data saved successfully.',
      data: dataToSave
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Waiting for POST requests to /api/savejson...');
});