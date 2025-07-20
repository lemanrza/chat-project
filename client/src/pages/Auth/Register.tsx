import { useState } from 'react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#43e97b] via-[#38f9d7] to-[#fa8bff]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-3xl font-bold text-[#222] mb-1">Chat <span className="text-[#43e97b]">Wave</span></h1>
          <p className="text-gray-500 text-sm">Create your account and join our unique platform.</p>
        </div>
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#222]">Name</label>
            <input type="text" placeholder="Enter your name" className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#222]">Email</label>
            <input type="email" placeholder="Enter your email" className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]" />
          </div>
          <div className="relative">
            <label className="text-sm font-medium text-[#222]">Password</label>
            <input type={showPassword ? "text" : "password"} placeholder="Enter password" className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b] pr-10" />
            <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-8 text-[#43e97b]">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.09-.22 4.41-.61M17.47 17.47C19.94 15.64 21.75 12 21.75 12c-.653-1.306-1.86-3.342-3.72-5.06" /></svg>
              )}
            </button>
          </div>
          <div className="relative">
            <label className="text-sm font-medium text-[#222]">Confirm Password</label>
            <input type={showConfirm ? "text" : "password"} placeholder="Confirm password" className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b] pr-10" />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-8 text-[#43e97b]">
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.09-.22 4.41-.61M17.47 17.47C19.94 15.64 21.75 12 21.75 12c-.653-1.306-1.86-3.342-3.72-5.06" /></svg>
              )}
            </button>
          </div>
          <button type="submit" className="bg-[#43e97b] text-white rounded-lg py-2 font-semibold hover:bg-[#38f9d7] transition">Create Account</button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">Already have an account? <a href="/auth/login" className="text-[#43e97b] font-semibold hover:underline">Sign In</a></p>
      </div>
    </div>
  );
}

export default Register