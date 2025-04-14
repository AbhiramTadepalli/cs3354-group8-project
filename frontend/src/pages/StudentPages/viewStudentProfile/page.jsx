// Manaar Quadri
// This is the use case to view student profile
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarStudent from '../../../Components/NavBarStudent';

const ViewStudentProfile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-screen h-screen bg-red-50 p-8">
      <NavBarStudent />

      <div className="text-4xl font-bold">My Profile</div>
      <div className="w-full border-t border-black my-6"></div>

      <div className="flex items-center space-x-12 px-32">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-300 rounded-2xl"></div>
          <div className="mt-4 px-6 py-2 bg-orange-300 rounded-full text-black text-2xl">
            John Doe  
            <div className="text-lg">Class of 20XX</div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-10 flex-grow">
          <div>
            <label className="text-2xl">Name:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="John Doe" readOnly />
          </div>
          <div>
            <label className="text-2xl">Student ID:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="123456789" readOnly />
          </div>
          <div>
            <label className="text-2xl">Major:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="Computer Science" readOnly />
          </div>
          <div>
            <label className="text-2xl">Year:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="Senior" readOnly />
          </div>
          <div>
            <label className="text-2xl">Email:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value="johndoe@utdallas.edu" readOnly />
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-center mt-10">
        <button onClick={() => navigate('../editStudentProfile')} className="px-8 py-3 bg-orange-300 rounded text-xl">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ViewStudentProfile;