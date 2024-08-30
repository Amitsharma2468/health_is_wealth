import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Homes() {
  const location = useLocation();
  const { username } = location.state || {}; // Add a fallback for username in case location.state is null or undefined
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
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
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMobileMenu}
              >
                Menu
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-gray-700">
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

      {/* Hero Section */}
      <header className="bg-gray-600 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Achieve Your Health Goals</h1>
          <p className="text-lg text-white">Stay motivated with our inspiring quotes and achieve a healthier lifestyle.</p>
        </div>
      </header>

      {/* Motivational Quotes */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Health Motivational Quotes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-lg text-gray-700">"Your health is your wealth."</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-lg text-gray-700">"Take care of your body. It's the only place you have to live."</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-lg text-gray-700">"Fitness is not about being better than someone else. It's about being better than you used to be."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-4 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Homes;
