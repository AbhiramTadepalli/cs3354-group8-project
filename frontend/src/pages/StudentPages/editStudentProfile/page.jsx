// Manaar Quadri
// This is the use case to edit student profile 

import React, { useState, useEffect } from "react";
import NavBarStudent from "../../../Components/NavBarStudent";
import { useNavigate, useLocation } from "react-router-dom";

const EditStudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve studentId from navigation state or set to null
  const [studentId, setStudentId] = useState(location.state?.studentId || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to hold student profile information
  const [formData, setFormData] = useState({
    user_id: "",
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Password will not be shown or updated here directly
    net_id: "",
    major: "",
    graduation_year: "",
    gpa: "",
  });

  // State to hold the profile image (as base64 string)
  const [profileImage, setProfileImage] = useState(null);

  // Load student data when component mounts or studentId changes
  useEffect(() => {
    // Try to get net_id from local storage if not passed in props
    if (!studentId) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setStudentId(storedUser.net_id);
      }
    }

    // Fetch student data from backend once studentId is available
    if (studentId) {
      setIsLoading(true);
      fetch("http://localhost:5002/GET/Student/all")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          const student = data.find((s) => s.net_id === studentId);
          if (student) {
            // Populate form with existing student data
            setFormData({
              user_id: student.user_id,
              student_id: student.student_id,
              first_name: student.first_name,
              last_name: student.last_name,
              email: student.email,
              password: "", // Never expose password in frontend
              net_id: student.net_id,
              major: student.major,
              graduation_year: student.graduation_year,
              gpa: student.gpa,
            });

            // Load stored profile image from local storage if available
            const storedImage = localStorage.getItem("profileImage");
            if (storedImage) {
              setProfileImage(storedImage);
            }
          } else {
            setError("Student not found");
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching student data:", err);
          setError("Failed to load student data");
          setIsLoading(false);
        });
    }
  }, [studentId]);

  // Handle changes to form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload and convert image to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setIsLoading(true);

    const updatedStudent = {
      user_id: parseInt(formData.user_id),
      student_id: parseInt(formData.student_id),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      // If password is empty, don't send it at all
      ...(formData.password ? { password: formData.password } : {}),
      net_id: formData.net_id,
      major: formData.major,
      graduation_year: formData.graduation_year,
      gpa: formData.gpa,
    };

    // Save to localStorage (excluding password for security)
    const localStorageData = {
      ...updatedStudent,
      password: undefined
    };
    localStorage.setItem("user", JSON.stringify(localStorageData));

    // Save profile image if it exists
    if (profileImage) {
      localStorage.setItem("profileImage", profileImage);
    }

    // Send updated data to the server
    fetch("http://localhost:5002/POST/Student/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudent)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || `Server error: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Profile updated:", data);
        navigate("../viewStudentProfile");
      })
      .catch((err) => {
        console.error("Error updating student profile:", err);
        setError("Failed to update profile: " + err.message);
        setIsLoading(false);
        alert("Failed to update profile. Please try again.");
      });
  };

  // Show loading spinner while fetching data
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

  // Show error message if there's a problem
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

  // Render the profile edit form
  return (
    <div className="w-screen min-h-screen bg-red-50 p-8">
      <NavBarStudent />
      <div className="text-4xl font-bold mb-6">Edit Student Profile</div>
      <div className="flex gap-12">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-64 h-64 bg-gray-300 rounded-2xl overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-xl">No Image</span>
            )}
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            id="profileImageInput"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={() => document.getElementById("profileImageInput").click()}
            className="bg-orange-300 px-4 py-2 rounded-full text-xl"
          >
            Edit Profile Photo
          </button>
        </div>

        {/* Form Fields Section */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {[
            ["first_name", "First Name"],
            ["last_name", "Last Name"],
            ["net_id", "Net ID", true], // readOnly
            ["major", "Major"],
            ["graduation_year", "Graduation Year"],
            ["email", "Email"],
            ["gpa", "GPA"],
          ].map(([key, label, readOnly = false]) => (
            <div key={key}>
              <label className="text-xl">{label}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                readOnly={readOnly}
                className="w-full h-10 bg-gray-200 rounded px-2 text-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mt-10">
        <button
          onClick={handleSubmit}
          className="bg-orange-300 px-6 py-2 text-lg rounded"
        >
          Save Changes
        </button>
        <button
          onClick={() => navigate("../viewStudentProfile")}
          className="bg-gray-300 px-6 py-2 text-lg rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditStudentProfile;