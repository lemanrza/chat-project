import { useState } from 'react';
import { MapPin, Heart, CircleUser, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import ProgressBar from '@/components/Register/ProgressBar';
import StepHeader from '@/components/Register/StepHeader';
import LocationSearch from '@/components/Register/LocationSearch';
import StepNavigation from '@/components/Register/StepNavigation';
import { Calendar as CalendarDate } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Coffee, Plane, Monitor, Laptop, Dog, Cat, Music, BookOpen,
  Dumbbell, ChefHat, Palette, Camera, Gamepad2, Mountain, Waves,
  TreePine, Theater, Pizza, FolderRoot as Football, Sprout, Guitar,
  Flame, ShoppingBasket as Basketball, Target, Home, Wine, Beer,
  Umbrella, Snowflake, Car, Tent, Film, Globe, Piano
} from 'lucide-react';
import { useFormik } from 'formik';
import registerValidation from '@/validations/registerValidation';
import User from '@/classes/User';
import controller from '@/services/commonRequest';
import endpoints from '@/services/api';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { FcGoogle } from 'react-icons/fc';

interface LocationResult {
  id: string;
  city: string;
  country: string;
}

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

function Register() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const navigate = useNavigate();
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleDateChange = (value: any) => {
    if (value && value instanceof Date) {
      setDateOfBirth(value);
      registerFormik.setFieldValue('dateOfBirth', value.toISOString());
      setIsCalendarOpen(false);
    }
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
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
      console.log("Form submission started", values);
      console.log("CAPTCHA value:", captchaValue);
      console.log("Date of birth:", dateOfBirth);
      console.log("Selected location:", selectedLocation);

      if (!captchaValue) {
        console.log("CAPTCHA validation failed");
        enqueueSnackbar("Please complete the CAPTCHA verification", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }

      if (!dateOfBirth) {
        console.log("Date of birth validation failed");
        enqueueSnackbar("Please select your date of birth", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }

      if (!selectedLocation) {
        console.log("Location validation failed");
        enqueueSnackbar("Please select your location", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }

      if (!values.hobbies || values.hobbies.length < 3) {
        console.log("Hobbies validation failed");
        enqueueSnackbar("Please select at least 3 hobbies", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }

      const formattedDate = dateOfBirth.toISOString();

      const newUser = new User(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          location: `${selectedLocation.city}, ${selectedLocation.country}`,
          dateOfBirth: formattedDate,
        },
        values.username,
        values.email,
        values.password,
        values.hobbies.map(hobby => hobby)
      );
      console.log("User object created", newUser);

      try {
        console.log("Sending registration request...");
        const response = await controller.post(`${endpoints.users}/register`, newUser);
        console.log("Registration successful", response);

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
        console.error("Registration failed", error);
        enqueueSnackbar(error.response?.data?.message || "Registration failed", {
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

  const handleInterestToggle = (interest: string, e: React.MouseEvent) => {
    e.preventDefault();
    registerFormik.setFieldValue(
      "hobbies",
      registerFormik.values.hobbies.includes(interest)
        ? registerFormik.values.hobbies.filter(i => i !== interest)
        : [...registerFormik.values.hobbies, interest]
    );
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
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

  const handleLocationChange = (value: string) => {
    setLocation(value);
    registerFormik.setFieldValue("location", value);
  };

  const handleLocationSelect = (locationResult: LocationResult) => {
    setSelectedLocation(locationResult);
    const locationString = `${locationResult.city}, ${locationResult.country}`;
    registerFormik.setFieldValue("location", locationString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with title */}
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-4xl font-extrabold text-[#222] mb-2 tracking-tight flex items-center gap-2">
            <span>Chat</span> <span className="text-[#00B878]">Wave</span>
          </h1>
          <p className="text-gray-500 text-base">Create your account and join our unique platform.</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={step} totalSteps={4} />

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <form onSubmit={registerFormik.handleSubmit}>
            {step === 1 && (
              <>
                <StepHeader
                  icon={MapPin}
                  title="Where are you from?"
                  subtitle="Help us connect you with people nearby"
                />
                <LocationSearch
                  value={location}
                  onChange={handleLocationChange}
                  onSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
                <div className="flex justify-end">
                  <StepNavigation
                    onNext={handleNextStep}
                    canGoNext={!!selectedLocation}
                  />
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
                        onClick={(e) => handleInterestToggle(interest.name, e)}
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
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
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
                <StepHeader
                  icon={Calendar}
                  title="When's your birthday?"
                  subtitle="Your age will help us connect you with the right people"
                />
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select your birthday</label>
                    <div className="relative">
                      <input
                        type="text"
                        onClick={toggleCalendar}
                        placeholder="Click to select a date"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B878] focus:ring-opacity-20 focus:border-[#00B878] transition-all bg-gray-50"
                        defaultValue={dateOfBirth ? dateOfBirth.toLocaleDateString() : ''}
                      />

                      {isCalendarOpen && (
                        <CalendarDate
                          value={dateOfBirth}
                          onChange={handleDateChange}
                          className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] bg-green-700 mt-2 w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B878] focus:ring-opacity-20 focus:border-[#00B878] transition-all "
                        />
                      )}
                    </div>
                    {dateOfBirth && (
                      <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 text-green-700">
                          <span className="text-lg">🎂</span>
                          <span className="font-semibold">
                            Age: {new Date().getFullYear() - dateOfBirth.getFullYear()} years old
                          </span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Born on {dateOfBirth.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <StepNavigation
                    onPrevious={handlePrevStep}
                    onNext={handleNextStep}
                  />
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

                <div className="space-y-4">
                  <button
                    type="button"
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
                    type="button"
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
                  <div className="mt-4 bg-gray-100 rounded-xl py-3 flex items-center justify-center">
                    <ReCAPTCHA
                      sitekey="6LdV1owrAAAAAEzeZ2JZqUuhPZb7psuocH7MLAVI"
                      onChange={handleCaptchaChange}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={registerFormik.isSubmitting || !captchaValue}
                      className="flex-1 bg-[#00B878] hover:bg-[#00a76d] text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registerFormik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              <span className="mr-1">Already have an account?</span>
              <a
                href="/auth/login"
                className="text-[#00B878] font-semibold hover:text-[#00a76d] transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
