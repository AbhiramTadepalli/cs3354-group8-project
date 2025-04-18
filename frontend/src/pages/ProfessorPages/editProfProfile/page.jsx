import React, { useState, useEffect } from "react";
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get professor ID and user ID from navigation state
  const [professorId, setProfessorId] = useState(
    location.state?.professorId || null
  );
  const [userId, setUserId] = useState(
    location.state?.userId || null
  );

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    department: '',
    password: '',
    net_id: ''
  });

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
        })
        .catch(err => console.error("Failed to load professor data:", err));
    } else {
      // We have professor ID, fetch specific professor data
      fetch(`http://localhost:5002/GET/Professor/all`)
        .then(res => res.json())
        .then(data => {
          const prof = data.find(p => p.professor_id === professorId) || data[1];
          loadProfessorData(prof);
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
      password: prof.password || '',
      net_id: prof.net_id
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5002/POST/Professor/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor_id: professorId,
          user_id: userId,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        navigate('../viewProfProfile');
      } else {
        alert("Profile update failed: " + data.error);
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
          <div className="w-64 h-64 bg-gray-300 rounded-2xl"></div>
          <button className="mt-4 px-6 py-2 bg-orange-300 rounded-full text-black text-2xl font-normal">
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
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl"
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl"
            />
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
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl"
              placeholder="@utdallas.edu"
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Phone Number:</label>
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl"
            >
              <option>Computer Science</option>
              <option>Software Engineering</option>
              <option>Electrical Engineering</option>
              <option>Mathematics</option>
            </select>
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