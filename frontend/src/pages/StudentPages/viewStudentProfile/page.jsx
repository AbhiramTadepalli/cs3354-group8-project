// Manaar Quadri
// This is the use case to view student profile

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarStudent from '../../../Components/NavBarStudent';

const ViewStudentProfile = () => {
  const navigate = useNavigate();

  // State to hold student info, profile image, loading status, and any error
  const [studentInfo, setStudentInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch student profile data on component mount
  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const net_id = storedUser?.net_id;

    // If net_id is not found, show error
    if (!net_id) {
      setError("User information not found");
      setIsLoading(false);
      return;
    }

    // Try to load profile image from localStorage (optional)
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }

    // Fetch student data from server
    fetch("http://localhost:5002/GET/Student/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Find the student in the fetched data using net_id
        const student = data.find(s => s.net_id === net_id);
        if (student) {
          // Update state with fetched data
          setStudentInfo(student);

          // Save updated info to localStorage (excluding sensitive info)
          const storageData = {
            ...student,
            password_hash: undefined // Remove sensitive info
          };
          localStorage.setItem("user", JSON.stringify(storageData));
        } else {
          // If student not found, use whatever is in localStorage
          setStudentInfo(storedUser);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching student data:', err);
        // If fetch fails, fallback to localStorage data
        if (storedUser) {
          setStudentInfo(storedUser);
          setIsLoading(false);
        } else {
          setError("Failed to load profile data");
          setIsLoading(false);
        }
      });
  }, []);

  // Navigate to the edit profile page with current net_id
  const handleEditProfile = () => {
    navigate('../editStudentProfile', {
      state: { studentId: studentInfo?.net_id }
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-screen min-h-screen bg-red-50 p-8">
        <NavBarStudent />
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Render error message if something went wrong
  if (error) {
    return (
      <div className="w-screen min-h-screen bg-red-50 p-8">
        <NavBarStudent />
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Main profile UI
  return (
    <div className="w-screen min-h-screen bg-red-50 p-8">
      <NavBarStudent />
      <div className="text-4xl font-bold mb-6">My Profile</div>

      <div className="flex gap-12">
        

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {[
            ["Name", `${studentInfo?.first_name} ${studentInfo?.last_name}`],
            ["Net ID", studentInfo?.net_id],
            ["Major", studentInfo?.major],
            ["GPA", studentInfo?.gpa],
            ["Graduation Year", studentInfo?.graduation_year],
            ["Email", studentInfo?.email],
          ].map(([label, value], idx) => (
            <div key={idx}>
              <label className="text-xl">{label}</label>
              <input
                type="text"
                className="w-full h-10 bg-gray-200 rounded px-2 text-lg"
                value={value || ""}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleEditProfile}
          className="bg-orange-300 px-8 py-3 rounded text-xl"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ViewStudentProfile;
