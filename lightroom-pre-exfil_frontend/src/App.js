import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <header className="w-full bg-cyan-500 text-white p-4">
          <nav className="flex justify-center space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/upload" className="hover:underline">Upload</Link>
          </nav>
        </header>

        <main className="flex-grow w-full max-w-4xl p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>

        <footer className="w-full bg-gray-800 text-white text-center py-2">
          <p>© 2024  LightroomPreExfil</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
