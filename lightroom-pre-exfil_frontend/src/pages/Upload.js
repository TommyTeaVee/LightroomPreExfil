import React, { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [type, setType] = useState("metadata");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleTypeChange = (event) => setType(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:35050/extract/preset`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract preset.");

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (data && data.downloadLink) {
      const link = document.createElement("a");
      link.href = data.downloadLink;
      link.download = "lightroom_preset.xmp";
      link.click();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
      <div className="bg-white text-cyan-700 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Upload Your Image</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Choose an Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Select Data Type</label>
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

        {error && <p className="text-red-500 mt-4">{error}</p>}

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
  );
}

export default Upload;
