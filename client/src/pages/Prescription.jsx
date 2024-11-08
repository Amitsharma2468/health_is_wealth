import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import Navbar from './Navbar';

function Prescription() {
  const location = useLocation();
  const username = Cookies.get("username");
  const [saving, setSaving] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    caption: '',
    prescriptionPicture: null,
  });
  const [prescriptionPictureUrl, setPrescriptionPictureUrl] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/prescriptions/${username}`);
      if (response.data && response.data.prescriptions) {
        setPrescriptions(response.data.prescriptions);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error.message);
    }
  };

  useEffect(() => {
    fetchPrescriptions(); // Fetch prescriptions on initial load
  }, [username]);

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error('Image URL not found in response');
      }
    } catch (error) {
      console.error('Error uploading the image to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    let prescriptionPictureUrl = '';
    if (prescriptionData.prescriptionPicture) {
      try {
        prescriptionPictureUrl = await uploadImageToCloudinary(prescriptionData.prescriptionPicture);
        console.log('Uploaded Image URL:', prescriptionPictureUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        setSaving(false);
        return;
      }
    }

    const data = {
      caption: prescriptionData.caption,
      prescriptionPictureUrl: prescriptionPictureUrl
    };
    console.log('Submitting prescription data:', data);

    try {
      const response = await axios.post(`http://localhost:5000/api/prescription/upload/${username}`, data);
      if (response.status === 200) {
        console.log('Prescription uploaded successfully');
        setPrescriptionData({ caption: '', prescriptionPicture: null });
        fetchPrescriptions();
      }
    } catch (error) {
      console.error('Error uploading prescription:', error.message);
    }
    setSaving(false);
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'prescriptionPicture' && files.length > 0) {
      setPrescriptionData({
        ...prescriptionData,
        prescriptionPicture: files[0]
      });
      setPrescriptionPictureUrl(URL.createObjectURL(files[0])); 
    } else {
      setPrescriptionData({
        ...prescriptionData,
        [name]: value
      });
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar username={username} />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Upload Prescription</h2>
        
        <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
            <input
              type="text"
              id="caption"
              name="caption"
              value={prescriptionData.caption}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="prescriptionPicture" className="block text-sm font-medium text-gray-700">Prescription Image</label>
            <input
              type="file"
              id="prescriptionPicture"
              name="prescriptionPicture"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {prescriptionPictureUrl && (
            <div className="mb-4">
              <img
                src={prescriptionPictureUrl}
                alt="Prescription"
                className="w-32 h-32 object-cover rounded-md mx-auto mb-4"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
          >
            {saving ? 'Saving...' : 'Upload Prescription'}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Prescriptions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => handleImageClick(prescription.prescriptionPicture)}>
                  <img
                    src={prescription.prescriptionPicture}
                    alt={prescription.caption}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <p className="text-sm text-gray-700">{prescription.caption}</p>
                </div>
              ))
            ) : (
              <p>No prescriptions found.</p>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg relative">
              <button className="absolute top-2 right-2 text-gray-700 hover:text-gray-900" onClick={closeModal}>
                &times;
              </button>
              <img src={selectedImage} alt="Full Prescription" className="max-w-full max-h-screen rounded-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prescription;
