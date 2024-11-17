const express = require('express');
const multer = require('multer');
const exif = require('exifreader');
const fs = require('fs');
const { promisify } = require('util');
const cors = require('cors'); // Import cors

const readFile = promisify(fs.readFile);


const app = express();
const upload = multer({ dest: 'uploads/' });
// Enable CORS for all origins
app.use(cors());

app.post('/extract', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = await readFile(filePath);

    const ExifReader = require('exifreader');
    const tags = ExifReader.load(fileBuffer);
    
    // Cleanup uploaded file
    fs.unlink(filePath, () => {});

    res.json(tags);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to extract presets' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
