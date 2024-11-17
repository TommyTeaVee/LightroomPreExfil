import React, { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [type, setType] = useState("metadata");

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleTypeChange = (event) => setType(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:3000/extract/${type}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract data.");

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  const handleDownload = () => {
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted-data.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-cyan-400 to-cyan-600 text-white px-4">
      <div className="bg-white text-cyan-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
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
          >
            Extract Data
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {data && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Extracted Data:</h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-cyan-600">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Download JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
