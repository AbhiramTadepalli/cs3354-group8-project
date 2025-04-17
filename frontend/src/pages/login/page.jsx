// Nidhi Majoju
// Login component integrated with existing APIs using Fetch API
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Fetching all users...');
      
      // First check if the user exists by fetching all users and finding the matching one
      const usersResponse = await fetch('http://localhost:5002/GET/User/all');
      
      console.log('Users fetch response status:', usersResponse.status);
      
      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch users: ${usersResponse.status}`);
      }
      
      const users = await usersResponse.json();
      console.log(`Fetched ${users.length} users`);
      
      // Find the user with matching username
      const user = users.find(u => 
        u.email === username || // Try matching by email
        u.username === username // Or by username if it exists
      );
      
      console.log('Found user:', user ? 'Yes' : 'No');
      
      if (!user) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }
      
      // Check if password matches
      // Note: In a real system, passwords should be hashed in the database
      if (user.password_hash !== password) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }
      
      // User found, now determine the user type
      let userType = user.user_type || 'unknown';
      let userDetails = user;

      if (userType === 'student') {
        try {
          console.log('Fetching student details...');
          const studentResponse = await fetch('http://localhost:5002/GET/Student/all');
          
          if (studentResponse.ok) {
            const students = await studentResponse.json();
            // Find matching student by user_id
            const studentDetail = students.find(s => s.user_id === user.user_id);
            
            if (studentDetail) {
              userDetails = { ...user, ...studentDetail };
            }
          }
        } catch (error) {
          console.log('Error fetching student details:', error);
        }
      } else if (userType === 'professor') {
        try {
          console.log('Fetching professor details...');
          const professorResponse = await fetch('http://localhost:5002/GET/Professor/all');
          
          if (professorResponse.ok) {
            const professors = await professorResponse.json();
            // Find matching professor by user_id
            const professorDetail = professors.find(p => p.user_id === user.user_id);
            
            if (professorDetail) {
              userDetails = { ...user, ...professorDetail };
            }
          }
        } catch (error) {
          console.log('Error fetching professor details:', error);
        }
      }

      // Store user info in localStorage for persistent authentication
      localStorage.setItem('user', JSON.stringify(userDetails));
      localStorage.setItem('userType', userType);
      
      console.log('Login successful. User type:', userType);
      
      // Redirect based on user role
      if (userType === 'student') {
        navigate('/searchPage'); // Redirect to searchPage
      } else if (userType === 'professor') {
        navigate('/myApplications'); // Redirect to myApplicationsPage
      } else if (userType === 'admin') {
        navigate('/admin-dashboard'); // Optional: redirect to admin page
      } else {
        // If user type can't be determined, show error
        setError('Unable to determine user type');
        setLoading(false);
      }
    } catch (err) {
      // Handle errors
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-background_clr h-screen w-screen flex items-center justify-start">
      {/* Image on the Left */}
      <img
        src="/CometConnectLogo.png"
        alt="logo"
        className="ml-24 w-auto h-full"
      />
      <div className="w-full max-w-lg px-6 ml-32">
        <h1 className="text-3xl text-center font-normal mb-10 mt-32">
          Login
        </h1>
        
        {/* Display error message if any */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}
        
        {/* username and password fields*/}
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 mb-5 border-none rounded bg-orange_clr placeholder-white text-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 mb-8 border-none rounded bg-orange_clr placeholder-white text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          {/* Login button */}
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="px-16 py-3 bg-dark_pink_clr text-white border-none rounded-full text-lg cursor-pointer mb-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Submit'}
            </button>
            
            {/* Sign up link */}
            <Link
              to="/createAccount"
              className="text-black underline text-base"
            >
              Don't have an account yet?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;