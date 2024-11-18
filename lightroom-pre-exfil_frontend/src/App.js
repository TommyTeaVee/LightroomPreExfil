import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      
<Navbar></Navbar>
        {/* Main Layout */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <aside className="w-1/4 bg-cyan-700 text-white p-4 sticky top-0 h-screen">
            <h2 className="text-2xl font-bold mb-4">App Summary</h2>
            <p className="text-sm">
              The Lighroom-Pre-Exfill allows you to analyze image files and
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
   
    </Router>
  );
}

export default App;
