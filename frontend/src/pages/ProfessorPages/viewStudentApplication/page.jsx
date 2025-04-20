import React, { useState, useEffect } from 'react';
import NavBar from '../../../Components/NavBarProfessor';
import { useParams } from 'react-router-dom';

// Status styling
const statusColors = {
  draft: 'bg-gray-200 text-gray-800',
  submitted: 'bg-blue-200 text-blue-800',
  under_review: 'bg-yellow-200 text-yellow-800',
  accepted: 'bg-green-200 text-green-800',
  rejected: 'bg-red-200 text-red-800'
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected'
};

const ViewStudentApplication = () => {
  const { application_id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [status, setStatus] = useState('');

  // Helper function to make API requests
  const fetchData = async (endpoint, params) => {
    try {
      const queryString = Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
      
      const url = `http://localhost:5002/GET/${endpoint}${queryString ? `?${queryString}` : ''}`;
      console.log(`Fetching data from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API error (${response.status})`, errorData);
        throw new Error(errorData.message || `Failed to fetch data (${response.status})`);
      }
      
      const data = await response.json();
      console.log(`Data received from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  };

  // Fetch application and student data
  useEffect(() => {
    const loadData = async () => {
      if (!application_id) {
        console.log("No application_id found in URL params");
        setError('Application ID is missing');
        setLoading(false);
        return;
      }

      console.log("Loading data for application ID:", application_id);

      try {
        // Get job application data
        console.log("Fetching job application data...");
        const appData = await fetchData('JobApplication/one', { application_id });
        console.log("Job application data received:", appData);
        
        if (!appData || appData.length === 0) {
          console.log("No application data found");
          setError('Application not found');
          setLoading(false);
          return;
        }
        
        setApplicationData(appData[0]);
        setStatus(appData[0].status);
        console.log("Application student_id:", appData[0].student_id);
        
        // Get all students and find the matching one
        console.log("Fetching all students...");
        const allStudentsResult = await fetchData('Student/all', {});
        console.log("All students data received, count:", allStudentsResult.length);
        
        const matchingStudent = allStudentsResult.find(
          student => student.student_id === appData[0].student_id
        );
        
        if (matchingStudent) {
          console.log("Found matching student:", matchingStudent.first_name, matchingStudent.last_name);
          setStudentData(matchingStudent);
        } else {
          console.log("No matching student found for ID:", appData[0].student_id);
          setError(`Student with ID ${appData[0].student_id} not found`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [application_id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async () => {
    if (!applicationData) return;
    
    console.log("Updating application status to:", status);
    
    try {
      // Create a copy of the application data with only the fields
      // that match the database schema
      const requestBody = {
        application_id: applicationData.application_id,
        job_id: applicationData.job_id,
        student_id: applicationData.student_id,
        research_experience: applicationData.research_experience,
        hours_per_week: applicationData.hours_per_week,
        basic_student_response: applicationData.basic_student_response,
        status: status
      };
      
      // Handle documents_json properly - ensure it's a string for the backend
      if (applicationData.documents_json) {
        if (typeof applicationData.documents_json === 'object') {
          // If it's an object, stringify it
          requestBody.documents_json = JSON.stringify(applicationData.documents_json);
        } else if (typeof applicationData.documents_json === 'string') {
          // If it's already a string, check if it's valid JSON
          try {
            JSON.parse(applicationData.documents_json);
            requestBody.documents_json = applicationData.documents_json;
          } catch (e) {
            console.error('Invalid JSON in documents_json, setting to empty array');
            requestBody.documents_json = '[]';
          }
        }
      } else {
        requestBody.documents_json = '[]';
      }
      
      console.log("Sending update request with data:", requestBody);
      
      const response = await fetch('http://localhost:5002/POST/JobApplication/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Status update response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Status update error:", errorData);
        throw new Error(errorData.error || 'Failed to update status');
      }

      const responseData = await response.json();
      console.log("Status update success:", responseData);

      // Update local state with new status
      setApplicationData({
        ...applicationData,
        status: status
      });
      
      alert('Application status updated successfully!');
    } catch (error) {
      console.error('Error updating application status:', error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-background_clr flex justify-center items-center"><p className="text-xl">Loading application data...</p></div>;
  if (error) return <div className="min-h-screen bg-background_clr flex justify-center items-center"><p className="text-xl text-red-600">Error: {error}</p></div>;
  if (!studentData || !applicationData) return <div className="min-h-screen bg-background_clr flex justify-center items-center"><p className="text-xl">No data found for this application.</p></div>;

  // Parse documents JSON if it exists
  let documents = [];
  try {
    if (applicationData.documents_json) {
      console.log('Raw documents_json:', applicationData.documents_json);
      console.log('Type of documents_json:', typeof applicationData.documents_json);
      
      // Check if documents_json is an object with a resume property
      if (typeof applicationData.documents_json === 'object' && applicationData.documents_json !== null) {
        // Convert object to array format
        if (applicationData.documents_json.resume) {
          documents = [{
            type: 'Resume',
            url: applicationData.documents_json.resume
          }];
        }
        // Check for any other properties in the object
        Object.keys(applicationData.documents_json).forEach(key => {
          if (key !== 'resume' && applicationData.documents_json[key]) {
            documents.push({
              type: key.charAt(0).toUpperCase() + key.slice(1),
              url: applicationData.documents_json[key]
            });
          }
        });
      }
      // Check if it's a string that can be parsed as JSON
      else if (typeof applicationData.documents_json === 'string') {
        try {
          // Try parsing the string
          const parsed = JSON.parse(applicationData.documents_json);
          
          // If parsed result is an array, use it directly
          if (Array.isArray(parsed)) {
            documents = parsed;
          }
          // If parsed result is an object, convert it to array format
          else if (typeof parsed === 'object' && parsed !== null) {
            if (parsed.resume) {
              documents = [{
                type: 'Resume',
                url: parsed.resume
              }];
            }
            // Check for any other properties in the object
            Object.keys(parsed).forEach(key => {
              if (key !== 'resume' && parsed[key]) {
                documents.push({
                  type: key.charAt(0).toUpperCase() + key.slice(1),
                  url: parsed[key]
                });
              }
            });
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Problematic JSON string:', applicationData.documents_json);
          documents = [];
        }
      }
    }
    
    console.log('Final documents array:', documents);
  } catch (e) {
    console.error('Error in documents processing:', e);
  }

  return (
    <div className="min-h-screen bg-background_clr">
      <NavBar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Student Application</h1>
        
        <div className="bg-orange_clr rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          {/* Student Info Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b border-black pb-2">Student Info</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium">First Name</h3>
                <p className="text-xl mt-1">{studentData.first_name}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Last Name</h3>
                <p className="text-xl mt-1">{studentData.last_name}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Net ID</h3>
                <p className="text-xl mt-1">{studentData.net_id}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-xl mt-1">{studentData.email}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Major</h3>
                <p className="text-xl mt-1">{studentData.major}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">GPA</h3>
                <p className="text-xl mt-1">{studentData.gpa}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Graduation Year</h3>
                <p className="text-xl mt-1">{studentData.graduation_year}</p>
              </div>
            </div>
          </div>
          
          {/* Application Response Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b border-black pb-2">Application Response</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Research Experience</h3>
                <p className="mt-1">{applicationData.research_experience} semesters</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Hours Per Week</h3>
                <p className="mt-1">{applicationData.hours_per_week}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Student Response</h3>
                <p className="mt-1 bg-white p-4 rounded-md shadow-sm border border-light_grey_color">
                  {applicationData.basic_student_response}
                </p>
              </div>
              
              {/* Documents Section with better error handling */}
              {documents.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium">Documents</h3>
                  <div className="mt-2 space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center">
                        {doc?.url ? (
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block hover:text-dark_pink_clr underline"
                          >
                            {doc.type || `Document ${index + 1}`}
                          </a>
                        ) : (
                          <p className="text-gray-600 italic">
                            Document {index + 1} (No URL available)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium">Documents</h3>
                  <p className="mt-1 text-gray-600 italic">No documents available</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium">Submission Date</h3>
                <p className="mt-1">
                  {new Date(applicationData.submission_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Status Section */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold">Current Status:</h3>
                <span className={`mt-2 inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColors[applicationData.status]}`}>
                  {statusLabels[applicationData.status]}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div>
                  <label htmlFor="status" className="block text-lg font-medium mb-1">Update Status</label>
                  <div className="relative">
                    <select
                      id="status"
                      value={status}
                      onChange={handleStatusChange}
                      className="w-full p-3 pl-4 pr-12 rounded-md shadow-sm border border-light_grey_color focus:ring-2 focus:ring-light_pink_clr focus:border-light_pink_clr appearance-none transition-all"
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleSubmit} 
                  className="bg-dark_pink_clr hover:bg-light_pink_clr text-white font-bold py-3 px-8 rounded-md shadow-md transition-all transform hover:scale-105 self-end"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentApplication;