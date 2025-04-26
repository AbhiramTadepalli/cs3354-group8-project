import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../Components/NavBarStudent";

const TrackApplication = () => {
  const navigate = useNavigate();
  // State to store actual application data from API
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  // Get current student ID from localStorage when component mounts
  useEffect(() => {
    try {
      // Get user object from localStorage
      const userJSON = localStorage.getItem("user");

      if (!userJSON) {
        console.log("No user found in localStorage");
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userJSON);
      console.log("User from localStorage:", user);

      // For students, we need the student_id field (not user_id)
      // student_id is stored in the merged userDetails object during login
      const studentId = user.student_id;
      console.log("Found student ID:", studentId);

      if (!studentId) {
        console.warn("No student ID found in user data");
        // Use fallback for testing if needed
        setCurrentStudentId(1);
      } else {
        setCurrentStudentId(studentId);
      }
    } catch (error) {
      console.error("Error retrieving student ID:", error);
      setIsLoading(false);
    }
  }, []);

  // Fetch applications when student ID is available
  useEffect(() => {
    if (!currentStudentId) return; // Don't fetch if no student ID

    const fetchStudentApplications = async () => {
      try {
        console.log(
          `Fetching applications for student ID: ${currentStudentId}`
        );

        const applicationsResponse = await fetch(
          `http://localhost:5002/GET/JobApplication/student?student_id=${currentStudentId}`
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
              `http://localhost:5002/GET/Job/one?job_id=${application.job_id}`
            );

            if (!jobResponse.ok) {
              throw new Error(`HTTP error! status: ${jobResponse.status}`);
            }

            const jobData = await jobResponse.json();
            console.log(`Job details for job ${application.job_id}:`, jobData);

            // Fetch professor details if professor_id exists
            let professorName = "Unknown";
            if (jobData[0] && jobData[0].professor_id) {
              try {
                const requestParams = { professor_id: jobData[0].professor_id };
                const queryParams = new URLSearchParams(
                  requestParams
                ).toString();

                const professorResponse = await fetch(
                  `http://localhost:5002/GET/Professor/one?${queryParams}`
                );

                if (professorResponse.ok) {
                  const professorData = await professorResponse.json();
                  if (professorData[0]) {
                    professorName = `${professorData[0].first_name} ${professorData[0].last_name}`;
                  }
                }
              } catch (error) {
                console.error("Error fetching professor data:", error);
              }
            }

            // Format the date properly
            const applicationDate =
              application.submission_date ||
              application.application_date ||
              application.created_at;
            const formattedDate = applicationDate
              ? new Date(applicationDate).toLocaleDateString()
              : "Not recorded";

            // Combine job and application data
            enhancedApplications.push({
              id: application.application_id,
              jobId: application.job_id,
              jobTitle: jobData[0]?.job_title || "Unknown Position",
              lab: jobData[0]?.lab_name || "Unknown Lab",
              professor: professorName,
              dateApplied: formattedDate,
              status: application.status || "Applied",
            });
          } catch (error) {
            console.error(
              `Error fetching job details for job ${application.job_id}:`,
              error
            );
          }
        }

        setApplications(
          enhancedApplications.length > 0 ? enhancedApplications : []
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student applications:", error);
        setApplications([]);
        setIsLoading(false);
      }
    };

    fetchStudentApplications();
  }, [currentStudentId]);

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
        ) : applications.length > 0 ? (
          /* Applications Table */
          <div className="bg-white rounded-lg overflow-hidden shadow">
            {/* Table Header */}
            <div className="grid grid-cols-7 bg-white p-4 border-b text-sm font-medium text-gray-600">
              <div>Job Title</div>
              <div>Lab</div>
              <div>Professor</div>
              <div>ID</div>
              <div>Applied On</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {/* Table Body */}
            <div className="bg-orange-200">
              {applications.map((app, index) => (
                <div
                  key={index}
                  className="grid grid-cols-7 p-3 border-b border-orange-300 items-center"
                >
                  <div>{app.jobTitle}</div>
                  <div>{app.lab}</div>
                  <div>{app.professor}</div>
                  <div>{app.id}</div>
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
                    <button
                      className="px-3 py-1 bg-orange-300 text-pink-500 rounded-md text-xs font-medium"
                      onClick={() =>
                        navigate(
                          `/applyToPosition/${app.jobId}?view=true&applicationId=${app.id}`
                        )
                      }
                    >
                      View Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No applications message */
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold mb-2">No Applications Found</h2>
            <p className="text-gray-600 mb-4">
              You haven't applied to any positions yet.
            </p>
            <a
              href="/searchPage"
              className="inline-block px-4 py-2 bg-orange-300 text-black rounded-md hover:bg-orange-400"
            >
              Browse Positions
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;
