import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import NavBar from "../../../Components/NavBarStudent";

const ApplyToPosition = ({ jobDetails }) => {
  // Extract job details with default values
  const {
    jobID = "1",
    jobTitle = "Research Position",
    professorName = "Professor Name",
    labName = "Lab Name",
    deadline = "Not specified",
    description = "No description available",
    hoursPerWeek = "Not specified",
    term = "Not specified",
    room = "Not specified",
    compensation = "Not specified",
    requirements = [],
  } = jobDetails || {};

  // State to manage form data
  const [formData, setFormData] = useState({
    research_experience: "",
    hours_per_week: "",
    basic_student_response: "",
    resume_link: "", // New field for resume link
  });

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
      job_id: jobID,
      student_id: "1",
      research_experience: formData.research_experience,
      hours_per_week: formData.hours_per_week,
      basic_student_response: formData.basic_student_response,
      status: "Applied",
      documents_json: JSON.stringify({
        resume: formData.resume_link, // Store the link in documents_json
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
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background_clr p-6">
      {/* Navigation bar */}
      <NavBar />

      {/* Main content with job details */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Job details card - No changes */}
        <div className="bg-gray-200 rounded-md p-6 mb-6">
          {/* Existing job details section */}
          <h1 className="text-xl font-bold">{jobTitle}</h1>
          <p className="mb-1">
            Professor: {professorName} | Lab: {labName}
          </p>
          <p className="mb-2">
            <strong>Deadline: {deadline}</strong>
          </p>

          <p className="mb-4">{description}</p>

          <div className="mb-4">
            <p className="font-bold mb-1">Hours: {hoursPerWeek}</p>
            <p className="font-bold mb-1">Term: {term}</p>
            <p className="font-bold mb-1">Room: {room}</p>
            <p className="font-bold mb-1">Compensation: {compensation}</p>
          </div>

          <div>
            <h2 className="font-bold mb-1">Requirements</h2>
            <ul className="list-disc ml-6">
              {requirements.length > 0 ? (
                requirements.map((req, index) => <li key={index}>{req}</li>)
              ) : (
                <li>No specific requirements listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Application form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">Application Form</h2>

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
