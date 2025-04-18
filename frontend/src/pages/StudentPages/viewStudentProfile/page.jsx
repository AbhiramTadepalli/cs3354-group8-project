// Manaar Quadri
// This is the use case to view student profile
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarStudent from '../../../Components/NavBarStudent';

const ViewStudentProfile = () => {
  const navigate = useNavigate();

  const studentInfo = JSON.parse(localStorage.getItem('user'));
  
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
            {studentInfo.first_name + " " + studentInfo.last_name}
            <div className="text-lg">{studentInfo.graduation_year != null ? "Class of " + studentInfo.graduation_year : ''}</div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-10 flex-grow">
          <div>
            <label className="text-2xl">Name:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={studentInfo.first_name + ' ' + studentInfo.last_name} readOnly />
          </div>
          <div>
            <label className="text-2xl">Student ID:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={studentInfo.net_id} readOnly />
          </div>
          <div>
            <label className="text-2xl">Major:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={studentInfo.major} readOnly />
          </div>
          <div>
            <label className="text-2xl">GPA:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={studentInfo.gpa} readOnly />
          </div>
          <div>
            <label className="text-2xl">Email:</label>
            <input type="text" className="w-full h-10 bg-gray-300 rounded px-2 text-xl" value={studentInfo.email} readOnly />
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