import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5">
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-3xl font-bold text-[#222] mb-1">
            Chat <span className="text-[#43e97b]">Wave</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back to your conversations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_SERVER_URL
              }/auth/google`;
            }}
            className="flex items-center justify-center w-full gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm text-gray-700">Continue with Google</span>
          </button>
          <button
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_SERVER_URL
              }/auth/github`;
            }}
            className="flex items-center justify-center w-full gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            <span className="text-sm text-gray-700">Continue with GitHub</span>
          </button>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">
              Or continue with email
            </span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#222]">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter email or username"
              className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]"
            />
            {/* Error message example */}
            {/* <span className="text-xs text-red-500 mt-1">Email or username is required</span> */}
          </div>
          <div className="relative">
            <label className="text-sm font-medium text-[#222]">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b] pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-9.5 text-[#43e97b] cursor-pointer"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.09-.22 4.41-.61M17.47 17.47C19.94 15.64 21.75 12 21.75 12c-.653-1.306-1.86-3.342-3.72-5.06"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#43e97b]" /> Remember me
            </label>
            <a
              href="/auth/forgot-password"
              className="hover:underline text-[#43e97b]"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="bg-[#43e97b] text-white rounded-lg py-2 font-semibold hover:bg-blue-400 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-[#43e97b] font-semibold hover:underline"
          >
            Create one now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
