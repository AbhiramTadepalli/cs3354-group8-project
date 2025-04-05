import React from 'react'
import NavBarStudent from "../../../Components/NavBarStudent";

const TrackApplication = () => {

  const dummyStudentApplications = [
    {
      profilePicUrl: "",
      jobTitle: 'Job #1',
      lab: 'C.O.M.E.T. Lab',
      professor: 'Dr. Jane Doe',
      postID: '123456',
      role: 'Research Assistant',
      dateApplied: '04/05/2025',
      status: 'Applied',
      link: 'google.com'
    },
    {
      profilePicUrl: "",
      jobTitle: 'Job #2',
      lab: 'White\'s Lab',
      professor: 'Dr. Walter White',
      postID: '123457',
      role: 'Undergraduate Research Assistant',
      dateApplied: '04/03/2025',
      status: 'Draft',
      link: 'google.com'
    },
    {
      profilePicUrl: "",
      jobTitle: 'Job #3',
      lab: 'OSCORP',
      professor: 'Dr. Norman Osborne',
      postID: '123457',
      role: 'Something of a Scientist',
      dateApplied: '04/07/2025',
      status: 'Accepted',
      link: 'google.com'
    },
  ];


  return (
    <>
      <NavBarStudent></NavBarStudent>
      <div className="pb-8 pl-8 pr-8">
        <h1 className="text-4xl font-bold mb-4">Track Applications</h1>

        <table className="w-full border-separate border-spacing-y-3 px-12">
          <thead>
            {/* Table header */}
            <tr className="text-sm text-gray-600">
              {/* Table header column names */}
              <th className="pl-2 w-12"></th>
              <th className="text-center w-32">Job Title</th>
              <th className="text-center w-32">Lab</th>
              <th className="text-center w-32">Professor</th>
              <th className="text-center w-20">Job ID</th>
              <th className="text-center w-32">Role</th>
              <th className="text-center w-32">Date Applied</th>
              <th className="text-center w-32">Status</th>
              <th className="text-center w-32"></th> {/* Blank column header, but columns have a button/hyperlink */}
            </tr>
          </thead>
          <tbody className="bg-orange_clr">
            {/* Tracked Applications */}
            {dummyStudentApplications.map((jobApplication) => (
              /* Each row is an application of the student */
              <tr key={jobApplication.postID} className="text-lg text-center border-b">
                <td className="p-2 text-center">
                  <img
                    src={jobApplication.profilePicUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-2">{jobApplication.jobTitle}</td>
                <td className="p-2">{jobApplication.lab}</td>
                <td className="p-2">{jobApplication.professor}</td>
                <td className="p-2">{jobApplication.postID}</td>
                <td className="p-2 text-sm">{jobApplication.role}</td>
                <td className="p-2">{jobApplication.dateApplied}</td>
                <td className="flex justify-center items-center p-2">
                  <div className='rounded rounded-3xl w-fit p-2 px-4 bg-light_pink_clr'>
                    {jobApplication.status}
                  </div>
                </td>
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

export default TrackApplication