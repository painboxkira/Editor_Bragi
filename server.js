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

// Ensure a directory exists for storing scenario JSON files
const scenariosDir = path.join(__dirname, 'scenarios');
if (!fs.existsSync(scenariosDir)) {
  fs.mkdirSync(scenariosDir, { recursive: true });
}

/**
 * @route   GET /api/scenarios
 * @desc    Returns a list of all saved scenario JSON files
 */
app.get('/api/scenarios', (req, res) => {
  fs.readdir(scenariosDir, (err, files) => {
    if (err) {
      console.error('Error reading scenarios directory:', err);
      return res.status(500).json({ success: false, message: 'Failed to list scenarios.' });
    }
    const scenarios = files
      .filter((f) => f.endsWith('.json'))
      .map((file) => {
        try {
          const content = fs.readFileSync(path.join(scenariosDir, file), 'utf8');
          return JSON.parse(content);
        } catch (e) {
          console.error('Error parsing scenario file', file, e);
          return null;
        }
      })
      .filter((s) => s !== null);
    res.json({ success: true, data: scenarios });
  });
});

app.post('/api/savejson', (req, res) => {
  console.log('Received request on /api/savejson');
  const dataToSave = req.body;

  if (!dataToSave || typeof dataToSave !== 'object' || Object.keys(dataToSave).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No JSON data provided in the request body.'
    });
  }

  // Save each scenario as its own JSON file by ID
  const filePath = path.join(scenariosDir, `${dataToSave.id}.json`);
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
