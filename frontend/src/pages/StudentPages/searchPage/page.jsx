import React, { useState, useEffect } from 'react'
import { FiChevronDown, FiBookmark, FiChevronUp } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import NavBar from '../../../Components/NavBarStudent';
import { Link } from 'react-router-dom';
import { requestToUrl } from '../../../modules/requestHelpers';

const SearchPage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [professors, setProfessors] = useState({});
  const [professorOptions, setProfessorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  
  // Dropdown open state
  const [majorOpen, setMajorOpen] = useState(false);
  const [professorOpen, setProfessorOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  
  // Sort state
  const [sortBy, setSortBy] = useState('created_at_desc'); // Default sort by most recent

  // Filter options
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

  // Sort options
  const sortOptions = [
    { value: 'created_at_desc', label: 'Date Posted (Newest First)' },
    { value: 'created_at_asc', label: 'Date Posted (Oldest First)' },
    { value: 'application_deadline_asc', label: 'Application Deadline (Soonest First)' },
    { value: 'application_deadline_desc', label: 'Application Deadline (Latest First)' }
  ];

  // Function to fetch professor details by ID
  const fetchProfessorById = async (professorId) => {
    try {
      const requestParams = { professor_id: professorId };
      const queryParams = requestToUrl(requestParams);
      const response = await fetch(`http://localhost:5002/GET/Professor/one${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0];
    } catch (err) {
      console.error(`Error fetching professor ID ${professorId}:`, err);
      return null;
    }
  };

  // Function to fetch all professors
  const fetchAllProfessors = async () => {
    try {
      const response = await fetch('http://localhost:5002/GET/Professor/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched professors:', data);
      
      // Debug: Check the structure of professor data
      if (data.length > 0) {
        console.log('Sample professor structure:', data[0]);
      }
      
      // Map professor data to options format
      const options = data.map(prof => ({
        value: prof.professor_id,
        label: `${prof.first_name || ''} ${prof.last_name || ''}`.trim()
      }));
      
      // Create a lookup object for professor details
      const profLookup = {};
      data.forEach(prof => {
        profLookup[prof.professor_id] = prof;
      });
      
      setProfessorOptions(options);
      setProfessors(profLookup);
      
      return data;
    } catch (err) {
      console.error('Error fetching all professors:', err);
      return [];
    }
  };

  // Function to get professor name
  const getProfessorName = (professorId) => {
    if (!professorId) return 'Unknown Professor';
    
    const professor = professors[professorId];
    if (!professor) return `Professor ${professorId}`;
    
    return `${professor.first_name || ''} ${professor.last_name || ''}`.trim() || `Professor ${professorId}`;
  };

  // Custom function to handle major filter with flexible matching
  const majorFilterMatches = (job, selectedMajorValue) => {
    // Get the selected major's label
    const selectedMajorLabel = majorOptions.find(m => m.value === selectedMajorValue)?.label;
    if (!selectedMajorLabel) return false;
    
    // Based on the AddJob component, the field is stored as "req_majors"
    // But we'll check multiple possible fields for different variations
    const fieldNamesToCheck = [
      'req_majors', 'requiredMajors', 'major', 'majors', 'majors_interested', 
      'major_field', 'preferred_major', 'major_requirement', 'major_requirements'
    ];
    
    for (const fieldName of fieldNamesToCheck) {
      const fieldValue = job[fieldName];
      
      // Skip if the field doesn't exist or is null/undefined
      if (!fieldValue) continue;
      
      console.log(`Checking field ${fieldName} with value:`, fieldValue);
      
      // If it's a string, do a case-insensitive check for the label or value
      if (typeof fieldValue === 'string') {
        const fieldValueLower = fieldValue.toLowerCase();
        
        // Check if the field exactly matches the selected major's value
        if (fieldValueLower === selectedMajorValue.toLowerCase()) {
          console.log(`Exact match found for ${fieldName}`);
          return true;
        }
        
        // Check if the field contains the selected major's label
        if (fieldValueLower.includes(selectedMajorLabel.toLowerCase())) {
          console.log(`Label match found for ${fieldName}`);
          return true;
        }
        
        // Check if the field contains the selected major's value
        if (fieldValueLower.includes(selectedMajorValue.toLowerCase())) {
          console.log(`Value match found for ${fieldName}`);
          return true;
        }
      }
      
      // If it's an array, check if it contains the major value or label
      if (Array.isArray(fieldValue)) {
        for (const item of fieldValue) {
          if (typeof item === 'string' && 
              (item.toLowerCase() === selectedMajorValue.toLowerCase() || 
               item.toLowerCase() === selectedMajorLabel.toLowerCase())) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Sort function
  const applySorting = (filteredData) => {
    const sortedData = [...filteredData];
    
    switch (sortBy) {
      case 'created_at_asc':
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'created_at_desc':
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'application_deadline_asc':
        sortedData.sort((a, b) => new Date(a.application_deadline) - new Date(b.application_deadline));
        break;
      case 'application_deadline_desc':
        sortedData.sort((a, b) => new Date(b.application_deadline) - new Date(a.application_deadline));
        break;
      default:
        // Default to newest first
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return sortedData;
  };
  
  // Apply filters function
  const applyFilters = () => {
    console.log("Applying filters. Current selections:", { 
      major: selectedMajor, 
      professor: selectedProfessor, 
      term: selectedTerm 
    });
    
    let filtered = [...listings];
    
    if (selectedMajor) {
      filtered = filtered.filter(job => {
        const matches = majorFilterMatches(job, selectedMajor);
        console.log(`Job ${job.job_id} (${job.job_title}) - Major match: ${matches}`);
        return matches;
      });
    }
    
    if (selectedProfessor) {
      filtered = filtered.filter(job => job.professor_id === selectedProfessor);
    }
    
    if (selectedTerm) {
      filtered = filtered.filter(job => {
        // Check for exact term match
        if (job.term === selectedTerm) return true;
        
        // Check for different term field names
        if (job.job_term === selectedTerm) return true;
        
        // Check if term contains the selected term value or label
        const termLabel = termOptions.find(t => t.value === selectedTerm)?.label;
        if (termLabel && job.term && job.term.includes(termLabel)) return true;
        if (termLabel && job.job_term && job.job_term.includes(termLabel)) return true;
        
        return false;
      });
    }
    
    // Apply sorting to the filtered data
    const sortedFiltered = applySorting(filtered);
    
    console.log(`Filtered from ${listings.length} to ${sortedFiltered.length} listings`);
    setFilteredListings(sortedFiltered);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedMajor(null);
    setSelectedProfessor(null);
    setSelectedTerm(null);
    setFilteredListings(listings);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all professors first
        await fetchAllProfessors();
        
        // Then fetch jobs
        const response = await fetch('http://localhost:5002/GET/Job/valid');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the structure of jobs
        console.log('Fetched jobs:', data);
        console.log('Sample job fields:', data.length > 0 ? Object.keys(data[0]) : 'No jobs found');
        
        // Transform the data to include the bookmarked property
        const jobsWithBookmarkStatus = data.map(job => ({
          ...job,
          bookmarked: JSON.parse(localStorage.getItem("bookmarked_jobs"))?.includes(job.job_id) || false
        }));
        
        setListings(jobsWithBookmarkStatus);
        setFilteredListings(jobsWithBookmarkStatus);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job listings or professors');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever a filter changes or sort changes
  useEffect(() => {
    applyFilters();
  }, [selectedMajor, selectedProfessor, selectedTerm, sortBy, listings]);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    
    setListings(prevListings => {
      const updatedListings = prevListings.map(listing => {
        if (listing.job_id === id) {
          const newBookmarkedStatus = !listing.bookmarked;
          
          // Update localStorage
          let bookmarkedJobs = JSON.parse(localStorage.getItem("bookmarked_jobs")) || [];
          
          if (newBookmarkedStatus) {
            // Add to bookmarks
            bookmarkedJobs.push(listing.job_id);
          } else {
            // Remove from bookmarks
            bookmarkedJobs = bookmarkedJobs.filter(jobId => jobId !== listing.job_id);
          }
          
          localStorage.setItem("bookmarked_jobs", JSON.stringify(bookmarkedJobs));
          
          return { ...listing, bookmarked: newBookmarkedStatus };
        }
        return listing;
      });
      
      return updatedListings;
    });
    
    // Also update filtered listings
    setFilteredListings(prevFiltered => {
      return prevFiltered.map(listing => {
        if (listing.job_id === id) {
          return { ...listing, bookmarked: !listing.bookmarked };
        }
        return listing;
      });
    });
  };

  // Toggle dropdown functions
  const toggleMajorDropdown = () => setMajorOpen(!majorOpen);
  const toggleProfessorDropdown = () => setProfessorOpen(!professorOpen);
  const toggleTermDropdown = () => setTermOpen(!termOpen);
  const toggleSortDropdown = () => setSortOpen(!sortOpen);

  // Render component
  return (
    <div className="min-h-screen bg-background_clr p-6">
      {/* Conditional rendering based on loading and error states */}
      {loading && (
        <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center">
          Loading job listings...
        </div>
      )}
      
      {error && (
        <div className="min-h-screen bg-background_clr p-6 flex justify-center items-center text-red-500">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          {/* Header with logo, search, and navigation */}
          <NavBar/>
          
          {/* Main content */}
          <div className="flex mt-8 pl-6 pr-6">
            {/* Filters sidebar */}
            <div className="w-64 mr-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl">Filters</h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-dark_pink_clr hover:underline"
                >
                  Reset Filters
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Major Filter */}
                <div className="relative">
                  <button 
                    className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded"
                    onClick={toggleMajorDropdown}
                  >
                    <span>{selectedMajor ? majorOptions.find(m => m.value === selectedMajor)?.label : 'Major'}</span>
                    {majorOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {majorOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                      {/* Add an "All Majors" option */}
                      <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer bg-gray-50">
                        <input
                          type="radio"
                          name="major"
                          value=""
                          checked={selectedMajor === null}
                          onChange={() => {
                            setSelectedMajor(null);
                            setMajorOpen(false);
                          }}
                          className="mr-2"
                        />
                        <span className="font-medium">All Majors</span>
                      </label>
                      
                      <div className="border-t border-gray-200"></div>
                      
                      {majorOptions.map(option => (
                        <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="radio"
                            name="major"
                            value={option.value}
                            checked={selectedMajor === option.value}
                            onChange={() => {
                              setSelectedMajor(option.value);
                              setMajorOpen(false);
                              console.log("Selected major:", option.value, option.label);
                            }}
                            className="mr-2"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Professor Filter */}
                <div className="relative">
                  <button 
                    className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded"
                    onClick={toggleProfessorDropdown}
                  >
                    <span>
                      {selectedProfessor 
                        ? professorOptions.find(p => p.value === selectedProfessor)?.label 
                        : 'Professor'}
                    </span>
                    {professorOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {professorOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                      {/* Add an "All Professors" option */}
                      <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer bg-gray-50">
                        <input
                          type="radio"
                          name="professor"
                          value=""
                          checked={selectedProfessor === null}
                          onChange={() => {
                            setSelectedProfessor(null);
                            setProfessorOpen(false);
                          }}
                          className="mr-2"
                        />
                        <span className="font-medium">All Professors</span>
                      </label>
                      
                      <div className="border-t border-gray-200"></div>
                      
                      {professorOptions.map(option => (
                        <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="radio"
                            name="professor"
                            value={option.value}
                            checked={selectedProfessor === option.value}
                            onChange={() => {
                              setSelectedProfessor(option.value);
                              setProfessorOpen(false);
                            }}
                            className="mr-2"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Term Filter */}
                <div className="relative">
                  <button 
                    className="flex justify-between items-center w-full bg-light_pink_clr p-3 rounded"
                    onClick={toggleTermDropdown}
                  >
                    <span>{selectedTerm ? termOptions.find(t => t.value === selectedTerm)?.label : 'Term'}</span>
                    {termOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {termOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                      {/* Add an "All Terms" option */}
                      <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer bg-gray-50">
                        <input
                          type="radio"
                          name="term"
                          value=""
                          checked={selectedTerm === null}
                          onChange={() => {
                            setSelectedTerm(null);
                            setTermOpen(false);
                          }}
                          className="mr-2"
                        />
                        <span className="font-medium">All Terms</span>
                      </label>
                      
                      <div className="border-t border-gray-200"></div>
                      
                      {termOptions.map(option => (
                        <label key={option.value} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="radio"
                            name="term"
                            value={option.value}
                            checked={selectedTerm === option.value}
                            onChange={() => {
                              setSelectedTerm(option.value);
                              setTermOpen(false);
                            }}
                            className="mr-2"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Active filters display */}
              {(selectedMajor || selectedProfessor || selectedTerm) && (
                <div className="mt-4 p-3 bg-light_grey_color rounded">
                  <h3 className="font-medium mb-2">Active Filters:</h3>
                  <ul className="text-sm">
                    {selectedMajor && (
                      <li className="flex justify-between">
                        <span>Major:</span>
                        <span className="font-medium">{majorOptions.find(m => m.value === selectedMajor)?.label}</span>
                      </li>
                    )}
                    {selectedProfessor && (
                      <li className="flex justify-between">
                        <span>Professor:</span>
                        <span className="font-medium">{professorOptions.find(p => p.value === selectedProfessor)?.label}</span>
                      </li>
                    )}
                    {selectedTerm && (
                      <li className="flex justify-between">
                        <span>Term:</span>
                        <span className="font-medium">{termOptions.find(t => t.value === selectedTerm)?.label}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Research listings */}
            <div className="flex-1">
              <div className="flex justify-between mb-4">
                <div className="text-lg">
                  Showing {filteredListings.length} of {listings.length} listings
                </div>
                <div className="relative">
                  <button 
                    className="flex items-center bg-dark_pink_clr text-white px-6 py-2 rounded-full"
                    onClick={toggleSortDropdown}
                  >
                    <span>{sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort By'}</span>
                    {sortOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                  </button>
                  
                  {sortOpen && (
                    <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg z-10">
                      {sortOptions.map(option => (
                        <button
                          key={option.value}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            sortBy === option.value ? 'bg-gray-50 font-medium' : ''
                          }`}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Research cards */}
              <div className="space-y-4">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <div key={listing.job_id} className="block">
                      <div className="bg-orange_clr p-4 rounded hover:bg-orange-400 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex-grow">
                            <Link 
                              to={`/jobDetails/${listing.job_id}`}
                              className="block"
                            >
                              <h3 className="text-lg font-medium">{listing.job_title || 'Job Title'}</h3>
                              <p>
                                {getProfessorName(listing.professor_id)}
                                {listing.lab_name ? ` | ${listing.lab_name}` : ''}
                              </p>
                            </Link>
                          </div>
                          <div 
                            onClick={(e) => toggleBookmark(e, listing.job_id)} 
                            className="cursor-pointer ml-4"
                          >
                            {listing.bookmarked ?
                              <FaBookmark className="text-xl text-dark_pink_clr" /> :
                              <FiBookmark className="text-xl" />
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white p-6 rounded-lg shadow">
                    <p className="text-lg mb-2">No job listings match your filters</p>
                    <button 
                      onClick={resetFilters} 
                      className="text-dark_pink_clr hover:underline"
                    >
                      Reset filters to see all listings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;