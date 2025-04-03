import React from 'react';
import NavBarStudent from "../../../Components/NavBarStudent";
import { useNavigate } from 'react-router-dom';

const mockBookmarks = [
  {
    id: 1,
    profilePicUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    jobTitle: 'Looking for Research Assistant',
    lab: 'Biology Lab',
    professor: 'Dr. Smith',
    postID: 'RA-101',
    role: 'Research Assistant',
    datePosted: '03/24/2025 11:59:00'
  },
  {
    id: 2,
    profilePicUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    jobTitle: 'Data Analyst',
    lab: 'Computer Science Lab',
    professor: 'Dr. Johnson',
    postID: 'DA-202',
    role: 'Analyst',
    datePosted: '03/25/2025 11:59:00'
  },
  {
    id: 3,
    profilePicUrl: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    jobTitle: 'Lab Assisant Required',
    lab: 'Physics Lab',
    professor: 'Dr. Jones',
    postID: 'RA-303',
    role: 'Lab Assistant',
    datePosted: '03/28/2025 11:59:00'
  },
];


const Bookmarked = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-red-50 p-8">
      {/* Top Navigation */}
      <NavBarStudent />
    
    <div className="pb-8 pl-8 pr-8">
      {/* Bookmarked Posts Header */}
      <h1 className="text-4xl font-bold font-normal mb-4">Bookmarked Posts</h1>

      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          {/* Header row for the table */}
          <tr className="text-sm text-[#555555]">
            {/* Table header cells */}
            <th className="pl-2 w-12"></th>
            <th className="pl-2 text-center w-32">Job Title</th>
            <th className="pl-2 text-center w-32">Lab</th>
            <th className="pl-2 text-center w-32">Professor</th>
            <th className="pl-2 text-center w-20">Post ID</th>
            <th className="pl-2 text-center w-32">Role</th>
            <th className="pl-2 text-center w-32">Date Posted</th>
            <th className="pl-2 w-20"></th>
          </tr>
        </thead>
        <tbody className="bg-[#F6B586]">
          {/* Bookmarked Posts Information */}
          {mockBookmarks.map((bookmark) => (
            <tr key={bookmark.id} className="text-lg text-center border-b">
              <td className="p-2 text-center">
                <img
                  src={bookmark.profilePicUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="p-2">{bookmark.jobTitle}</td>
              <td className="p-2">{bookmark.lab}</td>
              <td className="p-2">{bookmark.professor}</td>
              <td className="p-2">{bookmark.postID}</td>
              <td className="p-2">{bookmark.role}</td>
              <td className="p-2">{bookmark.datePosted}</td>
              <td className="p-2 text-right pr-8">
                <button onClick={() => navigate('../jobPostDetails')}
                  className="px-4 py-2 text-[#F14696] rounded"
                >
                  View Post
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Bookmarked;
