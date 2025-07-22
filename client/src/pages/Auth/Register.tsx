import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import registerValidation from "@/validations/registerValidation";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import User from "@/classes/User";
import { enqueueSnackbar } from "notistack";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const registerFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidation,
    onSubmit: async (values: any, action: any) => {
      const newUser = new User(
        {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        values.username,
        values.email,
        values.password
      );

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-3xl font-bold text-[#222] mb-1">
            Chat <span className="text-[#43e97b]">Wave</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Create your account and join our unique platform.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_SERVER_URL
              }/auth/google?mode=register`;
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
              }/auth/github?mode=register`;
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
        </div>

        {/* Form */}
        <form
          onSubmit={registerFormik.handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
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

          <div className="col-span-2">
            <button
              disabled={
                registerFormik.isSubmitting ||
                !registerFormik.dirty ||
                Object.entries(registerFormik.errors).length > 0
              }
              type="submit"
              className="bg-[#43e97b] text-white disabled:cursor-not-allowed disabled:bg-[#43e97add] rounded-lg py-2 font-semibold hover:bg-[#38d46d] transition w-full mt-2 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-[#43e97b] font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
