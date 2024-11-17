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

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 text-white">
      <div className="bg-white text-blue-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Extract Data
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {data && (
          <div className="bg-gray-100 p-4 mt-4 rounded text-blue-600">
            <h3 className="text-lg font-bold mb-2">Extracted Data:</h3>
            <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
