import React, { useState, useRef } from "react";
import { FiSearch, FiPaperclip } from "react-icons/fi";
import NavBar from "../../../Components/NavBarStudent";

const ApplyToPosition = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    research_experience: "",
    hours_per_week: "",
    basic_student_response: "",
  });
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append("research_experience", formData.research_experience);
    submitData.append("hours_per_week", formData.hours_per_week);
    submitData.append(
      "basic_student_response",
      formData.basic_student_response
    );

    if (resumeFile) {
      submitData.append("resume", resumeFile);
    }

    console.log("Form submitted:", formData);
    console.log("Resume file:", resumeFile);
    // Here you would make your API call to submit the form data and file
    // axios.post('/api/submit-application', submitData)
  };
  return (
    <div className="min-h-screen bg-background_clr p-6">
      <NavBar />

      {/* Main content area */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Job details card */}
        <div className="bg-gray-200 rounded-md p-6 mb-6">
          <h1 className="text-xl font-bold">
            Research Assistant - Machine Learning Lab
          </h1>
          <p className="mb-1">
            Professor: Dr. John Doe | Lab: Computer Science Laboratory
          </p>
          <p className="mb-2">
            <strong>Deadline: April 1, 2025</strong>
          </p>

          <p className="mb-4">
            As a Machine Learning Research Assistant, you will support the
            development and evaluation of machine learning models by assisting
            with data preprocessing, feature engineering, and model
            experimentation. Your responsibilities may include collecting and
            cleaning large datasets, implementing and optimizing algorithms, and
            running experiments to compare different model architectures. You
            will work closely with researchers and faculty members to analyze
            results, interpret findings, and document methodologies for research
            publications. Additionally, you may contribute to developing tools
            or frameworks that facilitate model deployment and scalability.
            Strong programming skills in Python, experience with ML libraries
            such as TensorFlow or PyTorch, and familiarity with statistical
            methods are essential for this role.
          </p>

          <div className="mb-4">
            <p className="font-bold mb-1">Hours: 10-15 hours per week</p>
            <p className="font-bold mb-1">Term: Spring 2025</p>
            <p className="font-bold mb-1">Room: ECCS 4.424</p>
            <p className="font-bold mb-1">Compensation: $15/hr</p>
          </div>

          <div>
            <h2 className="font-bold mb-1">Requirements</h2>
            <ul className="list-disc ml-6">
              <li>Junior or Senior standing</li>
              <li>Minimum GPA of 3.0</li>
              <li>Coursework in Machine Learning and Databases</li>
              <li>
                Proficiency in Python (NumPy, Pandas, Scikit-learn, TensorFlow,
                PyTorch)
              </li>
              <li>
                Experience with data preprocessing, feature engineering, and
                model training
              </li>
              <li>
                Knowledge of deep learning architectures (CNNs, RNNs,
                Transformers, etc.)
              </li>
              <li>
                Familiarity with natural language processing (NLP) or computer
                vision is a plus
              </li>
              <li>
                Ability to implement, fine-tune, and evaluate ML models using
                industry-standard tools
              </li>
            </ul>
          </div>
        </div>

        {/* Application form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">Application Form</h2>

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

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Resume</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                />
                <button
                  type="button"
                  onClick={handleAttachClick}
                  className="bg-orange-300 px-4 py-2 rounded-md hover:bg-orange-400 transition flex items-center"
                >
                  <FiPaperclip className="mr-2" />
                  Attach Resume
                </button>
                {resumeFile && (
                  <span className="ml-3 text-gray-600">{resumeFile.name}</span>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit Application
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ApplyToPosition;
