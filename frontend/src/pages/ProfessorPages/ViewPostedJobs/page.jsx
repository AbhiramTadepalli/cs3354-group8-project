// abhiram tadepalli
import React, { useEffect, useState } from 'react'
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { requestToUrl } from '../../../modules/requestHelpers';

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
          throw new Error('Network response was not ok');
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
      <NavBarProfessor />
      <div className="mt-16 px-6">
        <h1 className="text-4xl font-bold mb-6">View Posted Jobs</h1>
        {jobPostings.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow">
            {/* Table Header */}
            <div className="grid grid-cols-7 bg-white p-4 border-b text-sm font-medium text-gray-600">
              <div>Job Title</div>
              <div>Date Posted</div>
              <div>Job ID</div>
              <div>Applied</div>
              <div>Accepted</div>
              <div>Rejected</div>
              <div>Action</div>
            </div>
  
            {/* Table Body */}
            <div className="bg-orange-200">
              {jobPostings.map((job) => (
                <div
                  key={job.job_id}
                  className="grid grid-cols-7 p-3 border-b border-orange-300 items-center hover:bg-orange-100 cursor-pointer transition"
                  onClick={() => window.location.href = `/editJob/${job.job_id}`}
                >
                  <div>{job.job_title}</div>
                  <div>{new Date(job.created_at).toLocaleDateString('en-US')}</div>
                  <div>{job.job_id}</div>
                  <div>
                    {jobApplications && jobApplications[job.job_id]
                      ? jobApplications[job.job_id].length
                      : 0}
                  </div>
                  <div>
                    {jobApplications && jobApplications[job.job_id]
                      ? jobApplications[job.job_id].reduce(
                          (acc, application) =>
                            acc + (application["status"] === "accepted" ? 1 : 0),
                          0
                        )
                      : 0}
                  </div>
                  <div>
                    {jobApplications && jobApplications[job.job_id]
                      ? jobApplications[job.job_id].reduce(
                          (acc, application) =>
                            acc + (application["status"] === "rejected" ? 1 : 0),
                          0
                        )
                      : 0}
                  </div>
                  <div className="text-right">
                    <button
                      className="px-4 py-2 bg-orange-300 text-dark_pink_clr rounded text-xs font-medium hover:bg-orange-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/viewJob/${job.job_id}`;
                      }}
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold mb-2">No Jobs Posted</h2>
            <p className="text-gray-600 mb-4">
              You haven't posted any jobs yet.
            </p>
            <a
              href="/addJob"
              className="inline-block px-4 py-2 bg-orange-300 text-black rounded-md hover:bg-orange-400"
            >
              Post a Job
            </a>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default ViewPostedJobs