import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarStudent from '../../../Components/NavBarStudent';

const EditStudentProfile = () => {
  const navigate = useNavigate();
  
  // State for form fields & profile image
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    studentId: '123456789',
    major: 'Computer Science',
    year: 'Senior',
    email: 'johndoe@utdallas.edu',
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    console.log('Updated Profile:', formData);
    navigate('../viewStudentProfile');
  };

  return (
    <div className="w-screen h-screen bg-red-50 p-8">
      <NavBarStudent />

      <div className="text-4xl font-bold">Edit Profile</div>
      <div className="w-full border-t border-black my-6"></div>

      <div className="flex items-center space-x-12 px-32">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-300 rounded-2xl flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-xl">No Image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="profileImageInput"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={() => document.getElementById('profileImageInput').click()}
            className="mt-4 px-6 py-2 bg-orange-300 rounded-full text-black text-2xl"
          >
            Edit Profile Photo
          </button>
        </div>

        {/* Editable Profile Fields */}
        <div className="grid grid-cols-2 gap-10 flex-grow">
          <div>
            <label className="text-2xl">First Name:</label>
            <input 
              type="text" 
              name="firstName" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={formData.firstName} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="text-2xl">Last Name:</label>
            <input 
              type="text" 
              name="lastName" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={formData.lastName} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="text-2xl">Student ID:</label>
            <input type="text" name="studentId" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={formData.studentId} readOnly />
          </div>
          <div>
            <label className="text-2xl">Major:</label>
            <select 
              name="major" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={formData.major} 
              onChange={handleChange}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Business Administration">Business Administration</option>
            </select>
          </div>
          <div>
            <label className="text-2xl">Year:</label>
            <select 
              name="year" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={formData.year} 
              onChange={handleChange}
            >
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="text-2xl">Email:</label>
            <input type="email" name="email" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={formData.email} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-10">
        <button onClick={handleSubmit} className="px-8 py-3 bg-orange-300 rounded text-xl">
          Save Changes
        </button>
        <button onClick={() => navigate('../viewStudentProfile')} className="px-8 py-3 bg-gray-300 rounded text-xl">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditStudentProfile;