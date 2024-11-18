const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const xmlbuilder = require("xmlbuilder");
const cors = require("cors");
const uuid = require("uuid");

const app = express();
const port = 35050;

// Enable CORS
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Function to create the XMP preset XML matching the given standard
const createLightroomXMP = (presetName, presetData) => {
  // Generate a unique UUID for the preset (you can also use a custom UUID generation strategy)
  const uuidValue = uuid.v4();

  // Create the XMP document with the specified structure
  const xmp = xmlbuilder.create("x:xmpmeta", { version: "1.0", encoding: "UTF-8" })
    .att("xmlns:x", "adobe:ns:meta/")
    .att("x:xmptk", "Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21");

  // Add RDF structure
  const rdf = xmp.ele("rdf:RDF", { "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#" })
    .ele("rdf:Description", {
      "rdf:about": "",
      "xmlns:crs": "http://ns.adobe.com/camera-raw-settings/1.0/",
      "crs:PresetType": "Normal",
      "crs:Cluster": "",
      "crs:UUID": uuidValue,
      "crs:SupportsAmount": "False",
      "crs:SupportsColor": "True",
      "crs:SupportsMonochrome": "True",
      "crs:SupportsHighDynamicRange": "True",
      "crs:SupportsNormalDynamicRange": "True",
      "crs:SupportsSceneReferred": "True",
      "crs:SupportsOutputReferred": "True",
      "crs:Version": "11.1",
      "crs:ProcessVersion": "10.0",
      "crs:Saturation": presetData.saturation || "0",
      "crs:Sharpness": presetData.sharpness || "0",
      "crs:LuminanceSmoothing": presetData.luminanceSmoothing || "0",
      "crs:ColorNoiseReduction": presetData.colorNoiseReduction || "0",
      "crs:VignetteAmount": presetData.vignetteAmount || "0",
      // Include all the other attributes here based on the data you want to extract or input
    });

  // Add preset name
  rdf.ele("crs:Name")
    .ele("rdf:Alt")
    .ele("rdf:li", { "xml:lang": "x-default" }, presetName);

  // Add other necessary attributes as per your requirement
  rdf.ele("crs:ToneCurvePV2012")
    .ele("rdf:Seq")
    .ele("rdf:li", "0, 0")
    .ele("rdf:li", "59, 48")
    .ele("rdf:li", "122, 119")
    .ele("rdf:li", "181, 184")
    .ele("rdf:li", "255, 255");

  // Finalize XML document
  xmp.ele("?xpacket", { "begin": "" });

  return xmp.end({ pretty: true });
};

// API to extract and create Lightroom XMP preset
app.post("/extract/preset", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Sample data to represent the extracted preset info, adjust according to your actual data
  const extractedData = {
    name: "01_Portrait_Contrast",
    saturation: "0",
    sharpness: "10",
    luminanceSmoothing: "0",
    colorNoiseReduction: "0",
    vignetteAmount: "0",
    // Add more values based on metadata or inputs
  };

  // Generate XMP data using the extracted information
  const xmpData = createLightroomXMP(extractedData.name, extractedData);

  // Save the generated XMP data to a file
  const filePath = path.join(__dirname, "presets", `${req.file.filename}.xmp`);
  fs.writeFileSync(filePath, xmpData);

  // Respond with the download link for the XMP file
  res.json({
    message: "Preset extracted successfully",
    downloadLink: `http://localhost:35050/presets/${req.file.filename}.xmp`,
  });
});

// Serve XMP preset files for download
app.use("/presets", express.static(path.join(__dirname, "presets")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
    