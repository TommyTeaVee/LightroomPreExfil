import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { XMLParser } from "fast-xml-parser";

function Upload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [type, setType] = useState("metadata");
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeXML = (xml) => {
    // Remove the namespaces from the XML
    return xml.replace(/xmlns:.*?=".*?"/g, '').replace(/:[a-zA-Z0-9]+/g, '');
  };

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleTypeChange = (event) => setType(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a file.");
      toast.error("Please upload a file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:35050/extract/preset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract preset.");

      const result = await response.text(); // Get response as plain text
      const sanitizedXML = sanitizeXML(result); // Remove namespaces for easier parsing

      const parser = new XMLParser();
      const parsedData = parser.parse(sanitizedXML); // Parse sanitized XML
      console.log("Parsed Data:", parsedData); // Debug parsed data

      setData(result); // Store raw XML for download
      setError(null);
      toast.success("Preset extracted successfully!");
    } catch (err) {
      setError(err.message);
      setData(null);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (data) {
      const blob = new Blob([data], { type: "application/xml" }); // Create a Blob for the XML data
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); // Create a URL for the Blob
      link.download = "lightroom_preset.xmp"; // Set filename
      link.click(); // Trigger the download
      toast.success("Downloading preset...");
    } else {
      toast.error("No preset data available to download.");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Backdrop */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: 'url(https://www.slrlounge.com/wp-content/uploads/2016/09/adobe-canon-5d-mkIV-lightroom-1600x1068.jpg)' }}
      >
        <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="bg-white text-cyan-700 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg z-10">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Upload Your Image</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-white">Choose an Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-white">Select Data Type</label>
                <select
                  value={type}
                  onChange={handleTypeChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                >
                  <option value="metadata">Full Metadata</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Extract Preset"}
              </button>
            </form>

            {data && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Preset Extraction Complete:</h3>
                <button
                  onClick={handleDownload}
                  className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Download Lightroom Preset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeButton={false} />
    </div>
  );
}

export default Upload;
