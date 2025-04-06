import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      {/* Logo and search section */}
      <div className="flex justify-between items-center mb-8 pl-6 pr-6">
        <div className="flex items-center">
          <img
            src="/NavBarLogo.png"
            alt="Comet Logo"
            className="h-32 w-auto mr-4"
          />

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
          <a href="#" className="hover:underline">
            Home
          </a>

          {/* Applications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer hover:underline"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Applications
              <FiChevronDown className="ml-1" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <a
                  href="/trackApplication"
                  className="block px-4 py-2 text-base hover:bg-gray-100"
                >
                  Track Applications
                </a>
                <a
                  href="/bookmarked-applications"
                  className="block px-4 py-2 text-base hover:bg-gray-100"
                >
                  Bookmarked Applications
                </a>
              </div>
            )}
          </div>

          <a href="#" className="hover:underline">
            Profile
          </a>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
