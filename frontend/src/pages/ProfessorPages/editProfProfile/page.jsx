import React, { useState, useEffect, useRef } from "react";
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // Get professor ID and user ID from navigation state
  const [professorId, setProfessorId] = useState(
    location.state?.professorId || null
  );
  const [userId, setUserId] = useState(
    location.state?.userId || null
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    department: "",
    net_id: ""
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If we don't have a professor ID from navigation state, fetch the first professor
    if (!professorId) {
      fetch(`http://localhost:5002/GET/Professor/all`)
        .then(res => res.json())
        .then(data => {
          const prof = data[1]; // Using index 1 to match ViewProfProfile
          setProfessorId(prof.professor_id);
          setUserId(prof.user_id);
          loadProfessorData(prof);
          
          // Try to load profile photo from local storage
          const storedPhoto = localStorage.getItem(`profPhoto_${prof.professor_id}`);
          if (storedPhoto) {
            setPhotoPreview(storedPhoto);
          }
        })
        .catch(err => console.error("Failed to load professor data:", err));
    } else {
      // We have professor ID, fetch specific professor data
      fetch(`http://localhost:5002/GET/Professor/all`)
        .then(res => res.json())
        .then(data => {
          const prof = data.find(p => p.professor_id === professorId) || data[1];
          loadProfessorData(prof);
          
          // Try to load profile photo from local storage
          const storedPhoto = localStorage.getItem(`profPhoto_${prof.professor_id}`);
          if (storedPhoto) {
            setPhotoPreview(storedPhoto);
          }
        })
        .catch(err => console.error("Failed to load professor data:", err));
    }
  }, [professorId]);

  const loadProfessorData = (prof) => {
    setFormData({
      first_name: prof.first_name,
      last_name: prof.last_name,
      email: prof.email,
      phone_no: prof.phone_no,
      department: prof.department,
      net_id: prof.net_id
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'phone_no', 'department'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate UTD email domain
    if (formData.email && !formData.email.toLowerCase().endsWith('@utdallas.edu')) {
      newErrors.email = 'Email must be a UTDallas email';
    }
    
    // Validate phone number format
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (formData.phone_no && !phoneRegex.test(formData.phone_no)) {
      newErrors.phone_no = 'Phone format must be (XXX) XXX-XXXX';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate form data
    if (!validateForm()) {
      alert("Error: Please fix the validation errors");
      return;
    }

    try {
      // Save photo to local storage if available
      let photoUpdated = false;
      if (photoPreview) {
        localStorage.setItem(`profPhoto_${professorId}`, photoPreview);
        photoUpdated = true;
      }
  
      // Prepare the request body (no password included)
      const requestBody = {
        professor_id: professorId,
        user_id: userId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_no: formData.phone_no,
        department: formData.department,
        net_id: formData.net_id,
      };
  
      const response = await fetch('http://localhost:5002/POST/Professor/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        if (photoUpdated) {
          alert("Profile and photo updated successfully!");
        } else {
          alert("Profile updated successfully!");
        }
        navigate('../viewProfProfile');
      } else {
        alert("Profile update failed: " + responseData.error);
      }
    } catch (err) {
      console.error(err);
      alert("Profile update failed: " + err.message);
    }
  };  

  return (
    <div className="w-screen h-screen bg-red-50 p-8">
      <NavBarProfessor/>

      <div className="text-4xl font-bold font-normal">Edit Profile</div>
      <div className="w-full border-t border-black my-6"></div>

      <div className="flex items-center space-x-12 px-32">
        <div className="flex flex-col items-center justify-start">
          <div 
            className="w-64 h-64 bg-gray-300 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
            onClick={handlePhotoClick}
          >
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No Photo</span>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          <button 
            className="mt-4 px-6 py-2 bg-orange-300 rounded-full text-black text-2xl font-normal"
            onClick={handlePhotoClick}
          >
            Edit Profile Photo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10 flex-grow -mt-11">
          <div>
            <label className="text-2xl font-normal">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full h-10 bg-gray-300 rounded px-2 text-xl ${errors.first_name ? 'border-2 border-red-500' : ''}`}
            />
            {errors.first_name && <p className="text-red-500">{errors.first_name}</p>}
          </div>
          <div>
            <label className="text-2xl font-normal">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full h-10 bg-gray-300 rounded px-2 text-xl ${errors.last_name ? 'border-2 border-red-500' : ''}`}
            />
            {errors.last_name && <p className="text-red-500">{errors.last_name}</p>}
          </div>
          <div>
            <label className="text-2xl font-normal">Employee ID:</label>
            <input
              type="text"
              value={formData.net_id}
              readOnly
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl"
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-10 bg-gray-300 rounded px-2 text-xl ${errors.email ? 'border-2 border-red-500' : ''}`}
              placeholder="@utdallas.edu"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="text-2xl font-normal">Phone Number:</label>
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              className={`w-full h-10 bg-gray-300 rounded px-2 text-xl ${errors.phone_no ? 'border-2 border-red-500' : ''}`}
              placeholder="(XXX) XXX-XXXX"
            />
            {errors.phone_no && <p className="text-red-500">{errors.phone_no}</p>}
          </div>
          <div>
            <label className="text-2xl font-normal">Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full h-10 bg-gray-300 rounded px-2 text-xl ${errors.department ? 'border-2 border-red-500' : ''}`}
            />
            {errors.department && <p className="text-red-500">{errors.department}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-10">
        <button
          onClick={() => navigate('../viewProfProfile')}
          className="px-8 py-3 bg-gray-300 rounded text-xl font-normal"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-orange-300 rounded text-xl font-normal"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfProfile;