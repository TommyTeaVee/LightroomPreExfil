import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className=" backdrop-grayscale-0 bg-white/30 h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('https://www.slrlounge.com/wp-content/uploads/2016/09/adobe-canon-5d-mkIV-lightroom-1600x1068.jpg')` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-cyan-700/60 mix-blend-multiply"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to Lighroom-Pre-Exfill</h1>
        <p className="text-lg mb-8">
          Upload your image files to extract their metadata or summary in just a few clicks.
        </p>
        <Link to="/upload">
          <button className="bg-white text-cyan-700 font-bold py-2 px-4 rounded hover:bg-gray-100 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
