import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import Navbar from './Navbar'; // Import the Navbar component
import axios from 'axios';

function Profiles() {
  const location = useLocation();
  const username = Cookies.get("username");
  const [saving, setSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    habits: '',
    age: '',
    bloodGroup: '',
    birthdate: '',
    profilePicture: null
  });
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

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
      setProfileData(data.profile);
      if (data.profile.profilePicture) {
        setProfilePictureUrl(data.profile.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // Use environment variable

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, // Use environment variable
        formData
      );
      return response.data.secure_url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading the image to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    
    let profilePictureUrl = profileData.profilePictureUrl;
    
    // Upload the image to Cloudinary if a new image is selected
    if (profileData.profilePicture) {
      try {
        profilePictureUrl = await uploadImageToCloudinary(profileData.profilePicture);
        window.alert(profilePictureUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        return; // Exit the function if the image upload fails
      }
    }
    
    // Create a form data object for profile data
    const formData = new FormData();
    formData.append('habits', profileData.habits);
    formData.append('age', profileData.age);
    formData.append('bloodGroup', profileData.bloodGroup);
    formData.append('birthdate', profileData.birthdate);
    formData.append('profilePictureUrl', profilePictureUrl);
    
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      console.log('Profile updated successfully');
      fetchProfileData(username); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
    setSaving(false);
  };
  
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'profilePicture' && files.length > 0) {
      setProfileData({
        ...profileData,
        profilePicture: files[0]
      });
      setProfilePictureUrl(URL.createObjectURL(files[0])); // Show the new picture immediately
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar username={username} /> {/* Use the Navbar component */}

      {/* Profile Form */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Profile Information</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="habits" className="block text-sm font-medium text-gray-700">Habits</label>
            <input type="text" id="habits" name="habits" value={profileData.habits} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" id="age" name="age" value={profileData.age} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
            <input type="text" id="bloodGroup" name="bloodGroup" value={profileData.bloodGroup} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
            <input type="date" id="birthdate" name="birthdate" value={profileData.birthdate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>
          {profilePictureUrl && (
            <div className="mb-4">
              <img src={profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full" />
            </div>
          )}
          <button type="submit" disabled={saving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save</button>
        </form>
      </div>
    </div>
  );
}

export default Profiles;
