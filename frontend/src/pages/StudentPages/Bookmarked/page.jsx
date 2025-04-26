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
  <div className="min-h-screen bg-red-50 p-8">
    {/* Top Navigation */}
    <NavBarStudent />

    <div className="mt-16 px-6">
      <h1 className="text-4xl font-bold mb-6">Bookmarked Posts</h1>
      {bookmarkedJobs.length > 0 ? (
        <div className="bg-white rounded-lg overflow-hidden shadow">
          {/* Table Header */}
          <div className="grid grid-cols-7 bg-white p-4 border-b text-sm font-medium text-gray-600">
            <div>Job Title</div>
            <div>Lab</div>
            <div>Professor</div>
            <div>Post ID</div>
            <div>Date Posted</div>
            <div>Action</div>
            <div>Bookmark</div>
          </div>

          {/* Table Body */}
          <div className="bg-orange-200">
            {bookmarkedJobs.map((bookmark) => (
              <div
                key={bookmark.job_id}
                className="grid grid-cols-7 p-3 border-b border-orange-300 items-center"
              >
                <div>{bookmark.job_title}</div>
                <div>{bookmark.lab_name}</div>
                <div>{bookmark.professorName}</div>
                <div>{bookmark.job_id}</div>
                <div>
                  {new Date(bookmark.created_at).toLocaleDateString('en-US')}
                </div>
                <div>
                  <button
                    onClick={() => navigate(`/jobDetails/${bookmark.job_id}`)}
                    className="px-3 py-1 bg-orange-300 text-pink-500 rounded-md text-xs font-medium"
                  >
                    View Post
                  </button>
                </div>
                <div
                  onClick={(e) => toggleBookmark(e, bookmark.job_id)}
                  className="cursor-pointer flex justify-start"
                >
                  {bookmark.bookmarked ? (
                    <FaBookmark className="text-xl text-pink-600" />
                  ) : (
                    <FiBookmark className="text-xl" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-2">No Bookmarks Found</h2>
          <p className="text-gray-600 mb-4">
            You haven't bookmarked any posts yet.
          </p>
          <a
            href="/searchPage"
            className="inline-block px-4 py-2 bg-orange-300 text-black rounded-md hover:bg-orange-400"
          >
            Browse Positions
          </a>
        </div>
      )}
    </div>
  </div>
);

};


export default Bookmarked;