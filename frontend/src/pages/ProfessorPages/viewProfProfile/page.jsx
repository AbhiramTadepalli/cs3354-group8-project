import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { requestToUrl } from '../../../modules/requestHelpers';

const ViewProfProfile = () => {
  const navigate = useNavigate(); 
  const [professor, setProfessor] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Define a function to fetch professor data
    const fetchProfessorData = async () => {
      try {
        // Try to get professor_id from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const professorId = storedUser.professor_id;
        console.log("line 23 pass view " + storedUser.password_hash);

        if (!professorId) {
          setError("Professor ID not found. Please login again.");
          setIsLoading(false);
          return;
        }
        
        // Load profile photo from local storage
        const storedPhoto = localStorage.getItem(`profPhoto_${professorId}`);
        if (storedPhoto) {
          setProfilePhotoUrl(storedPhoto);
        }
        
        // Create the request object
        const requestParams = { professor_id: professorId };
        
        // Use the requestToUrl function to convert the request object to URL parameters
        const queryParams = requestToUrl(requestParams);
        
        // Make the fetch request
        const response = await fetch(`http://localhost:5002/GET/Professor/one${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch professor data. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setProfessor(data[0]);
        } else {
          throw new Error('No professor data found');
        }
      } catch (err) {
        console.error('Error fetching professor:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Call the function
    fetchProfessorData();
    
  }, []);

  const handleEditProfile = () => {
    let password = professor.password_hash;

    // If the password_hash is not available, use the password from storedUser or another secure source
    if (!password) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      password = storedUser ? storedUser.password_hash : null; // Make sure to handle null or undefined case
      if (!password) {
        console.error('Password is still missing.');
        setError('Password is missing. Please try again later.');
        return;
      }
    }
  
    // Navigate to edit profile page with professor and user IDs
    navigate('../editProfProfile', { 
      state: { 
        professorId: professor.professor_id,
        userId: professor.user_id,
      }  
    });
    console.log("line 76 userid view " + professor.professor_id);
    console.log("line 76 pass view #1" + professor.password_hash);
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
   
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-10 flex-grow ">
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