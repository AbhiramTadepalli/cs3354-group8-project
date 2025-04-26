// abhiram tadepalli
import React, { useEffect, useState } from 'react'
import NavBarProfessor from "../../../Components/NavBarProfessor";
import { useParams } from 'react-router-dom';
import { requestToUrl } from '../../../modules/requestHelpers';

const ViewPostedJobs = () => {

  
  const [jobApplications, setJobApplications] = useState([]); // State to hold job applications
  const [job, setJob] = useState(); // State to hold job applications

  const { job_id } = useParams(); // Get the job ID from the URL parameters


  const application_request = {
    "job_id": job_id
  }
  // Fetch applications
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchApplicationsAndStudents = async () => {
      try {
        // 1. Fetch job applications
        const appRes = await fetch('http://localhost:5002/GET/JobApplication/job' + requestToUrl(application_request), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!appRes.ok) throw new Error('Network response was not ok');
        const applications = await appRes.json();

        // 2. For each application, fetch student data in parallel
        const applicationsWithStudent = await Promise.all(applications.map(async (app) => {
          const studentRes = await fetch('http://localhost:5002/GET/Student/one' + requestToUrl({ student_id: app.student_id }), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (!studentRes.ok) throw new Error('Student fetch failed');
          const studentData = await studentRes.json();

          // Combine application and student data as needed
          return { ...app, student: studentData[0] };
        }));

        // 3. Set the combined data into state
        setJobApplications(applicationsWithStudent);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchJobDetails = async () => {
      try {
        // 1. Fetch job 
        const appRes = await fetch('http://localhost:5002/GET/Job/one' + requestToUrl(application_request), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!appRes.ok) throw new Error('Network response was not ok');
        const job = await appRes.json();

        setJob(job[0]);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchApplicationsAndStudents();
    fetchJobDetails();
  }, []);
  
// Function to determine status color
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "submitted":
      return "bg-pink-500 text-white";
    case "review":
      return "bg-purple-500 text-white";
    case "accepted":
      return "bg-purple-700 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

  return (
    <div className="bg-background_clr min-h-screen">
      <NavBarProfessor />
      <div className="mt-16 px-6">
        <h1 className="text-4xl font-bold mb-4">
          {job ? `${job.job_title} - ${job.lab_name}` : 'Applications for Job Posting'}
        </h1>
        <h3 className="text-xl font-semibold text-gray-500 mb-6">
          {job && jobApplications ? `ID: ${job.job_id} - Posted on: ${new Date(job.created_at).toLocaleDateString('en-US')} - ${jobApplications.length} Applications` : ''}
        </h3>
  
        {jobApplications.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow">
            {/* Table Header */}
            <div className="grid grid-cols-9 bg-white p-4 border-b text-sm font-medium text-gray-600">
              <div>Student</div>
              <div>Date Applied</div>
              <div>Graduation</div>
              <div>Research Experience</div>
              <div>Major</div>
              <div>Hours Per Week</div>
              <div>Status</div>
              <div>Action</div>
            </div>
  
            {/* Table Body */}
            <div className="bg-orange-200">
              {jobApplications.map((application) => (
                <div
                  key={application.application_id}
                  className="grid grid-cols-9 p-3 border-b border-orange-300 items-center hover:bg-orange-100 transition"
                >
                  <div className='p-1'>{`${application.student.first_name} ${application.student.last_name}`}</div>
                  <div className='p-1'>{new Date(application.submission_date).toLocaleDateString('en-US')}</div>
                  <div className='p-1'>{application.student.graduation_year}</div>
                  <div className="">{application.research_experience}</div>
                  <div className='p-1'>{application.student.major}</div>
                  <div className='p-1'>{application.hours_per_week}</div>
                  <div className='p-1'>
                    {application.status && (
                      <span className={`rounded-3xl px-4 py-1 bg-light_pink_clr text-sm font-semibold ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>)
                    }
                  </div>
                  <div className="text-left">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/viewJob/${job_id}/viewStudentApplication/${application.application_id}`;
                      }}
                      className="px-4 py-2 bg-orange-300 text-dark_pink_clr rounded text-xs font-medium hover:bg-orange-400"
                    >
                      View Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold mb-2">No Applications Found</h2>
            <p className="text-gray-600 mb-4">
              No students have applied to this position yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default ViewPostedJobs