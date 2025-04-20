import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../../Components/NavBarStudent";
import { requestToUrl } from "../../../modules/requestHelpers";

const ApplyToPosition = () => {
  // Get jobId from URL parameters
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in view mode
  const params = new URLSearchParams(location.search);
  const isViewMode = params.get("view") === "true";
  const applicationId = params.get("applicationId");

  // State for job details and loading state
  const [jobDetails, setJobDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [professor, setProfessor] = useState(null);

  // State to manage form data
  const [formData, setFormData] = useState({
    research_experience: "",
    hours_per_week: "",
    basic_student_response: "",
    resume_link: "",
  });

  // Function to fetch professor details by ID
  const fetchProfessorById = async (professorId) => {
    try {
      // Create the request object
      const requestParams = { professor_id: professorId };

      // Use the requestToUrl function to convert the request object to URL parameters
      const queryParams = requestToUrl(requestParams);

      // Make a GET request with query parameters in the URL
      const response = await fetch(
        `http://localhost:5002/GET/Professor/one${queryParams}`
      );

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

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError("No job ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get all jobs from the valid endpoint
        const response = await fetch("http://localhost:5002/GET/Job/valid");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allJobs = await response.json();

        // Find the job with matching ID
        const foundJob = allJobs.find((job) => job.job_id.toString() === jobId);

        if (!foundJob) {
          throw new Error(`Job with ID ${jobId} not found`);
        }

        // Fetch professor info if professor_id exists
        if (foundJob.professor_id) {
          const professorData = await fetchProfessorById(foundJob.professor_id);
          if (professorData) {
            console.log("Professor data:", professorData);
            setProfessor(professorData);
          }
        }

        // Transform job data to match expected format
        setJobDetails({
          jobID: foundJob.job_id,
          jobTitle: foundJob.job_title || "Research Position",
          professorId: foundJob.professor_id, // Keep the ID for reference if needed
          labName: foundJob.lab_name || "Lab Name",
          deadline: foundJob.application_deadline || "Not specified",
          description: foundJob.job_description || "No description available",
          hoursPerWeek: foundJob.hours || "Not specified",
          term: foundJob.term || "Not specified",
          room: foundJob.location || "Not specified",
          compensation: foundJob.compensation || "Not specified",
          status: foundJob.status || "unknown", // Add this line to store the job status
          requirements:
            [
              foundJob.req_majors,
              foundJob.req_grade_level,
              foundJob.req_skills,
            ].filter(Boolean) || [],
        });

        setIsLoading(false);
      } catch (error) {
        setError(`Failed to load job details: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Fetch current student ID from localStorage when component mounts
  useEffect(() => {
    try {
      // Get user object from localStorage
      const userJSON = localStorage.getItem("user");

      if (!userJSON) {
        console.log("No user found in localStorage");
        return;
      }

      const user = JSON.parse(userJSON);
      console.log("User from localStorage:", user);

      // For students, we need the student_id field (not user_id)
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
    }
  }, []);

  // Add function to fetch application details
  const fetchApplicationDetails = async (appId) => {
    try {
      const response = await fetch(
        `http://localhost:5002/GET/JobApplication/one?application_id=${appId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched application data:", data);

      if (data && data[0]) {
        const application = data[0];
        console.log("Application details:", application);

        // Parse documents_json if it exists
        let resumeLink = "";

        if (application.documents_json) {
          try {
            // It could be a string or already an object
            const documentsObj =
              typeof application.documents_json === "string"
                ? JSON.parse(application.documents_json)
                : application.documents_json;

            console.log("Documents object:", documentsObj);

            if (documentsObj && documentsObj.resume) {
              resumeLink = documentsObj.resume;
              console.log("Found resume link:", resumeLink);
            }
          } catch (e) {
            console.error("Error parsing documents_json:", e);
          }
        }

        // Set form data with application details
        setFormData({
          research_experience: application.research_experience || "",
          hours_per_week: application.hours_per_week || "",
          basic_student_response: application.basic_student_response || "",
          resume_link: resumeLink,
        });

        console.log("Updated form data:", {
          research_experience: application.research_experience || "",
          hours_per_week: application.hours_per_week || "",
          basic_student_response: application.basic_student_response || "",
          resume_link: resumeLink,
        });
      }

      return data[0];
    } catch (err) {
      console.error(`Error fetching application ID ${appId}:`, err);
      return null;
    }
  };

  // Add new useEffect for fetching application details when in view mode
  useEffect(() => {
    if (isViewMode && applicationId) {
      fetchApplicationDetails(applicationId);
    }
  }, [isViewMode, applicationId]);

  // Handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert form data to JSON for submission
    const submitData = {
      job_id: parseInt(jobDetails.jobID) || 1,
      student_id: currentStudentId || 1, // Use the retrieved student ID or default to 1 if not found
      research_experience: parseInt(formData.research_experience) || 0,
      hours_per_week: parseInt(formData.hours_per_week) || 0,
      basic_student_response: formData.basic_student_response || "",
      status: "Applied",
      documents_json: JSON.stringify({ resume: formData.resume_link || "" }),
    };

    try {
      const url = `http://localhost:5002/POST/JobApplication/add`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert(
        `Application submitted successfully! Application ID: ${
          result.message.split(" ")[2]
        }`
      );

      // Redirect to track applications page after submission
      navigate("/trackApplication");
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background_clr p-6">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background_clr p-6">
        <NavBar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background_clr p-6">
      {/* Navigation bar */}
      <NavBar />

      {/* Main content with job details */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Job details card */}
        <div className="bg-gray-200 rounded-md p-6 mb-6">
          <h1 className="text-xl font-bold">{jobDetails.jobTitle}</h1>
          <p className="mb-1">
            Professor:{" "}
            {professor
              ? `${professor.first_name} ${professor.last_name}`
              : `Professor ID: ${jobDetails.professorId}`}{" "}
            | Lab: {jobDetails.labName}
          </p>
          <p className="mb-2">
            <strong>Deadline: {jobDetails.deadline}</strong>
          </p>
          <p className="mb-4">{jobDetails.description}</p>

          <div className="mb-4">
            <p className="font-bold mb-1">Hours: {jobDetails.hoursPerWeek}</p>
            <p className="font-bold mb-1">Term: {jobDetails.term}</p>
            <p className="font-bold mb-1">Room: {jobDetails.room}</p>
            <p className="font-bold mb-1">
              Compensation: {jobDetails.compensation}
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-1">Requirements</h2>
            <ul className="list-disc ml-6">
              {jobDetails.requirements && jobDetails.requirements.length > 0 ? (
                jobDetails.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))
              ) : (
                <li>No specific requirements listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Application form - Check job status before allowing application */}
        {!isViewMode &&
        jobDetails.status &&
        jobDetails.status.toLowerCase() === "filled" ? (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Position Filled
            </h2>
            <p className="mb-4">
              This position is no longer accepting applications.
            </p>
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4">
              <p>
                This position has been filled and is not accepting any new
                applications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/jobPostings")}
              className="bg-orange-200 text-black px-6 py-2 rounded-md hover:bg-orange-300 transition"
            >
              Back to Job Listings
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-md shadow-md"
          >
            <h2 className="text-xl font-bold mb-4">
              {isViewMode ? "Application Details" : "Application Form"}
            </h2>

            {/* Research experience input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="research_experience"
              >
                Research Experience (number of semesters)
              </label>
              <input
                type="number"
                id="research_experience"
                name="research_experience"
                value={formData.research_experience}
                onChange={handleChange}
                min="0"
                className={`w-full p-2 border rounded-md ${
                  isViewMode ? "bg-gray-100" : ""
                }`}
                required
                disabled={isViewMode}
              />
            </div>

            {/* Available hours input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="hours_per_week"
              >
                Available Hours Per Week
              </label>
              <input
                type="number"
                id="hours_per_week"
                name="hours_per_week"
                value={formData.hours_per_week}
                onChange={handleChange}
                min="1"
                max="40"
                className={`w-full p-2 border rounded-md ${
                  isViewMode ? "bg-gray-100" : ""
                }`}
                required
                disabled={isViewMode}
              />
            </div>

            {/* Student response textarea */}
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="basic_student_response"
              >
                Describe your skills, how you can contribute to this lab, and
                your interest in this position
              </label>
              <textarea
                id="basic_student_response"
                name="basic_student_response"
                value={formData.basic_student_response}
                onChange={handleChange}
                rows="6"
                className={`w-full p-2 border rounded-md ${
                  isViewMode ? "bg-gray-100" : ""
                }`}
                placeholder="Please describe your relevant skills and experience, how you can contribute to this lab, and why you are interested in this position..."
                required
                disabled={isViewMode}
              />
            </div>

            {/* Resume link input */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="resume_link">
                Resume Link
              </label>
              <input
                type="url"
                id="resume_link"
                name="resume_link"
                value={formData.resume_link}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  isViewMode ? "bg-gray-100" : ""
                }`}
                placeholder="Enter the link to your resume"
                required
                disabled={isViewMode}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={() => navigate("/trackApplication")}
                  className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Back to Applications
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-orange-200 text-black px-6 py-2 rounded-md hover:bg-orange-300 transition"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyToPosition;
