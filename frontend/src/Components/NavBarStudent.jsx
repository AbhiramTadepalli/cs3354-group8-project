import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [applicationsDropdownOpen, setApplicationsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const applicationsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (applicationsDropdownRef.current && !applicationsDropdownRef.current.contains(event.target)) {
        setApplicationsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
  // Back up bookmarks
  const bookmarks = localStorage.getItem("bookmarked_jobs");
  
  // clear everything
  localStorage.clear();
  
  // Restore the bookmarks after clearing
  if (bookmarks) {
    localStorage.setItem("bookmarked_jobs", bookmarks);
  }

  navigate("/login");
  };

  return (
    <>
      {/* Logo and search section */}
      <div className="flex justify-between items-center mb-8 pl-6 pr-6">
        <div className="flex items-center">
          <a href="/searchPage">
            <img
              src="/NavBarLogo.png"
              alt="Comet Logo"
              className="h-32 w-auto mr-4"
            />
          </a>
          <div className="relative ml-12">
            <div className="flex items-center bg-white rounded-xl p-2 py-5 pl-z w-[32rem]">
              <FiSearch className="text-light_grey_color mr-2" />
              <input
                type="text"
                placeholder="Search for Research"
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-8 text-xl">
          <a href="/searchPage" className="hover:underline">
            Home
          </a>

          {/* Applications Dropdown */}
          <div className="relative" ref={applicationsDropdownRef}>
            <div
              className="flex items-center cursor-pointer hover:underline"
              onClick={() => setApplicationsDropdownOpen(!applicationsDropdownOpen)}
            >
              Applications
              <FiChevronDown className="ml-1" />
            </div>
            {applicationsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <a
                  href="/trackApplication"
                  className="block px-4 py-2 text-base hover:bg-gray-100"
                >
                  Track Applications
                </a>
                <a
                  href="/Bookmarked"
                  className="block px-4 py-2 text-base hover:bg-gray-100"
                >
                  Bookmarked Applications
                </a>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <div
              className="flex items-center cursor-pointer hover:underline"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              Profile
              <FiChevronDown className="ml-1" />
            </div>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <a
                  href="/viewStudentProfile"
                  className="block px-4 py-2 text-base hover:bg-gray-100"
                >
                  View Profile
                </a>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
