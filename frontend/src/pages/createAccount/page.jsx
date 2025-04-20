//Nidhi Majoju
//this is the use case to create an account
import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
  const navigate = useNavigate();
  
  // Initialize with 'student' as the default role
  const [selectedRole, setSelectedRole] = useState('student');
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    netId: '',
    major: '',
    graduationYear: '',
    gpa: '',
    department: '',
    phoneNo: ''
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Role-specific validation
    if (selectedRole === 'student' && (!formData.netId || !formData.major)) {
      setError('Please fill in all student information');
      return;
    }
    
    if (selectedRole === 'professor' && (!formData.netId || !formData.department || !formData.phoneNo)) {
      setError('Please fill in all professor information');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let endpoint = '';
      let payload = {};
      
      // Base user data common to all user types
      const userData = {
        email: formData.email,
        password: formData.password, // No hashing needed as confirmed
        first_name: formData.firstName, 
        last_name: formData.lastName,
        user_type: selectedRole // 'student' or 'professor'
      };
      
      // Prepare data based on role
      if (selectedRole === 'student') {
        endpoint = 'http://localhost:5002/POST/Student/add';
        payload = {
          ...userData, // Common user data
          // Student-specific fields
          net_id: formData.netId,
          major: formData.major,
          Graduation_year: formData.graduationYear,
          gpa: formData.gpa
        };
      } else if (selectedRole === 'professor') {
        endpoint = 'http://localhost:5002/POST/Professor/add';
        payload = {
          ...userData, // Common user data
          // Professor-specific fields
          net_id: formData.netId,
          department: formData.department,
          phone_no: formData.phoneNo
        };
      } else if (selectedRole === 'role') {
        endpoint = 'http://localhost:5002/POST/role/add';
        payload = {
          ...userData
          // No role-specific fields based on the schema
        };
      }
      
      console.log('Sending data to:', endpoint);
      console.log('Payload:', payload);
      
      // Make API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // Log the response status
      console.log('Response status:', response.status);
      
      // Get the response body
      const responseData = await response.json().catch(() => ({}));
      console.log('Response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || `Server returned ${response.status}: Failed to create account`);
      }
      
      
      // Account created successfully
      console.log('Account created successfully');
      
      // Redirect based on user role
      if (selectedRole === 'student') {
        navigate('/login'); // Redirect students to searchPage
      } else if (selectedRole === 'professor') {
        navigate('/login'); // Redirect professors to ViewPostedJobs
      } else {
        // Default fallback for role or other roles
        navigate('/');
      }
      
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.message || 'An error occurred during account creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-background_clr">
      <div className="w-full max-w-2xl flex flex-col items-center mt-16 pb-16">
        <div className="items-center">
          <img
            src="/NavBarLogo.png"
            alt="Comet"
            className="h-64 w-auto mr-5 -mb-4 items-center"
          />
        </div>
        <h1 className="text-4xl font-normal mb-8">
          Create Account
        </h1>
        
        {/* Error message display */}
        {error && (
          <div className="w-full mb-4 px-4 py-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="w-full px-4" onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <select
              className="w-full h-12 p-4 border-none rounded-full bg-light_pink_clr text-sm appearance-none"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              {/* select user role*/}
              <option value="role">Role</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <FiChevronDown className="w-5 h-5 text-black" />
            </div>
          </div>
          
          {/* fields to fill out for creating account*/}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-1/2 p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-1/2 p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
          </div>
          
          {/* Conditional fields for Student */}
          {selectedRole === 'student' && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="netId"
                  placeholder="Net ID"
                  value={formData.netId}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="major"
                  placeholder="Major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="graduationYear"
                  placeholder="Graduation Year (e.g., Spring 2024)"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="gpa"
                  placeholder="GPA"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          {/* Conditional fields for Professor */}
          {selectedRole === 'professor' && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="netId"
                  placeholder="Net ID"
                  value={formData.netId}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="px-16 py-3 bg-dark_pink_clr text-white border-none rounded-full text-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Submit'}
            </button>
          </div>
          
          {/* Link to login page */}
          <div className="flex justify-center">
            <Link
              to="/login"
              className="text-black underline text-base"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;