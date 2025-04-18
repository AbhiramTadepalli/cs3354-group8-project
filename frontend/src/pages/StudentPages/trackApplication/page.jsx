import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import NavBar from "../../../Components/NavBarStudent";

const TrackApplication = () => {
  // State to store actual application data from API
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Original sample data as fallback
  const sampleData = [
    {
      id: "123456",
      jobNumber: "Job #1",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Research Assistant",
      dateApplied: "MM/DD/YYYY",
      status: "Applied",
    },
    {
      id: "123456",
      jobNumber: "Job #2",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Graduate Research Assistant",
      dateApplied: "MM/DD/YYYY",
      status: "Review",
    },
    {
      id: "123456",
      jobNumber: "Job #3",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Research Intern",
      dateApplied: "MM/DD/YYYY",
      status: "Applied",
    },
    {
      id: "123456",
      jobNumber: "Job #4",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Lab Assistant",
      dateApplied: "MM/DD/YYYY",
      status: "Rejected",
    },
    {
      id: "123456",
      jobNumber: "Job #5",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Research Intern",
      dateApplied: "MM/DD/YYYY",
      status: "Accepted",
    },
    {
      id: "123456",
      jobNumber: "Job #6",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Graduate Research Assistant",
      dateApplied: "MM/DD/YYYY",
      status: "Review",
    },
    {
      id: "123456",
      jobNumber: "Job #7",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Research Assistant",
      dateApplied: "MM/DD/YYYY",
      status: "Accepted",
    },
    {
      id: "123456",
      jobNumber: "Job #8",
      lab: "C.O.M.E.T Lab",
      professor: "Dr. Jane Doe",
      role: "Lab Assistant",
      dateApplied: "MM/DD/YYYY",
      status: "Applied",
    },
  ];

  useEffect(() => {
    const fetchStudentApplications = async () => {
      try {
        console.log("Fetching student applications...");

        const applicationsResponse = await fetch(
          "http://localhost:5002/GET/JobApplication/student?studentID=1"
        );

        if (!applicationsResponse.ok) {
          throw new Error(`HTTP error! status: ${applicationsResponse.status}`);
        }

        const applicationData = await applicationsResponse.json();
        console.log("Student applications data:", applicationData);

        const applicationList = applicationData;
        const enhancedApplications = [];

        // For each application, fetch the job details
        for (const application of applicationList) {
          try {
            const jobResponse = await fetch(
              `http://localhost:5002/GET/Job/one?jobID=${application.jobID}`
            );

            if (!jobResponse.ok) {
              throw new Error(`HTTP error! status: ${jobResponse.status}`);
            }

            const jobData = await jobResponse.json();
            console.log(`Job details for job ${application.jobID}:`, jobData);

            // Combine job and application data
            enhancedApplications.push({
              id: application.applicationID,
              jobNumber: `Job #${application.jobID}`,
              lab: jobData.labName || "Unknown",
              professor: jobData.professorName || "Unknown",
              role: jobData.jobTitle || "Unknown",
              dateApplied: new Date(
                application.applicationDate
              ).toLocaleDateString(),
              status: application.applicationStatus || "Applied",
            });
          } catch (error) {
            console.error(
              `Error fetching job details for job ${application.jobID}:`,
              error
            );
          }
        }

        setApplications(
          enhancedApplications.length > 0 ? enhancedApplications : sampleData
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student applications:", error);
        setApplications(sampleData);
        setIsLoading(false);
      }
    };

    fetchStudentApplications();
  }, []);

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-pink-500 text-white";
      case "Review":
        return "bg-purple-500 text-white";
      case "Accepted":
        return "bg-purple-700 text-white";
      case "Rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-background_clr p-6">
      {/* Header with logo, search, and navigation */}
      <NavBar />

      {/* Applications Table Container */}
      <div className="mt-16 px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-lg">Loading applications...</p>
          </div>
        ) : (
          /* Applications Table */
          <div className="bg-white rounded-lg overflow-hidden shadow">
            {/* Table Header */}
            <div className="grid grid-cols-7 bg-white p-4 border-b text-sm font-medium text-gray-600">
              <div>Job Title</div>
              <div>Lab</div>
              <div>Professor</div>
              <div>ID</div>
              <div>Role</div>
              <div>Date Applied</div>
              <div>Status</div>
            </div>

            {/* Table Body */}
            <div className="bg-orange-200">
              {applications.map((app, index) => (
                <div
                  key={index}
                  className="grid grid-cols-8 p-3 border-b border-orange-300 items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span>{app.jobNumber}</span>
                  </div>
                  <div>{app.lab}</div>
                  <div>{app.professor}</div>
                  <div>{app.id}</div>
                  <div>{app.role}</div>
                  <div>{app.dateApplied}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-orange-300 text-pink-500 rounded-md text-xs font-medium">
                      View Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;
