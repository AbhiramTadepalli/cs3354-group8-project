import React from 'react'
import {FiChevronDown } from 'react-icons/fi';
import NavBar from '../../../Components/NavBarStudent';
const SearchPage = () => {
    {/*needs to be more dynamic just a place holder for now */}
    const researchListings = [
    { id: 1, title: 'Job Title', professor: 'Professor', lab: 'Lab' },
    { id: 2, title: 'Job Title', professor: 'Professor', lab: 'Lab' },
    { id: 3, title: 'Job Title', professor: 'Professor', lab: 'Lab' },
    { id: 4, title: 'Job Title', professor: 'Professor', lab: 'Lab' },
    { id: 5, title: 'Job Title', professor: 'Professor', lab: 'Lab' },
    { id: 6, title: 'Job Title', professor: 'Professor', lab: 'Lab' },
  ];

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
            {researchListings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-orange_clr p-4 rounded"
              >
                <h3 className="text-lg font-medium">{listing.title}</h3>
                <p>{listing.professor} | {listing.lab}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage