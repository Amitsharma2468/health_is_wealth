import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

function Appointment() {
  const location = useLocation();
  const { username } = location.state || {};
  const [doctors, setDoctors] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(response => {
        if (Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        } else {
          console.error('Invalid data format for doctors:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching doctor list:', error);
      });
  }, []);

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

      {/* Doctor List Section */}
      <section className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Available Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200">
                <img src={doctor.link} alt={doctor.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.degree}</p>
                  <p className="text-gray-600">{doctor.hospital}</p>
                  <p className="text-gray-600">{doctor.address}</p>
                  <Link 
                    to={{ pathname: '/payment', state: { username } }} 
                    className="mt-4 inline-block bg-black text-white text-center px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 w-full font-medium"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Appointment;

