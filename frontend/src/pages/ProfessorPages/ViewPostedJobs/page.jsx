// abhiram tadepalli
import React, { useEffect, useState } from 'react'
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { requestToUrl } from '../../../modules/requestHelpers';
import { Link } from 'react-router-dom'; // Import Link component

const ViewPostedJobs = () => {

  const profID = JSON.parse(localStorage.getItem('user'))['professor_id']; // Get the logged-in professor's ID from local storage
  const [jobPostings, setJobPostings] = useState([]); // State to hold job postings
  const [jobApplications, setJobApplications] = useState({}); // State to hold job applications

  useEffect(() => {
    // Fetch job postings from the server when the component mounts 
    fetch('http://localhost:5002/GET/Job/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Networke response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data, profID);
        data = data.filter(job => job.professor_id === profID); // Filter job postings for the logged-in professor
          setJobPostings(data); // Set the job postings state with the fetched data
      }
      )
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  
  useEffect(() => {
    const newApplicationsMap = {} // temporary map to hold new applications for each job posting

    
    const jobApplicationResponses = jobPostings.map((job) => {

      const request = {
        "job_id": job.job_id
      }

      // link jobApplications to jobPostings
      return fetch('http://localhost:5002/GET/JobApplication/job' + requestToUrl(request), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          newApplicationsMap[job.job_id] = data; // Map job ID to its applications
        })
        .catch((error) => {
          console.error('Error:', error);
          newApplicationsMap[job.job_id] = []; // If error, set applications to empty array
        });
    });

    Promise.all(jobApplicationResponses).then(() => {
      setJobApplications(newApplicationsMap); // Update state with the map
      console.log('Job Applications:', jobApplications); // Log the job applications
    });

    
    
  }, [jobPostings]);
  

  return (
    <div className="bg-background_clr min-h-screen">
      <NavBarProfessor></NavBarProfessor>
      <div className="pb-8 pl-8 pr-8">
        <h1 className="text-4xl font-bold mb-4">View Posted Jobs</h1>

        <table className="w-full border-separate border-spacing-y-3 px-12">
          <thead>
            {/* Table header */}
            <tr className="text-sm text-gray-600">
              {/* Table header column names */}
              <th className="pl-2 w-12"></th>
              <th className="text-center w-32">Job Title</th>
              <th className="text-center w-32">Date Posted</th>
              <th className="text-center w-32">Job ID</th>
              <th className="text-center w-32">Role</th>
              <th className="text-center w-32">Applied</th>
              <th className="text-center w-32">Accepted</th>
              <th className="text-center w-32">Rejected</th>
              <th className="text-center w-32"></th>
            </tr>
          </thead>
          <tbody className="bg-orange_clr">
            {/* Posted Jobs */}
            {jobPostings.map((job) => (
              /* Each row is a Job the professor has posted */
              <tr 
                key={job.job_id} 
                className="text-lg text-center border-b hover:bg-orange-200 cursor-pointer"
                onClick={() => window.location.href = `/editJob/${job.job_id}`}
              >
                <td className="p-2 text-center">
                  <img
                    src={job.profilePicUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-2">{job.job_title}</td>
                <td className="p-2">{new Date(job.created_at).toLocaleDateString('en-US')}</td>
                <td className="p-2">{job.job_id}</td>
                <td className="p-2 text-sm">{job.job_title}</td>
                <td className="p-2">{jobApplications && jobApplications[job.job_id] ? jobApplications[job.job_id].length : 0}</td>
                <td className="p-2">{jobApplications && jobApplications[job.job_id] ? jobApplications[job.job_id].reduce((acc, application) => acc + (application["status"] == 'accepted' ? 1 : 0), 0) : 0}</td>
                <td className="p-2">{jobApplications && jobApplications[job.job_id] ? jobApplications[job.job_id].reduce((acc, application) => acc + (application["status"] == 'rejected' ? 1 : 0), 0) : 0}</td>
                <td className="p-2 text-right pr-8">
                  <button 
                    className="px-4 py-2 text-dark_pink_clr rounded"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop the row click event from triggering
                      window.location.href = `/viewJob/${job.job_id}`; // Navigate to applications view instead
                    }}
                  >
                    View Applications
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ViewPostedJobs