import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Cookies from "js-cookie";

function Profiles() {
  const location = useLocation();
  const username = Cookies.get("username");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    habits: '',
    age: '',
    bloodGroup: '',
    birthdate: ''
  });

  useEffect(() => {

    fetchProfileData(username);
  }, [username]);

  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${username}`);

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data.profile); // Assuming data is { profile: { habits, age, bloodGroup, birthdate } }
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      habits: profileData.habits,
      age: profileData.age,
      bloodGroup: profileData.bloodGroup,
      birthdate: profileData.birthdate
    };
    
    try {
      console.log(formData);
      const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-white text-lg font-semibold">LIFE CYCLE</span>
            </div>

            {/* Navbar links (Desktop) */}
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                <Link to={{ pathname: '/profiles', state: { username } }} className="text-white hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                <Link to={{ pathname: '/appointment', state: { username } }} className="text-white hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium">
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
                className="text-white hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMobileMenu}
              >
                Menu
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-green-600">
            <Link to={{ pathname: '/profiles', state: { username } }} className="block text-white hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium">
              Profile
            </Link>
            <Link to={{ pathname: '/appointment', state: { username } }} className="block text-white hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium">
              Appointment
            </Link>
            <span className="block text-white px-3 py-2 rounded-md text-sm font-medium">
              {username}
            </span>
          </div>
        )}
      </nav>

      {/* Profile Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white overflow-hidden shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {/* Habits */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Habits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <input
                    type="text"
                    name="habits"
                    id="habits"
                    value={profileData.habits}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </dd>
              </div>

              {/* Age */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={profileData.age}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </dd>
              </div>

              {/* Blood Group */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <input
                    type="text"
                    name="bloodGroup"
                    id="bloodGroup"
                    value={profileData.bloodGroup}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </dd>
              </div>

              {/* Birthdate */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Birthdate</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <input
                    type="date"
                    name="birthdate"
                    id="birthdate"
                    value={profileData.birthdate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={handleFormSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-500 py-4 mt-auto fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Profiles;

