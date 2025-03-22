import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
// Then in your component:

const CreateAccountPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-start bg-background_clr">
      <div className="w-full max-w-2xl flex flex-col items-center mt-16">
        <div className="items-center">
          <img 
            src="/NavBarLogo.png" 
            alt="Comet" 
            className="h-64 w-auto mr-5 -mb-4 items-center"
          />
        </div>
        
        <h1 className="text-4xl font-normal mb-8">
          Create Account
        </h1>

        <form className="w-full px-4">
            <div className="mb-4 relative">
                <select 
                className="w-full h-12 p-4 border-none rounded-full bg-light_pink_clr text-sm appearance-none"
                defaultValue=""
                >
                <option value="" disabled>Role</option>
                <option value="user">User</option>
                <option value="admin">Professor</option>
                <option value="manager">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <FiChevronDown className="w-5 h-5 text-black" />
                </div>
            </div>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
            />
          </div>

          <div className="mb-8">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border-none rounded bg-orange_clr text-lg placeholder-white placeholder-opacity-75"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-16 py-3 bg-dark_pink_clr text-white border-none rounded-full text-lg cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;