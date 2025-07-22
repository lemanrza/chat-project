
import React, { useState } from 'react';
import { Search, MapPin, ChevronRight, ChevronLeft, Heart, Calendar, Coffee, Plane, Monitor, Laptop, Dog, Cat, Music, BookOpen, Dumbbell, ChefHat, Palette, Camera, Gamepad2, Mountain, Waves, TreePine, Theater, Pizza, FolderRoot as Football, Sprout, Guitar, Flame, ShoppingBasket as Basketball, Target, Home, Wine, Beer, Umbrella, Snowflake, Car, Tent, Film, Globe, Piano, CircleUser } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import controller from '@/services/commonRequest';
import endpoints from '@/services/api';
import User from '@/classes/User';
import registerValidation from '@/validations/registerValidation';
import { useFormik } from "formik";
import { useNavigate } from 'react-router-dom';

import { enqueueSnackbar } from "notistack";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);

  interface RegisterFormValues {
    location: string;
    dateOfBirth: string;
    hobbies: string[];
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const registerFormik = useFormik<RegisterFormValues>({
    initialValues: {
      location: "",
      dateOfBirth: "",
      hobbies: [],
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidation,
    onSubmit: async (values, action) => {
      const formattedDate = new Date(values.dateOfBirth).toISOString();

      const newUser = new User(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          location: values.location,
          dateOfBirth: formattedDate, 
        },
        values.username,
        values.email,
        values.password,
        values.hobbies.map(hobbie => hobbie)
      );
      console.log("user", newUser);
      try {
        await controller.post(`${endpoints.users}/register`, newUser);

        enqueueSnackbar("User registered successfully!", {
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "success",
        });

        action.resetForm();

        navigate("/auth/login");
      } catch (error: any) {
        enqueueSnackbar(error.response.data.message, {
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          variant: "error",
        });
        values.email = "";
        values.username = "";
      }
    },
  });

  const handleInterestToggle = (interest: string) => {
    registerFormik.setFieldValue("hobbies", registerFormik.values.hobbies.includes(interest)
      ? registerFormik.values.hobbies.filter(i => i !== interest)
      : [...registerFormik.values.hobbies, interest]
    );
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const interests = [
    { name: 'Coffee', icon: Coffee },
    { name: 'Travel', icon: Plane },
    { name: 'Netflix', icon: Monitor },
    { name: 'Coding', icon: Laptop },
    { name: 'Dogs', icon: Dog },
    { name: 'Cats', icon: Cat },
    { name: 'Music', icon: Music },
    { name: 'Reading', icon: BookOpen },
    { name: 'Fitness', icon: Dumbbell },
    { name: 'Cooking', icon: ChefHat },
    { name: 'Art', icon: Palette },
    { name: 'Photo', icon: Camera },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Hiking', icon: Mountain },
    { name: 'Swimming', icon: Waves },
    { name: 'Yoga', icon: TreePine },
    { name: 'Theater', icon: Theater },
    { name: 'Food', icon: Pizza },
    { name: 'Sports', icon: Football },
    { name: 'Garden', icon: Sprout },
    { name: 'Guitar', icon: Guitar },
    { name: 'Dancing', icon: Flame },
    { name: 'Basketball', icon: Basketball },
    { name: 'Soccer', icon: Target },
    { name: 'Darts', icon: Target },
    { name: 'Games', icon: Home },
    { name: 'Wine', icon: Wine },
    { name: 'Beer', icon: Beer },
    { name: 'Beach', icon: Umbrella },
    { name: 'Winter', icon: Snowflake },
    { name: 'Cars', icon: Car },
    { name: 'Comedy', icon: Tent },
    { name: 'Movies', icon: Film },
    { name: 'Tech', icon: Globe },
    { name: 'Nature', icon: Globe },
    { name: 'Piano', icon: Piano }
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with title */}
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-4xl font-extrabold text-[#222] mb-2 tracking-tight flex items-center gap-2">
            <span>Chat</span> <span className="text-[#00B878]">Wave</span>
          </h1>
          <p className="text-gray-500 text-base">Create your account and join our unique platform.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber, index) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${stepNumber === step
                      ? 'bg-[#00B878] text-white shadow-lg shadow-green-200'
                      : stepNumber < step
                        ? 'bg-[#00B878] text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {stepNumber < step ? '✓' : stepNumber}
                  </div>
                </div>
                {index < 3 && (
                  <div
                    className={`h-0.5 w-16 mx-2 transition-all duration-300 ${stepNumber < step ? 'bg-[#00B878]' : 'bg-gray-200'
                      }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <form onSubmit={registerFormik.handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-2 bg-[#f8fafb] rounded-xl p-6 shadow-sm border border-gray-100">
                <label className="text-base font-semibold text-[#222] flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#00B878]" /> Where are you from?
                </label>
                <div className="flex items-center gap-2">
                  <Search className="text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    value={registerFormik.values.location}
                    onChange={registerFormik.handleChange}
                    placeholder="Country"
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00B878] bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStep}
                  disabled={registerFormik.values.location === ""}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${registerFormik.values.location !== ""
                    ? 'bg-[#00B878] hover:bg-[#00a76d] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E5F8F1] bg-opacity-10 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-[#00B878]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">What are your interests?</h2>
                <p className="text-gray-500">Select 3-5 interests to help us personalize your experience</p>
              </div>

              <div className="grid grid-cols-6 gap-3 mb-6">
                {interests.map((interest) => {
                  const IconComponent = interest.icon;
                  const isSelected = registerFormik.values.hobbies.includes(interest.name);
                  return (
                    <button
                      key={interest.name}
                      onClick={() => handleInterestToggle(interest.name)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${isSelected
                        ? 'bg-[#00B878] border-[#00B878] text-white shadow-lg'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#00B878] hover:text-[#00B878]'
                        }`}
                    >
                      <IconComponent className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">{interest.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                  Selected: {registerFormik.values.hobbies.length}/5 (minimum 3 required)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={registerFormik.values.hobbies.length < 3}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${registerFormik.values.hobbies.length >= 3
                    ? 'bg-[#00B878] hover:bg-[#00a76d] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E5F8F1] bg-opacity-10 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-[#00B878]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">When's your birthday?</h2>
                <p className="text-gray-500">Your age will help us connect you with the right people</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select your birthday
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={registerFormik.values.dateOfBirth}
                      onChange={registerFormik.handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B878] focus:ring-opacity-20 focus:border-[#00B878] transition-all bg-gray-50"
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                  {registerFormik.values.dateOfBirth && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <span className="text-lg">🎂</span>
                        <span className="font-semibold">
                          Age: {new Date().getFullYear() - new Date(registerFormik.values.dateOfBirth).getFullYear()} years old
                        </span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        Born on {new Date(registerFormik.values.dateOfBirth).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-[#00B878] hover:bg-[#00a76d] text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E5F8F1] bg-opacity-10 rounded-full mb-4">
                  <CircleUser className="w-8 h-8 text-[#00B878]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
                <p className="text-gray-500">Almost there! Just a few more details</p>
              </div>

              <div
                className="space-y-4">
                <button
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_SERVER_URL
                      }/auth/google`;
                  }}
                  className="flex items-center justify-center w-full gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-sm text-semibold text-gray-700">Continue with Google</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_SERVER_URL
                      }/auth/github`;
                  }}
                  className="flex items-center justify-center w-full gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub"
                    className="w-5 h-5"
                  />
                  <span className="text-sm text-gray-700 text-semibold">Continue with GitHub</span>
                </button>
                <div className="text-center">
                  <span className="text-gray-400 text-sm">or create with email</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#222]">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={registerFormik.values.firstName}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    name="firstName"
                    placeholder="Enter your first name"
                    className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]"
                  />
                  {registerFormik.errors.firstName &&
                    registerFormik.touched.firstName && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {registerFormik.errors.firstName}
                      </span>
                    )}
                </div>
                <div>
                  <label className="text-sm font-medium text-[#222]">Last Name</label>
                  <input
                    type="text"
                    value={registerFormik.values.lastName}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    name="lastName"
                    placeholder="Enter your last name"
                    className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]"
                  />
                  {registerFormik.errors.lastName &&
                    registerFormik.touched.lastName && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {registerFormik.errors.lastName}
                      </span>
                    )}
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-[#222]">Username</label>
                  <input
                    type="text"
                    value={registerFormik.values.username}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    name="username"
                    placeholder="Choose a username"
                    className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]"
                  />
                  {registerFormik.errors.username &&
                    registerFormik.touched.username && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {registerFormik.errors.username}
                      </span>
                    )}
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-[#222]">Email</label>
                  <input
                    type="email"
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    name="email"
                    placeholder="Enter your email"
                    className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b]"
                  />
                  {registerFormik.errors.email && registerFormik.touched.email && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {registerFormik.errors.email}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-[#222]">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerFormik.values.password}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    name="password"
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
                  {registerFormik.errors.password &&
                    registerFormik.touched.password && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {registerFormik.errors.password}
                      </span>
                    )}
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-[#222]">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={registerFormik.values.confirmPassword}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#43e97b] pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-9.5 text-[#43e97b] cursor-pointer"
                  >
                    {showConfirm ? (
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
                  {registerFormik.errors.confirmPassword &&
                    registerFormik.touched.confirmPassword && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {registerFormik.errors.confirmPassword}
                      </span>
                    )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    disabled={
                      registerFormik.isSubmitting ||
                      !registerFormik.dirty ||
                      Object.entries(registerFormik.errors).length > 0
                    }
                    type="submit"
                    className="flex-1 bg-[#00B878] hover:bg-[#00a76d] text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
