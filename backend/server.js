const express = require('express');
const multer = require('multer');
const exif = require('exifreader');
const fs = require('fs');
const { promisify } = require('util');
const cors = require('cors'); // Import cors

const readFile = promisify(fs.readFile);

const app = express();
// Enable CORS for all origins
app.use(cors());

// Multer configuration to accept additional raw image formats
const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg", // Standard JPEG
        "image/png", // Standard PNG
        "image/gif", // GIFs
        "image/tiff", // TIFF files
        "image/x-canon-cr2", // Canon RAW CR2
        "image/x-canon-cr3", // Canon RAW CR3
        "image/x-nikon-nef", // Nikon RAW NEF
        "image/x-sony-arw", // Sony RAW ARW
      ];
  
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only supported image types are allowed!"), false);
      }
    },
  });



// Route to handle file upload and metadata extraction
app.post("/extract", upload.single("file"), async (req, res) => {
    try {
      const filePath = req.file.path;
      const fileBuffer = await readFile(filePath);
  
      // Extract metadata using ExifReader
      const ExifReader = require("exifreader");
      const tags = ExifReader.load(fileBuffer);
  
      // Cleanup the uploaded file
      fs.unlink(filePath, () => {});
  
      res.json(tags);
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: "Failed to process image file" });
    }
  });
  
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );