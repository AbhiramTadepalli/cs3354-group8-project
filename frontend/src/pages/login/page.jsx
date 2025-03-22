import React from 'react';

const Login = () => {
  return (
    <div className="bg-background_clr h-screen w-screen flex items-center justify-start">
      {/* Image on the Left */}
      <img 
        src="/CometConnectLogo.png" 
        alt="logo" 
        className="ml-24 w-auto h-full"
      />
      <div className="w-full max-w-lg px-6 ml-32">
        <h1 className="text-3xl text-center font-normal mb-10 mt-32">
          Login
        </h1>

        <form className="w-full">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 mb-5 border-none rounded bg-orange_clr placeholder-white text-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 mb-8 border-none rounded bg-orange_clr placeholder-white text-lg"
          />
            {/* need to change to Link */}
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="px-16 py-3 bg-dark_pink_clr text-white border-none rounded-full text-lg cursor-pointer mb-3"
            >
              Submit
            </button>

            {/* need to change to Link */}
            <a
              href="#"
              className="text-black underline text-base"
            >
              Don't have an account yet?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
