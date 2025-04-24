// Manaar Quadri
// This is the use case to edit student profile 

import React, { useState, useEffect } from "react";
import NavBarStudent from "../../../Components/NavBarStudent";
import { useNavigate, useLocation } from "react-router-dom";

// Sample list of majors
const majors = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Business Administration", "Biology", "Psychology", "Economics"
];

// Generate graduation years from 2025 onward
const graduationYears = Array.from({ length: 8 }, (_, i) => 2025 + i);

const EditStudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [studentId, setStudentId] = useState(location.state?.studentId || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    net_id: "",
    major: "",
    graduation_year: "",
    gpa: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [gpaError, setGpaError] = useState("");  // GPA error state

  useEffect(() => {
    if (!studentId) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setStudentId(storedUser.net_id);
      }
    }

    if (studentId) {
      setIsLoading(true);
      fetch("http://localhost:5002/GET/Student/all")
        .then((res) => {
          if (!res.ok) throw new Error(`Server error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const student = data.find((s) => s.net_id === studentId);
          if (student) {
            setFormData({
              user_id: student.user_id,
              student_id: student.student_id,
              first_name: student.first_name,
              last_name: student.last_name,
              email: student.email,
              password: "",
              net_id: student.net_id,
              major: student.major,
              graduation_year: student.graduation_year,
              gpa: student.gpa,
            });

            const storedImage = localStorage.getItem("profileImage");
            if (storedImage) setProfileImage(storedImage);
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

  // Email and GPA validation
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Email validation
    if (e.target.name === "email") {
      const email = e.target.value;
      if (!/^[a-zA-Z0-9._%+-]+@utdallas\.edu$/.test(email)) {
        setEmailError("Email must end with @utdallas.edu");
      } else {
        setEmailError("");
      }
    }

    // GPA validation (ensure it's a number between 0.0 and 4.0)
    if (e.target.name === "gpa") {
      const gpa = parseFloat(e.target.value);
      if (isNaN(gpa) || gpa < 0 || gpa > 4) {
        setGpaError("GPA must be between 0.0 and 4.0");
      } else {
        setGpaError("");
      }
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit the updated form
  const handleSubmit = () => {
    // Check for errors
    if (emailError || gpaError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    const updatedStudent = {
      user_id: parseInt(formData.user_id),
      student_id: parseInt(formData.student_id),
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      ...(formData.password ? { password: formData.password } : {}),
      net_id: formData.net_id,
      major: formData.major,
      graduation_year: formData.graduation_year,
      gpa: formData.gpa,
    };

    localStorage.setItem("user", JSON.stringify({ ...updatedStudent, password: undefined }));
    if (profileImage) localStorage.setItem("profileImage", profileImage);

    fetch("http://localhost:5002/POST/Student/modify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error || `Server error: ${res.status}`);
          });
        }
        return res.json();
      })
      .then(() => navigate("../viewStudentProfile"))
      .catch((err) => {
        console.error("Error updating student profile:", err);
        setError("Failed to update profile: " + err.message);
        setIsLoading(false);
        alert("Failed to update profile. Please try again.");
      });
  };

  // Show loading state
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

  // Show error state
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

  // Render form UI
  return (
    <div className="w-screen min-h-screen bg-red-50 p-8">
      <NavBarStudent />
      <div className="text-4xl font-bold mb-6">Edit Student Profile</div>
      <div className="flex gap-12">
        <div className="grid grid-cols-2 gap-6 w-full">
          {/* Basic Input Fields */}
          {[["first_name", "First Name"], ["last_name", "Last Name"], ["net_id", "Net ID", true], ["email", "Email"], ["gpa", "GPA"]].map(([key, label, readOnly = false]) => (
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
              {/* Show email error */}
              {key === "email" && emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              {/* Show GPA error */}
              {key === "gpa" && gpaError && <p className="text-red-500 text-sm">{gpaError}</p>}
            </div>
          ))}

          {/* Major Dropdown */}
          <div>
            <label className="text-xl">Major</label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full h-10 bg-gray-200 rounded px-2 text-lg"
            >
              <option value="">Select a major</option>
              {majors.map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          {/* Graduation Year Dropdown */}
          <div>
            <label className="text-xl">Graduation Year</label>
            <select
              name="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              className="w-full h-10 bg-gray-200 rounded px-2 text-lg"
            >
              <option value="">Select year</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-6 mt-10">
        <button onClick={handleSubmit} className="bg-orange-300 px-6 py-2 text-lg rounded">
          Save Changes
        </button>
        <button onClick={() => navigate("../viewStudentProfile")} className="bg-gray-300 px-6 py-2 text-lg rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditStudentProfile;


