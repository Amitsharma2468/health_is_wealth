import React, { useState } from 'react';

function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
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
                <a href="/signup" className="text-white hover:bg-slate-500 px-3 py-2 rounded-md text-sm font-medium">
                  SignUp
                </a>
                <a href="/login" className="text-white hover:bg-slate-500 px-3 py-2 rounded-md text-sm font-medium">
                  LogIn
                </a>
              </div>
            </div>

            {/* Hamburger menu (Mobile) */}
            <div className="sm:hidden">
              <button
                type="button"
                className="text-white hover:bg-slate-500 px-3 py-2 rounded-md text-sm font-medium"
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
            <a href="/signup" className="block text-white hover:bg-slate-500 px-3 py-2 rounded-md text-sm font-medium">
              SignUp
            </a>
            <a href="/login" className="block text-white hover:bg-slate-500 px-3 py-2 rounded-md text-sm font-medium">
              LogIn
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="bg-slate-500 py-20 px-4 sm:px-6 lg:px-8 text-center flex-grow">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Achieve Your Health Goals</h1>
          <p className="text-lg text-white">Stay motivated with our inspiring quotes and achieve a healthier lifestyle.</p>
        </div>
      </header>

      {/* Motivational Quotes */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex-grow">
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
      <footer className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
