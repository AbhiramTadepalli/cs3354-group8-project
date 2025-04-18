import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarProfessor from "../../../Components/NavBarProfessor";

const ViewProfProfile = () => {
  const navigate = useNavigate(); 
  const [professor, setProfessor] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // For testing, send a request with professor_id in the body
    fetch('http://localhost:5002/GET/Professor/all')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch professor data');
        return res.json();
      })
      .then(data => {
        setProfessor(data[1]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching professor:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleEditProfile = () => {
    // Navigate to edit profile page with professor and user IDs
    navigate('../editProfProfile', { 
      state: { 
        professorId: professor.professor_id,
        userId: professor.user_id
      } 
    });
  };

  if (isLoading) return <div className="w-screen h-screen bg-red-50 p-8 flex justify-center items-center text-2xl">Loading profile...</div>;
  
  if (error) return <div className="w-screen h-screen bg-red-50 p-8 flex justify-center items-center text-2xl text-red-600">Error: {error}</div>;

  return (
    <div className="w-screen h-screen bg-red-50 p-8">
      {/* Top Navigation */}
      <NavBarProfessor />
     
      {/* Edit Profile Section */}
      <div className="text-4xl font-bold font-normal">My Profile</div>
      <div className="w-full border-t border-black my-6"></div>
     
      {/* Profile Image and Form */}
      <div className="flex items-center space-x-12 px-32">
        {/* Profile Image */}
        <div className="flex flex-col items-center justify-start">
          <div className="w-64 h-64 bg-gray-300 rounded-2xl"></div>
          <div className="mt-4 px-6 py-2 bg-orange-300 rounded-full text-black text-2xl font-normal">
            {`${professor.first_name} ${professor.last_name}`}
          </div>
        </div>
       
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-10 flex-grow -mt-11">
          <div>
            <label className="text-2xl font-normal">First Name:</label>
            <input 
              type="text" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={professor.first_name || ''} 
              readOnly
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Last Name:</label>
            <input 
              type="text" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={professor.last_name || ''} 
              readOnly
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Employee ID:</label>
            <input 
              type="text" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={professor.net_id || ''} 
              readOnly
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Email:</label>
            <input 
              type="text" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={professor.email || ''} 
              readOnly
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Phone Number:</label>
            <input
              type="text" 
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={professor.phone_no || "(XXX) XXX-XXXX"} 
              readOnly 
            />
          </div>
          <div>
            <label className="text-2xl font-normal">Department:</label>
            <input 
              type="text"
              className="w-full h-10 bg-gray-300 rounded px-2 text-xl" 
              value={professor.department || ''} 
              readOnly
            />
          </div>
        </div>
      </div>
     
      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-10">
        <button 
          onClick={handleEditProfile}
          className="px-8 py-3 bg-orange-300 rounded text-xl font-normal"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ViewProfProfile;