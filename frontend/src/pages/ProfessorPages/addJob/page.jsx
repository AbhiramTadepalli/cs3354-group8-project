import React, { useState } from 'react';
import NavBar from '../../../Components/NavBarProfessor';
import { Link } from 'react-router-dom'; // Make sure to import Link
const AddJob = () => {
  // Update the initial state to include missing fields
const [formData, setFormData] = useState({
    jobTitle: '',
    labName: '',
    jobDescription: '',
    weeklyHours: 0,
    term: '',
    compensation: '',
    requiredMajors: '',
    requiredGradeLevel: '', // Added field
    minimumGPA: '0.0',
    requiredSkills: [],
    applicationDeadline: '',
    readingMaterials: '',
    status: 'open' // Added field with default value
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Get user data from localStorage and parse it to extract professor_id
    let professor_id = '1'; // Default fallback value
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.professor_id) {
          professor_id = parsedUserData.professor_id;
          console.log('Using professor_id:', professor_id);
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    // Format the data for the backend
    const requestData = {
      professor_id: professor_id, // Use the extracted professor_id
      job_title: formData.jobTitle,
      lab_name: formData.labName,
      job_description: formData.jobDescription,
      hours: formData.weeklyHours,
      term: formData.term,
      compensation: formData.compensation || '0',
      req_majors: formData.requiredMajors,
      req_grade_level: formData.requiredGradeLevel,
      req_min_gpa: formData.minimumGPA,
      req_skills: formData.requiredSkills.join(';'),
      application_deadline: formData.applicationDeadline,
      reading_materials: formData.readingMaterials,
      status: formData.status || 'open'
    };
    
    try {
      const response = await fetch('http://localhost:5002/POST/Job/add', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const result = await response.json();
      console.log('Job posting added successfully:', result);
      alert('Job posting added successfully!');
      
      // Navigate to viewPostedJobs page after successful submission
      window.location.href = '/viewPostedJobs';
    } catch (error) {
      console.error('Error adding job posting:', error);
      alert(`Failed to add job posting: ${error.message}`);
    }
  };

  const majorOptions = [
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'electrical_engineering', label: 'Electrical Engineering' },
    { value: 'mechanical_engineering', label: 'Mechanical Engineering'},
    { value: 'biomedical_engineering', label: 'Biomedical Engineering'},
    { value: 'nueroscience', label: 'Neuroscience' },
    { value: 'biology', label: 'Biology' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'physics', label: 'Physics' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'economics', label: 'Economics' }
  ];

  const termOptions = [
    { value: 'summer_2025', label: 'Summer 2025' },
    { value: 'fall_2025', label: 'Fall 2025' },
    { value: 'spring_2026', label: 'Spring 2026' },
    { value: 'summer_2026', label: 'Summer 2026' },
    { value: 'fall_2026', label: 'Fall 2026' },
    { value: 'spring_2027', label: 'Spring 2027' },
    { value: 'summer_2027', label: 'Summer 2027' },
    { value: 'fall_2027', label: 'Fall 2027' },
    { value: 'spring_2028', label: 'Spring 2028' },
    { value: 'summer_2028', label: 'Summer 2028' }
  ];

  const skillOptions = [
    { value: 'programming', label: 'Programming' },
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'lab_work', label: 'Lab Work' },
    { value: 'report_writing', label: 'Report Writing' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'research', label: 'Research' },
    { value: 'experiment_design', label: 'Experiment Design' },
    { value: 'literature_review', label: 'Literature Review' },
    { value: 'public_speaking', label: 'Public Speaking' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'teamwork', label: 'Teamwork' },
    { value: 'scientific_writing', label: 'Scientific Writing' },
    { value: 'excel', label: 'Excel' },
    { value: 'python', label: 'Python' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'machine_learning', label: 'Machine Learning' },
    { value: 'molecular_techniques', label: 'Molecular Techniques' },
    { value: 'microscopy', label: 'Microscopy' }
  ];

  const gpaOptions = [];
  for (let i = 0; i <= 4; i += 0.1) {
    gpaOptions.push({
      value: i.toFixed(1),
      label: i.toFixed(1)
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSkillChange = (skillValue) => {
    const updatedSkills = [...formData.requiredSkills];
    
    // If skill is already selected, remove it; otherwise, add it
    if (updatedSkills.includes(skillValue)) {
      const index = updatedSkills.indexOf(skillValue);
      updatedSkills.splice(index, 1);
    } else {
      updatedSkills.push(skillValue);
    }
    
    setFormData({
      ...formData,
      requiredSkills: updatedSkills
    });
  };


  const handleCancel = () => {
    // Reset form or navigate back
    console.log('Form cancelled');
  };

  return (
    <div className="min-h-screen bg-background_clr">
      {/* Navigation bar */}
      <NavBar />
      
      {/* Title moved higher, outside the main container */}
      <h1 className="text-3xl font-bold text-center mt-6 mb-4">Add Job Posting</h1>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto p-6 pt-0">
        <form className="bg-orange_clr rounded-lg p-6" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="jobTitle" className="font-semibold w-48 py-2">
              Job Title<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="labName" className="font-semibold w-48 py-2">
              Lab Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="labName"
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="jobDescription" className="font-semibold w-48 py-2">
              Job Description<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows="6"
              required
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="weeklyHours" className="font-semibold w-48 py-2">
              Weekly Hours
            </label>
            <input
              type="number"
              id="weeklyHours"
              name="weeklyHours"
              value={formData.weeklyHours}
              onChange={handleChange}
              min="1"
              max="40"
              step="1"
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="term" className="font-semibold w-48 py-2">
              Term
            </label>
            <select
              id="term"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a Term</option>
              {termOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="compensation" className="font-semibold w-48 py-2">
              Compensation
            </label>
            <input
              type="number"
              id="compensation"
              name="compensation"
              value={formData.compensation}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="requiredMajors" className="font-semibold w-48 py-2">
              Required Majors
            </label>
            <select
              id="requiredMajors"
              name="requiredMajors"
              value={formData.requiredMajors}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a Major</option>
              {majorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

        <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="requiredGradeLevel" className="font-semibold w-48 py-2">
                Required Grade Level
            </label>
            <input
                type="text"
                id="requiredGradeLevel"
                name="requiredGradeLevel"
                value={formData.requiredGradeLevel}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="e.g. Freshman, Sophomore, Junior, Senior"
            />
        </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="minimumGPA" className="font-semibold w-48 py-2">
              Minimum GPA
            </label>
            <div className="flex-1 relative">
              <select
                id="minimumGPA"
                name="minimumGPA"
                value={formData.minimumGPA}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                style={{ position: 'relative' }}
              >
                {gpaOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="requiredSkills" className="font-semibold w-48 py-2">
              Required Skills
            </label>
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {skillOptions.map(skill => (
                  <div key={skill.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`skill-${skill.value}`}
                      checked={formData.requiredSkills.includes(skill.value)}
                      onChange={() => handleSkillChange(skill.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`skill-${skill.value}`}>
                      {skill.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="applicationDeadline" className="font-semibold w-48 py-2">
              Application Deadline<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4 flex flex-col md:flex-row">
            <label htmlFor="readingMaterials" className="font-semibold w-48 py-2">
              Reading Materials
            </label>
            <input
              type="text"
              id="readingMaterials"
              name="readingMaterials"
              value={formData.readingMaterials}
              placeholder='Provide link to paper'
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <Link
                to="/viewPostedJobs"
                className="bg-light_grey_color hover:bg-gray-400 py-2 px-6 rounded-md font-medium inline-block">
                Cancel
            </Link>
            <button
                type="submit"
                className="bg-dark_pink_clr hover:bg-pink-600 text-white py-2 px-6 rounded-md font-medium">
                Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;