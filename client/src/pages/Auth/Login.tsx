import { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#43e97b] via-[#38f9d7] to-[#fa8bff]">
      <div className="flex w-[420px] md:w-[700px] shadow-2xl rounded-2xl overflow-hidden">
        {/* Welcome panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#8e2de2] text-white w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-2">Welcome</h2>
          <p className="mb-6 text-center text-sm">Join our unique platform, explore a new experience.</p>
          <a href="/auth/register" className="border border-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-[#8e2de2] transition">REGISTER</a>
        </div>
        {/* Login form */}
        <div className="flex flex-col justify-center items-center bg-white w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-[#8e2de2] mb-6">Sign In</h2>
          <form className="w-full flex flex-col gap-4">
            <input type="email" placeholder="Email" className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8e2de2]" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#8e2de2]" />
              <span onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none text-[#8e2de2]">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.09-.22 4.41-.61M17.47 17.47C19.94 15.64 21.75 12 21.75 12c-.653-1.306-1.86-3.342-3.72-5.06" /></svg>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#8e2de2]" /> Remember me
              </label>
              <a href="/auth/forgot-password" className="hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="bg-[#8e2de2] text-white rounded-lg py-2 font-semibold hover:bg-[#6c1cb0] transition">LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login