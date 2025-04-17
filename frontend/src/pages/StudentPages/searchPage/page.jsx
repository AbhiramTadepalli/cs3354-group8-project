import React, { useState, useEffect } from 'react'
import { FiChevronDown, FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import NavBar from '../../../Components/NavBarStudent';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { requestToUrl } from '../../../modules/requestHelpers'; // Import the helper function

const SearchPage = () => {
  const [listings, setListings] = useState([]);
  const [professors, setProfessors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch professor details by ID
  const fetchProfessorById = async (professorId) => {
    try {
      // Create the request object
      const requestParams = { professor_id: professorId };
      
      // Use the requestToUrl function to convert the request object to URL parameters
      const queryParams = requestToUrl(requestParams);
      
      // Make a GET request with query parameters in the URL
      const response = await fetch(`http://localhost:5002/GET/Professor/one${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0]; // Assuming it returns an array with a single professor
    } catch (err) {
      console.error(`Error fetching professor ID ${professorId}:`, err);
      return null;
    }
  };

  // Function to get professor name
  const getProfessorName = (professorId) => {
    if (!professorId) return 'Unknown Professor';
    
    const professor = professors[professorId];
    if (!professor) return `Professor ${professorId}`;
    
    return `${professor.first_name || ''} ${professor.last_name || ''}`.trim() || `Professor ${professorId}`;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5002/GET/Job/valid');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Transform the data to include the bookmarked property
        const jobsWithBookmarkStatus = data.map(job => ({
          ...job,
          bookmarked: JSON.parse(localStorage.getItem("bookmarked_jobs"))?.includes(job.job_id) || false
        }));
        
        setListings(jobsWithBookmarkStatus);
        
        // Fetch professor details for each job
        const uniqueProfessorIds = [...new Set(data.map(job => job.professor_id))];
        const professorData = {};
        
        for (const professorId of uniqueProfessorIds) {
          if (professorId) {
            const professor = await fetchProfessorById(professorId);
            if (professor) {
              professorData[professorId] = professor;
            }
          }
        }
        
        setProfessors(professorData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job listings');
        setLoading(false);
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, []);

  const toggleBookmark = (e, id) => {
    // Stop the click event from bubbling up to the parent Link
    e.stopPropagation();
    e.preventDefault();
    
    setListings(listings.map(listing => 
      {
        if (listing.job_id === id) {
          if (!listing.bookmarked) {
            // add bookmark to localstorage
            let bookmarkedJobs = JSON.parse(localStorage.getItem("bookmarked_jobs")) ?? []
            console.log("bookmarked_jobs = ", bookmarkedJobs)
            bookmarkedJobs.push(listing.job_id)
            localStorage.setItem("bookmarked_jobs", JSON.stringify(bookmarkedJobs));
          } else {
            // remove bookmark from localstorage
            let bookmarkedJobs = JSON.parse(localStorage.getItem("bookmarked_jobs")) ?? []
            console.log("bookmarked_jobs = ", bookmarkedJobs)
            bookmarkedJobs = bookmarkedJobs.filter(jobId => jobId !== listing.job_id)
            localStorage.setItem("bookmarked_jobs", JSON.stringify(bookmarkedJobs));
          }
          return { ...listing, bookmarked: !listing.bookmarked }
        }
        return listing
      }
    ));
  };

  if (loading) return <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center">Loading job listings...</div>;
  if (error) return <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background_clr p-6">
      {/* Header with logo, search, and navigation */}
      <NavBar/>
      {/* Main content */}
      <div className="flex mt-8 pl-6 pr-6">
        {/* Filters sidebar */}
        <div className="w-40 mr-6">
          <h2 className="text-2xl mb-4">Filters</h2>
          <div className="space-y-3">
            <div className="relative">
              <button className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded">
                <span>Major</span>
                <FiChevronDown />
              </button>
            </div>
            <div className="relative">
              <button className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded">
                <span>Professor</span>
                <FiChevronDown />
              </button>
            </div>
            <div className="relative">
              <button className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded">
                <span>Term</span>
                <FiChevronDown />
              </button>
            </div>
            <div className="relative">
              <button className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded">
                <span>Job Title</span>
                <FiChevronDown />
              </button>
            </div>
          </div>
        </div>
        {/* Research listings */}
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <div className="relative">
              <button className="flex items-center bg-dark_pink_clr text-white px-6 py-2 rounded-full">
                <span>Sort By</span>
                <FiChevronDown className="ml-2" />
              </button>
            </div>
          </div>
          {/* Research cards */}
          <div className="space-y-4">
            {listings.length > 0 ? (
              listings.map((listing) => (
                // Wrap the div with Link component to make it clickable
                <Link 
                  key={listing.job_id}
                  to={`/jobDetails/${listing.job_id}`}
                  className="block"
                >
                  <div className="bg-orange_clr p-4 rounded hover:bg-orange-400 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">{listing.job_title || 'Job Title'}</h3>
                        <p>
                          {getProfessorName(listing.professor_id)}
                          {listing.lab_name ? ` | ${listing.lab_name}` : ''}
                        </p>
                      </div>
                      <div 
                        onClick={(e) => toggleBookmark(e, listing.job_id)} 
                        className="cursor-pointer"
                      >
                        {listing.bookmarked ?
                          <FaBookmark className="text-xl text-dark_pink_clr" /> :
                          <FiBookmark className="text-xl" />
                        }
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">No job listings available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage