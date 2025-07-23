import { FcGoogle } from 'react-icons/fc';

function SocialAuthButtons() {
  return (
    <>
      <button
        type="button"
        className="flex items-center justify-center w-full gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
      >
        <FcGoogle className="text-xl" />
        <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
      </button>
      
      <button
        type="button"
        className="flex items-center justify-center w-full gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
          alt="GitHub"
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-semibold">Continue with GitHub</span>
      </button>
      
      <div className="text-center">
        <span className="text-gray-400 text-sm">or create with email</span>
      </div>
    </>
  );
}

export default SocialAuthButtons;