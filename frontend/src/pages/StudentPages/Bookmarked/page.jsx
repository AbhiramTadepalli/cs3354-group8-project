/* Bookmarked Page by Blend Ahmed */

import React, { useEffect, useState } from 'react';
import NavBarStudent from "../../../Components/NavBarStudent";
import { useNavigate } from 'react-router-dom';
import { requestToUrl } from '../../../modules/requestHelpers';
import { FaBookmark } from 'react-icons/fa';
import { FiBookmark } from 'react-icons/fi';


const Bookmarked = () => {
  const navigate = useNavigate();
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]); // State to hold Bookmarked jobs


  useEffect(() => {
    // Get the list of bookmarked job IDs from localStorage
    const bookmarkedJobIds = JSON.parse(localStorage.getItem("bookmarked_jobs")) ?? [];


    // For each ID, fetch the job data
    const jobFetches = bookmarkedJobIds.map((jobId) => {
      const jobReq = { job_id: jobId };
      return fetch(
        'http://localhost:5002/GET/Job/one' + requestToUrl(jobReq),
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )
        .then((res) => {
          if (!res.ok) throw new Error('Job fetch failed');
          return res.json();
        })
        .then((jobArray) => jobArray[0]); // API returns an array; we want the first element
    });


    // When all job fetches resolve, fetch the corresponding professor for each job
    Promise.all(jobFetches)
      .then((jobs) => {
        const jobWithProfFetches = jobs.map((job) => {
          const profReq = { professor_id: job.professor_id };
          return fetch(
            'http://localhost:5002/GET/Professor/one' + requestToUrl(profReq),
            { method: 'GET', headers: { 'Content-Type': 'application/json' } }
          )
            .then((res) => {
              if (!res.ok) throw new Error('Professor fetch failed');
              return res.json();
            })
            .then((profArray) => profArray[0]) // again, API returns an array
            .then((prof) => ({
              ...job,
              // add a combined fullname property
              professorName: `${prof.first_name} ${prof.last_name}`,
              bookmarked: true,
            }));
        });


        // Wait for all job+professor merges to finish, then set state
        return Promise.all(jobWithProfFetches);
      })
      .then((jobsWithProf) => {
        setBookmarkedJobs(jobsWithProf);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [localStorage.getItem("bookmarked_jobs")]);


const toggleBookmark = (e, id) => {
  // Stop the click event from bubbling up to the parent Link
  e.stopPropagation();
  e.preventDefault();


  // Grab current array of bookmarked IDs
  let bookmarkedIds = JSON.parse(localStorage.getItem("bookmarked_jobs")) ?? [];


  if (bookmarkedIds.includes(id)) {
    // If already bookmarked, remove it
    bookmarkedIds = bookmarkedIds.filter(jobId => jobId !== id);
    localStorage.setItem("bookmarked_jobs", JSON.stringify(bookmarkedIds));
    // Update state by filtering out this job so the row disappears
    setBookmarkedJobs(prev => prev.filter(job => job.job_id !== id));
  } else {
    // If not bookmarked (unlikely on this page), you could add it back
    bookmarkedIds.push(id);
    localStorage.setItem("bookmarked_jobs", JSON.stringify(bookmarkedIds));
    // Optionally re‑fetch or re‑insert the job into state
  }
};




  return (
    <div className="w-screen h-screen bg-red-50 p-8">
      {/* Top Navigation */}
      <NavBarStudent />
      <div className="pb-8 pl-8 pr-8">
        {/* Bookmarked Posts Header */}
        <h1 className="text-4xl font-bold mb-4">Bookmarked Posts</h1>


        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            {/* Header Row for the Table */}
            <tr className="text-sm text-[#555555]">
              {/* Table Header Cells */}
              <th className="pl-2 text-center w-32">Job Title</th>
              <th className="pl-2 text-center w-32">Lab</th>
              <th className="pl-2 text-center w-32">Professor</th>
              <th className="pl-2 text-center w-20">Post ID</th>
              <th className="pl-2 text-center w-32">Date Posted</th>
              <th className="pl-2 w-10"></th>
              <th className="pl-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-[#f6B586]">
            {/* Bookmarked Posts Information */}
            {bookmarkedJobs.map((bookmark) => (
              <tr key={bookmark.job_id} className="text-lg text-center border-b">
                <td className="p-2">{bookmark.job_title}</td>
                <td className="p-2">{bookmark.lab_name}</td>
                <td className="p-2">{bookmark.professorName}</td>
                <td className="p-2">{bookmark.job_title}</td>
                <td className="p-2">
                  {new Date(bookmark.created_at).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  {/* Button to Go to the Bookmarked Post */}
                  <button
                    onClick={() => navigate(`/jobDetails/${bookmark.job_id}`)}
                    className="px-4 py-2 text-[#F14696] rounded"
                  >
                    View Post
                  </button>
                </td>
                {/* Toggle Bookmark Icon */}
                <td
                  onClick={(e) => toggleBookmark(e, bookmark.job_id)}
                  className="cursor-pointer"
                >
                  {bookmark.bookmarked ? (
                    <FaBookmark className="text-xl text-dark_pink_clr" />
                  ) : (
                    <FiBookmark className="text-xl" />
                  )}
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