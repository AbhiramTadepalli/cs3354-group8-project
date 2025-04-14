// Nidhi Majoju
// this is for the use case where students can see the job posting for researwch opportunities

import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import NavBar from '../../../Components/NavBarStudent';

const JobPostingDetails = () => {
  // Sample job data that would be posted
  const job = {
    title: "Job Title",
    professor: "Professor Name",
    lab: "Lab",
    details: "This is the detailed description of the research position. It includes information about the research project, expected duties, and the overall scope of work.",
    requirements: [
      "Background in related field",
      "Strong analytical skills",
      "Programming experience (Python, R, etc.)",
      "Ability to work independently and in a team environment",
      "Good communication skills"
    ],
    contactInfo: "Email: professor@university.edu\nPhone: (123) 456-7890",
    deadline: "Applications due by April 15, 2025",
    readingMaterial: " 'Introduction to Research Methods' and related papers (available upon request)"
  };

  return (
    <div className="min-h-screen bg-background_clr">
      {/* Navbar */}
      <NavBar/>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto">
        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{job.title}</h1>
          <h2 className="text-2xl mb-4">{job.professor} | {job.lab}</h2>
          <div className="border-b border-light_grey_color my-6"></div>
        </div>
        
        {/* Job Content */}
        <div className="flex gap-8">
          {/* Left Column - Job Information */}
          <div className="flex-1">
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4">Details</h3>
              <p className="text-lg">{job.details}</p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Requirements/Qualifications</h3>
              <ul className="list-disc pl-6 text-lg">
                {job.requirements.map((req, index) => (
                  <li key={index} className="mb-2">{req}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Right Column - Contact & Apply */}
          <div className="w-80">
            {/* Contact Information Box */}
            <div className="bg-light_pink_clr p-6 rounded mb-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <p className="whitespace-pre-line mb-8">{job.contactInfo}</p>
              
              <h3 className="text-xl font-semibold mb-4">Deadline</h3>
              <p className="mb-8">{job.deadline}</p>
              
              <h3 className="text-xl font-semibold mb-4">Reading Material</h3>
              <p>{job.readingMaterial}</p>
            </div>
            
            {/* Apply Button */}
            <button className="w-full py-4 bg-orange_clr text-xl font-semibold rounded text-center">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails;