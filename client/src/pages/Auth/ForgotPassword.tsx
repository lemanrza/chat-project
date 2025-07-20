import React, { useState } from 'react'
import chatLogo from '../../assets/images/chatlogo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-6 z-10">
        <div className="flex flex-col items-center mb-2">
          <img src={chatLogo} alt="Chat Wave Logo" className="w-14 h-14 mb-2 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-[#222] mb-1">Chat <span className="text-[#43e97b]">Wave</span></h1>
          <p className="text-gray-500 text-base font-medium">Reset your password</p>
        </div>
        <div className=" rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[#222] mx-auto">Forgot your password?</h2>
          <p className="text-gray-500 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-[#222]">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]"
                required
              />
            </div>
            <button type="submit" className="bg-green-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-400 transition">Send Reset Link</button>
          </form>
          <a href="/auth/login" className="flex items-center justify-center gap-2 text-[#43e97b] font-semibold hover:underline mt-2">
            <svg width="18" height="18" fill="none" stroke="#43e97b" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword