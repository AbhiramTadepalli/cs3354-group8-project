//Nishant Bhagat
import React from 'react';
import NavBarProfessor from '../../../Components/NavBarProfessor'; 

const ViewStudentResponse = () => {
  const [showResume, setShowResume] = React.useState(false);

  const toggleResume = () => {
    setShowResume(!showResume);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBarProfessor />
      <main className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex">
            <div className="w-1/3 bg-orange-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Name</h2>
              <p className="text-gray-600">Graduation</p>
              <p className="text-gray-600">Major</p>
              <button
                onClick={toggleResume}
                className='text-blue-600 underline focus:outline-none'
              >
                {showResume ? 'Hide Resume' : 'View Resume'}
              </button>
            </div>
            <div className="w-2/3 pl-6">
              <h3 className="text-md font-semibold">Question 1</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
              <h3 className="text-md font-semibold mt-4">Question 2</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
            </div>
          </div>
          {showResume && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Resume Placeholder</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-semibold">Personal Information</h4>
                  <p className="text-gray-600">Name: John Doe</p>
                  <p className="text-gray-600">Email: johndoe@example.com</p>
                  <p className="text-gray-600">Phone: (123) 456-7890</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold">Education</h4>
                  <p className="text-gray-600">Bachelor of Science in Computer Science</p>
                  <p className="text-gray-600">University of Texas at Dallas, May 2027</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold">Experience</h4>
                  <p className="text-gray-600">Software Engineering Intern</p>
                  <p className="text-gray-600">Tech Company, Summer 2024</p>
                  <p className="text-gray-600">
                    - Developed features for a web application using React and Node.js.
                  </p>
                  <p className="text-gray-600">
                    - Collaborated with a team to improve application performance.
                  </p>
                </div>
                <div>
                  <h4 className="text-md font-semibold">Skills</h4>
                  <p className="text-gray-600">JavaScript, React, Python, Java</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-green-100 text-green-800 px-6 py-2 rounded-lg hover:bg-green-200">
              Accept
            </button>
            <button className="bg-red-100 text-red-800 px-6 py-2 rounded-lg hover:bg-red-200">
              Reject
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewStudentResponse