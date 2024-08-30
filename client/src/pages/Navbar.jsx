import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ username }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-white text-lg font-semibold">LIFE CYCLE</span>
          </div>

          {/* Navbar links (Desktop) */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              <Link to={{ pathname: '/profiles', state: { username } }} className="text-white hover:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
              <Link to={{ pathname: '/appointment', state: { username } }} className="text-white hover:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                Appointment
              </Link>
              <span className="text-white px-3 py-2 rounded-md text-sm font-medium">
                {username}
              </span>
            </div>
          </div>

          {/* Hamburger menu (Mobile) */}
          <div className="sm:hidden">
            <button
              type="button"
              className="text-white hover:bg-black px-3 py-2 rounded-md text-sm font-medium"
              onClick={toggleMobileMenu}
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-black">
          <Link to={{ pathname: '/profiles', state: { username } }} className="block text-white hover:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium">
            Profile
          </Link>
          <Link to={{ pathname: '/appointment', state: { username } }} className="block text-white hover:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium">
            Appointment
          </Link>
          <span className="block text-white px-3 py-2 rounded-md text-sm font-medium">
            {username}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
