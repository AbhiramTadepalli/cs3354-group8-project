import React from 'react';
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { useNavigate } from 'react-router-dom';

const ViewProfProfile = () => {
  const navigate = useNavigate();
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
          <div className="mt-4 px-6 py-2 bg-orange-300 rounded-full text-black text-2xl font-normal">Professor Name</div>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-10 flex-grow -mt-11">
          <div>
            <label className="text-2xl font-normal">First Name:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="First Name" readOnly/>
          </div>
          <div>
            <label className="text-2xl font-normal">Last Name:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="Last Name" readOnly/>
          </div>
          <div>
            <label className="text-2xl font-normal">Employee ID:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="1234567890" readOnly />
          </div>
          <div>
            <label className="text-2xl font-normal">Email:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="@utdallas.edu" readOnly/>
          </div>
          <div>
            <label className="text-2xl font-normal">Phone Number:</label>
            <input 
              type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="(XXX) XXX-XXXX" readOnly />
          </div>
          <div>
            <label className="text-2xl font-normal">Department:</label>
            <select className="w-full h-10 bg-gray-300 rounded px-2 text-xl" disabled>
              <option>Computer Science</option>
              <option>Mechanical Engineering</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-10">
      <button 
        onClick={() => navigate('../editProfProfile')} 
        className="px-8 py-3 bg-orange-300 rounded text-xl font-normal"
      >
        Edit Profile
      </button>
    </div>
    </div>
  );
};

export default ViewProfProfile;