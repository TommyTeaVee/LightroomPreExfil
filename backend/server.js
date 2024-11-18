const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const xmlbuilder = require("xmlbuilder");
const cors = require("cors");
const app = express();
const port = 35050;

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/extract/preset", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Extract metadata using sharp
    const metadata = await sharp(filePath).metadata();
    
    const cameraModel = metadata.exif
      ? "CameraModel" in metadata.exif
        ? metadata.exif.CameraModel
        : "Unknown"
      : "Unknown";
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Build the XMP file structure
    const xml = xmlbuilder
      .create("x:xmpmeta", { version: "1.0", encoding: "UTF-8" })
      .att("xmlns:x", "adobe:ns:meta/")
      .att("x:xmptk", "Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21")
      .ele("rdf:RDF", {
        "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      })
      .ele("rdf:Description", {
        "rdf:about": "",
        "xmlns:crs": "http://ns.adobe.com/camera-raw-settings/1.0/",
        "crs:PresetType": "Normal",
        "crs:UUID": generateUUID(),
        "crs:CameraModelRestriction": cameraModel,
        "crs:Version": "11.1",
        "crs:ProcessVersion": "10.0",
        "crs:Saturation": "0",
        "crs:Sharpness": "0",
        "crs:LuminanceSmoothing": "0",
        "crs:ColorNoiseReduction": "0",
        "crs:VignetteAmount": "0",
        "crs:Width": width,
        "crs:Height": height,
      })
      .ele("crs:Name")
      .ele("rdf:Alt")
      .ele("rdf:li", { "xml:lang": "x-default" }, "Preset for " + cameraModel)
      .up()
      .up()
      .up()
      .end({ pretty: true });

    // Respond with the generated XML
    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lightroom_preset.xmp"
    );
    res.send(xml);

    // Clean up uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while processing the image." });
  }
});

// Helper function to generate a unique UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
