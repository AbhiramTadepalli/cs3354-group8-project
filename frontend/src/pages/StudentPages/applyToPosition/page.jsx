import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import NavBar from "../../../Components/NavBarStudent";

const ApplyToPosition = () => {
  // Get jobId from URL parameters
  const { jobId } = useParams();
  const navigate = useNavigate();

  // State for job details and loading state
  const [jobDetails, setJobDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage form data
  const [formData, setFormData] = useState({
    research_experience: "",
    hours_per_week: "",
    basic_student_response: "",
    resume_link: "",
  });

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
        const response = await fetch(
          `http://localhost:5002/GET/Job/one?jobID=${jobId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jobData = await response.json();
        console.log("Job details:", jobData);

        // Transform job data to match expected format
        setJobDetails({
          jobID: jobData.jobID,
          jobTitle: jobData.jobTitle || "Research Position",
          professorName: jobData.professorName || "Professor Name",
          labName: jobData.labName || "Lab Name",
          deadline: jobData.applicationDeadline || "Not specified",
          description: jobData.jobDescription || "No description available",
          hoursPerWeek: jobData.hours || "Not specified",
          term: jobData.term || "Not specified",
          room: jobData.room || "Not specified",
          compensation: jobData.compensation || "Not specified",
          requirements: jobData.requirements
            ? [
                jobData.reqMajors,
                jobData.reqGradeLevel,
                jobData.reqSkills,
              ].filter(Boolean)
            : [],
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError(`Failed to load job details: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

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
      job_id: jobDetails.jobID,
      student_id: "1", // You might want to get this from authentication context
      research_experience: formData.research_experience,
      hours_per_week: formData.hours_per_week,
      basic_student_response: formData.basic_student_response,
      status: "Applied",
      documents_json: JSON.stringify({
        resume: formData.resume_link,
      }),
    };

    console.log("Form submitted:", formData);
    console.log("Submit data:", submitData);

    try {
      const response = await fetch(
        "http://localhost:5002/POST/JobApplication/add",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Application submitted successfully:", result);
      alert("Application submitted successfully!");

      // Redirect to track applications page after submission
      navigate("/student/track-applications");
    } catch (error) {
      console.error("Error submitting application:", error);
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
            Professor: {jobDetails.professorName} | Lab: {jobDetails.labName}
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

        {/* Application form - No changes needed here */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">Application Form</h2>

          {/* Form fields remain the same */}
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
              className="w-full p-2 border rounded-md"
              required
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
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Student response textarea */}
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="basic_student_response"
            >
              Describe your skills, how you can contribute to this lab, and your
              interest in this position
            </label>
            <textarea
              id="basic_student_response"
              name="basic_student_response"
              value={formData.basic_student_response}
              onChange={handleChange}
              rows="6"
              className="w-full p-2 border rounded-md"
              placeholder="Please describe your relevant skills and experience, how you can contribute to this lab, and why you are interested in this position..."
              required
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
              className="w-full p-2 border rounded-md"
              placeholder="Enter the link to your resume"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-orange-200 text-black px-6 py-2 rounded-md hover:bg-orange-300 transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyToPosition;
