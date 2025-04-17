import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../../Components/NavBarStudent';
import { requestToUrl } from '../../../modules/requestHelpers';

const JobPostingDetails = () => {
  const { jobId } = useParams(); // Get jobId from URL parameters
  const [job, setJob] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch professor details by ID
  const fetchProfessorById = async (professorId) => {
    try {
      // Create the request object
      const requestParams = { professor_id: professorId };
      
      // Use the requestToUrl function to convert the request object to URL parameters
      const queryParams = requestToUrl(requestParams);
      
      // Make a GET request with query parameters in the URL
      const response = await fetch(`http://localhost:5002/GET/Professor/one${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0]; // Assuming it returns an array with a single professor
    } catch (err) {
      console.error(`Error fetching professor ID ${professorId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        // Get all jobs from valid endpoint first
        const response = await fetch('http://localhost:5002/GET/Job/valid');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const allJobs = await response.json();
        console.log('All jobs:', allJobs);
        
        // Find the job with matching ID
        const foundJob = allJobs.find(job => job.job_id.toString() === jobId);
        
        if (foundJob) {
          console.log('Found job:', foundJob);
          setJob(foundJob);
          
          // Fetch professor details if professor_id exists
          if (foundJob.professor_id) {
            const professorData = await fetchProfessorById(foundJob.professor_id);
            if (professorData) {
              console.log('Professor data:', professorData);
              setProfessor(professorData);
            }
          }
        } else {
          throw new Error(`Job with ID ${jobId} not found in the list of valid jobs`);
        }
        
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch job details: ${err.message}`);
        setLoading(false);
        console.error('Error fetching job details:', err);
      }
    };

    if (jobId) {
      console.log('Fetching details for job ID:', jobId);
      fetchJobDetails();
    } else {
      setError('No job ID provided');
    }
  }, [jobId]);

  // Format requirements for display
  const formatRequirements = () => {
    if (!job) return [];
    
    const requirements = [];
    
    // Grade Level
    if (job.req_grade_level) {
      requirements.push({
        label: 'Grade Level:',
        value: job.req_grade_level
      });
    }
    
    // Minimum GPA
    if (job.req_min_gpa) {
      requirements.push({
        label: 'Minimum GPA:',
        value: job.req_min_gpa
      });
    }
    
    // Required Skills
    if (job.req_skills) {
      requirements.push({
        label: 'Required Skills:',
        value: job.req_skills.split(';').map(skill => skill.trim())
      });
    }
    
    // Required Majors
    if (job.req_majors) {
      requirements.push({
        label: 'Required Major(s):',
        value: job.req_majors
      });
    }
    
    return requirements;
  };

  // Format reading materials for display
  const formatReadingMaterials = () => {
    if (!job || !job.reading_materials) return ['___'];
    return job.reading_materials.split(';').map(material => material.trim());
  };

  if (loading) return (
    <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center">
      Loading job details...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center text-red-500">
      {error}
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center">
      No job details found for this ID.
    </div>
  );

  return (
    <div className="min-h-screen bg-background_clr">
      {/* Navbar */}
      <NavBar />
      
      {/* Main content container */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Job Header */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold mb-2">{job.job_title || "Job Title"}</h1>
          <h2 className="text-2xl mb-4">
            {professor ? 
              `Professor ${professor.first_name} ${professor.last_name}` : 
              `Professor ID: ${job.professor_id}`} 
            {job.lab_name ? ` | ${job.lab_name}` : ""}
          </h2>
          <div className="border-b border-gray-300 my-6"></div>
        </div>
        
        {/* Job Content in two columns */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Job Details */}
          <div className="flex-1">
            {/* Details Section */}
            <div className="bg-gray-200 p-6 rounded-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Details:</h3>
              <p className="mb-6">{job.job_description || "This position is about....."}</p>
              
              <div className="space-y-3">
                <p><span className="font-semibold">Hours:</span> {job.hours || "Not specified"}</p>
                <p><span className="font-semibold">Term:</span> {job.term || "Not specified"}</p>
                <p><span className="font-semibold">Room:</span> {job.location || "Not specified"}</p>
                <p><span className="font-semibold">Compensation:</span> {job.compensation || "Not specified"}</p>
              </div>
            </div>
            
            {/* Requirements Section */}
            <div className="bg-gray-200 p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Requirements/Qualifications:</h3>
              
              <ul className="space-y-4">
                {formatRequirements().map((req, index) => (
                  <li key={index} className="flex flex-col">
                    <span className="font-semibold">• {req.label}</span>
                    {Array.isArray(req.value) ? (
                      <ul className="ml-6 mt-1">
                        {req.value.map((item, idx) => (
                          <li key={idx}>- {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="ml-6">{req.value}</span>
                    )}
                  </li>
                ))}
                
                {formatRequirements().length === 0 && (
                  <li>No specific requirements listed</li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Right Column - Contact & Application Info */}
          <div className="md:w-96">
            <div className="bg-pink-300 p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Contact Information:</h3>
              <p className="mb-1">
                {professor ? 
                  `Name: Professor ${professor.first_name} ${professor.last_name}` : 
                  `Name: Professor ${job.professor_id || "ID"}`}
              </p>
              <p className="mb-6">
                {professor && professor.email ? 
                  `Email: ${professor.email}` : 
                  "Email: professor@university.edu"}
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Deadline:</h3>
              <p className="mb-6">{job.application_deadline || "Not specified"}</p>
              
              <h3 className="text-xl font-semibold mb-4">Reading Material:</h3>
              <ul>
                {formatReadingMaterials().map((material, index) => (
                  <li key={index} className="mb-1">• {material}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-semibold mb-4 mt-6">Status:</h3>
              <p className="capitalize">{job.status || "Unknown"}</p>
            </div>
            
            {/* Apply Button */}
            <button className="w-full py-4 bg-orange_clr text-xl  font-semibold rounded text-center mt-6 hover:bg-orange-400 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails;