import React from 'react'
import NavBarStudent from "../../../Components/NavBarStudent";

const ViewPostedJobs = () => {

  const dummyApplications = [
    {
      appID: "",
      profilePicUrl: "",
      dateApplied: "04/02/2025",
      student: 'Hank Pym',
      graduation: 'Fall 2025',
      exp: '2 semesters',
      major: 'Computer Science',
      weeklyHours: '5 hrs',
      status: "Applied",
      link: '/app_id'
    },
    {
      appID: "",
      profilePicUrl: "",
      dateApplied: "03/22/2025",
      student: 'Peter Parker',
      graduation: 'Fall 2026',
      exp: '1 semester',
      major: 'Data Science',
      weeklyHours: '4 hrs',
      status: "Review",
      link: '/app_id'
    },
    {
      appID: "",
      profilePicUrl: "",
      dateApplied: "04/05/2025",
      student: 'Sandy Cooper',
      graduation: 'Spring 2025',
      exp: 'None',
      major: 'Mathematics',
      weeklyHours: '2 hrs',
      status: "Accepted",
      link: '/app_id'
    },
  ];


  return (
    <>
      <NavBarStudent></NavBarStudent>
      <div className="pb-8 pl-8 pr-8">
        <h1 className="text-4xl font-bold mb-4">Job #1 Name - Research Assistant Applications</h1>
        <h3 className="text-xl font-semibold text-gray-500 mb-4">#123456 — Posted on: MM/DD/YYYY — 8 Applications </h3>

        <table className="w-full border-separate border-spacing-y-3 px-12">
          <thead>
            {/* Table header */}
            <tr className="text-sm text-gray-600">
              {/* Table header column names */}
              <th className="pl-2 w-12"></th>
              <th className="text-center w-32">Student</th>
              <th className="text-center w-32">Date Applied</th>
              <th className="text-center w-32">Graduation</th>
              <th className="text-center w-32">Research Experience</th>
              <th className="text-center w-32">Major</th>
              <th className="text-center w-32">Hours Per Week</th>
              <th className="text-center w-32">Status</th>
              <th className="text-center w-32"></th> {/* Blank column header, but columns have a button/hyperlink */}
            </tr>
          </thead>
          <tbody className="bg-orange_clr">
            {/* Posted Jobs */}
            {dummyApplications.map((application) => (
              /* Each row is a Student Application for the Job */
              <tr key={application.appID} className="text-lg text-center border-b">
                <td className="p-2 text-center">
                  <img
                    src={application.profilePicUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-2">{application.student}</td>
                <td className="p-2">{application.dateApplied}</td>
                <td className="p-2">{application.graduation}</td>
                <td className="p-2 text-sm">{application.exp}</td>
                <td className="p-2">{application.major}</td>
                <td className="p-2">{application.weeklyHours}</td>
                <td className="flex justify-center items-center p-2">
                  <div className='rounded rounded-3xl w-fit p-2 px-4 bg-light_pink_clr'>
                    {application.status}
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

export default ViewPostedJobs