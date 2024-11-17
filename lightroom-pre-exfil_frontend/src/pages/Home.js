import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-cyan-300 to-cyan-600 text-white">
      <h1 className="text-5xl font-bold mb-4">
        Welcome to  LightroomPreExfil, a  Preset Extractor made in Node.Js and React-App
      </h1>
      <p className="text-lg mb-8">
        Upload your image files to extract their metadata or summary in just a few clicks.
      </p>
      <Link to="/upload">
      <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-gray-100 transition">
          Get Started
        </button>
      </Link>
    </div>
  );
}

export default Home;
