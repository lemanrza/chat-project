import React, { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-3xl font-bold text-[#222] mb-1">Chat <span className="text-[#43e97b]">Wave</span></h1>
          <p className="text-gray-500 text-sm">Welcome back to your conversations</p>
        </div>
        <button className="w-full flex items-center justify-center gap-2 border rounded-lg py-2 font-semibold text-[#222] bg-white hover:bg-[#f3f3f3] transition">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Continue with Google
        </button>
        <div className="flex items-center gap-2 my-2">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Or continue with email</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#222]">Email or Username</label>
            <input type="text" placeholder="Enter email or username" className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]" />
            {/* Error message example */}
            {/* <span className="text-xs text-red-500 mt-1">Email or username is required</span> */}
          </div>
          <div className="relative">
            <label className="text-sm font-medium text-[#222]">Password</label>
            <input type={showPassword ? "text" : "password"} placeholder="Enter password" className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b] pr-10" />
            <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-9.5 text-[#43e97b]">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.09-.22 4.41-.61M17.47 17.47C19.94 15.64 21.75 12 21.75 12c-.653-1.306-1.86-3.342-3.72-5.06" /></svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#43e97b]" /> Remember me
            </label>
            <a href="/auth/forgot-password" className="hover:underline text-[#43e97b]">Forgot password?</a>
          </div>
          <button type="submit" className="bg-[#43e97b] text-white rounded-lg py-2 font-semibold hover:bg-blue-400 transition">Sign In</button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">Don't have an account? <a href="/auth/register" className="text-[#43e97b] font-semibold hover:underline">Create one now</a></p>
      </div>
    </div>
  );
}

export default Login;
