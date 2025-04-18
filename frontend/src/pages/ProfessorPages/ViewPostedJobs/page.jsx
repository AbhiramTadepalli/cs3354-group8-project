// abhiram tadepalli
import React from 'react'
import NavBarProfessor from "../../../Components/NavBarProfessor";

const ViewPostedJobs = () => {

  const dummyJobPostings = [
    {
      profilePicUrl: "",
      datePosted: "04/02/2025",
      jobTitle: 'Job #1',
      postID: '123456',
      role: 'Research Assistant',
      numApplied: '22',
      numAccepted: '2',
      numRejected: '2',
      link: 'google.com'
    },
    {
      profilePicUrl: "",
      datePosted: "03/22/2025",
      jobTitle: 'Job #2',
      postID: '123457',
      role: 'Teaching Assistant',
      numApplied: '52',
      numAccepted: '22',
      numRejected: '6',
      link: 'google.com'
    },
    {
      profilePicUrl: "",
      datePosted: "04/05/2025",
      jobTitle: 'Job #3',
      postID: '123456',
      role: 'Undergraduate Assistant',
      numApplied: '1',
      numAccepted: '0',
      numRejected: '1',
      link: 'google.com'
    },
  ];


  return (
    <>
      <NavBarProfessor></NavBarProfessor>
      <div className="pb-8 pl-8 pr-8">
        <h1 className="text-4xl font-bold mb-4">View Posted Jobs</h1>

        <table className="w-full border-separate border-spacing-y-3 px-12">
          <thead>
            {/* Table header */}
            <tr className="text-sm text-gray-600">
              {/* Table header column names */}
              <th className="pl-2 w-12"></th>
              <th className="text-center w-32">Job Title</th>
              <th className="text-center w-32">Date Posted</th>
              <th className="text-center w-32">Job ID</th>
              <th className="text-center w-32">Role</th>
              <th className="text-center w-32">Applied</th>
              <th className="text-center w-32">Accepted</th>
              <th className="text-center w-32">Rejected</th>
              <th className="text-center w-32"></th> {/* Blank column header, but columns have a button/hyperlink */}
            </tr>
          </thead>
          <tbody className="bg-orange_clr">
            {/* Posted Jobs */}
            {dummyJobPostings.map((job) => (
              /* Each row is a Job the professor has posted */
              <tr key={job.postID} className="text-lg text-center border-b">
                <td className="p-2 text-center">
                  <img
                    src={job.profilePicUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-2">{job.jobTitle}</td>
                <td className="p-2">{job.datePosted}</td>
                <td className="p-2">{job.postID}</td>
                <td className="p-2 text-sm">{job.role}</td>
                <td className="p-2">{job.numApplied}</td>
                <td className="p-2">{job.numAccepted}</td>
                <td className="p-2">{job.numRejected}</td>
                <td className="p-2 text-right pr-8">
                  <button onClick={() => console.log("navigate")} /* Need to implement navigation logic */
                    className="px-4 py-2 text-dark_pink_clr rounded"
                  >
                    View Applications
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ViewPostedJobs