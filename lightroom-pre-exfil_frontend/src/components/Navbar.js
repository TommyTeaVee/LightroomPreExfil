import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-cyan-800 text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link to="/">Lighroom-PreExfill</Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
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

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} mt-4`}
      >
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="block text-white hover:text-cyan-300 transition duration-300"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="block text-white hover:text-cyan-300 transition duration-300"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
            >
              Upload
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
