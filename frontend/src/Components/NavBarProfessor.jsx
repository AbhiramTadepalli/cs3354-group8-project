import React from 'react'

const NavBarProfessor = () => {
    return (
        <>
        {/* Logo and search section */}
        <div className="flex justify-between items-center mb-8 pl-6 pr-6">
        <div className="flex items-center">
              <img src="/NavBarLogo.png" alt="Comet Logo" className="h-32 w-auto mr-4" />
              
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
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">Applications</a>
              <a href="#" className="hover:underline">Profile</a>
            </nav>
            </div>
        </>
      )
}

export default NavBarProfessor