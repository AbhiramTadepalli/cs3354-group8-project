import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NavBarProfessor = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Logo and search section */}
      <div className="flex justify-between items-center mb-8 pl-6 pr-6">
        <div className="flex items-center">
          <a href="/viewPostedJobs">
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
        <nav className="flex space-x-8 text-xl items-center">
          <a href="/professorDashboard" className="hover:underline">Home</a>
          <a href="/professorApplications" className="hover:underline">Applications</a>

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
                  href="/professorProfile"
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

export default NavBarProfessor;
