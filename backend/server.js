const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const app = express();

// Enable CORS
app.use(cors());

// Multer configuration to accept various image types
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/tiff",
      "image/x-canon-cr2",
      "image/x-canon-cr3",
      "image/x-nikon-nef",
      "image/x-sony-arw",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only supported image types are allowed!"), false);
    }
  },
});

// Route to handle file upload and extraction
app.post("/extract/:type", upload.single("file"), async (req, res) => {
  try {
    const { type } = req.params; // Get the dynamic URL parameter
    const filePath = req.file.path;
    const fileBuffer = await readFile(filePath);

    // Extract metadata using ExifReader
    const ExifReader = require("exifreader");
    const tags = ExifReader.load(fileBuffer);

    // Cleanup the uploaded file
    fs.unlink(filePath, () => {});

    // Example: Customize the response based on the `type` parameter
    if (type === "metadata") {
      return res.json(tags);
    } else if (type === "summary") {
      return res.json({
        summary: {
          camera: tags["Make"]?.description || "Unknown",
          model: tags["Model"]?.description || "Unknown",
          date: tags["DateTime"]?.description || "Unknown",
        },
      });
    } else {
      return res.status(400).json({ error: `Unsupported type: ${type}` });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Failed to process image file" });
  }
});

// Start server
const PORT = process.env.PORT || 35050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
