import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <nav className="bg-cyan-800 text-white py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">JPEG Preset Extractor</h1>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className="hover:text-cyan-300 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="hover:text-cyan-300 transition duration-300"
                >
                  Upload
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Layout */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <aside className="w-1/4 bg-cyan-700 text-white p-4 sticky top-0 h-screen">
            <h2 className="text-2xl font-bold mb-4">App Summary</h2>
            <p className="text-sm">
              The JPEG Preset Extractor allows you to analyze image files and
              extract valuable metadata or summaries. Supported file types
              include JPEG, PNG, and RAW formats from popular cameras like
              Canon and Nikon.
            </p>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </main>

          {/* Right Sidebar */}
          <aside className="w-1/4 bg-cyan-700 text-white p-4 sticky top-0 h-screen">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <ul className="list-disc ml-6 text-sm">
              <li>Navigate to the Upload page.</li>
              <li>Select an image file to upload.</li>
              <li>Choose the type of data to extract (e.g., metadata or summary).</li>
              <li>Click "Extract Data" to process the image.</li>
              <li>Download the extracted data in JSON format.</li>
            </ul>
          </aside>
        </div>
      </div>
    </Router>
  );
}

export default App;
