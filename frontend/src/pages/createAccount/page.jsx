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
  
  // Validation error state for individual fields
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Major options
  const majorOptions = [
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'electrical_engineering', label: 'Electrical Engineering' },
    { value: 'mechanical_engineering', label: 'Mechanical Engineering'},
    { value: 'biomedical_engineering', label: 'Biomedical Engineering'},
    { value: 'nueroscience', label: 'Neuroscience' },
    { value: 'biology', label: 'Biology' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'physics', label: 'Physics' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'economics', label: 'Economics' }
  ];
  
  // Term options - limiting to match the terms you provided
  const termOptions = [
    { value: 'summer_2025', label: 'Summer 2025' },
    { value: 'fall_2025', label: 'Fall 2025' },
    { value: 'spring_2026', label: 'Spring 2026' },
    { value: 'summer_2026', label: 'Summer 2026' },
    { value: 'fall_2026', label: 'Fall 2026' },
    { value: 'spring_2027', label: 'Spring 2027' },
    { value: 'summer_2027', label: 'Summer 2027' },
    { value: 'fall_2027', label: 'Fall 2027' },
    { value: 'spring_2028', label: 'Spring 2028' },
    { value: 'summer_2028', label: 'Summer 2028' }
  ];
  
  // Validation functions
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@utdallas\.edu$/;
    return regex.test(email);
  };
  
  const validatePhone = (phone) => {
    const regex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return regex.test(phone);
  };
  
  const validateGPA = (gpa) => {
    const numGPA = parseFloat(gpa);
    return !isNaN(numGPA) && numGPA >= 0.0 && numGPA <= 4.0;
  };
  
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on number of digits
    if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };
  
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    // Clear role-specific errors when changing role
    setFieldErrors({});
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let fieldError = '';
    
    // Special handling for phone number formatting
    if (name === 'phoneNo') {
      updatedValue = formatPhoneNumber(value);
      if (updatedValue.length >= 14 && !validatePhone(updatedValue)) {
        fieldError = 'Phone number must be in format (XXX) XXX-XXXX';
      }
    }
    
    // GPA validation
    if (name === 'gpa') {
      if (value && !validateGPA(value)) {
        fieldError = 'GPA must be between 0.0 and 4.0';
      }
    }
    
    // Email validation
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        fieldError = 'Email must end with @utdallas.edu';
      }
    }
    
    setFormData({
      ...formData,
      [name]: updatedValue
    });
    
    setFieldErrors({
      ...fieldErrors,
      [name]: fieldError
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    if (!validateEmail(formData.email)) {
      setError('Email must end with @utdallas.edu');
      return;
    }
    
    // Role-specific validation
    if (selectedRole === 'student') {
      if (!formData.netId || !formData.major) {
        setError('Please fill in all student information');
        return;
      }
      if (!validateGPA(formData.gpa)) {
        setError('GPA must be between 0.0 and 4.0');
        return;
      }
    }
    
    if (selectedRole === 'professor') {
      if (!formData.netId || !formData.department || !formData.phoneNo) {
        setError('Please fill in all professor information');
        return;
      }
      if (!validatePhone(formData.phoneNo)) {
        setError('Phone number must be in format (XXX) XXX-XXXX');
        return;
      }
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
              className="w-full h-12 p-4 border-none rounded-full bg-light_pink_clr text-white text-sm appearance-none"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              {/* select user role*/}
              <option value="role">Role</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <FiChevronDown className="w-5 h-5 text-white" />
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
              className="w-1/2 p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-1/2 p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email (must be @utdallas.edu)"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
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
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4 relative">
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75 appearance-none"
                  disabled={loading}
                >
                  <option value="" className="bg-orange_clr text-white">Select Major</option>
                  {majorOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-orange_clr text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <FiChevronDown className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mb-4 relative">
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75 appearance-none"
                  disabled={loading}
                >
                  <option value="" className="bg-orange_clr text-white">Select Graduation Term</option>
                  {termOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-orange_clr text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <FiChevronDown className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="gpa"
                  placeholder="GPA (0.0 - 4.0)"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0.0"
                  max="4.0"
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
                {fieldErrors.gpa && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.gpa}</p>
                )}
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
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
              </div>
              <div className="mb-4 relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75 appearance-none"
                  disabled={loading}
                >
                  <option value="" className="bg-orange_clr text-white">Select Department</option>
                  {majorOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-orange_clr text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <FiChevronDown className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Phone Number: (XXX) XXX-XXXX"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="w-full p-4 border-none rounded bg-orange_clr text-lg text-white placeholder-white placeholder-opacity-75"
                  disabled={loading}
                />
                {fieldErrors.phoneNo && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNo}</p>
                )}
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