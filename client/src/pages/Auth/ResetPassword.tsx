import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import resetPasswordValidationSchema from "../../validations/resetPasswordValidation";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  let error: boolean = false;
  let decoded:
    | {
        email: string;
        id: string;
        iat: Date;
        exp: Date;
      }
    | undefined = undefined;
  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.log("err: ", err);
      error = true;
    }
  }

  useEffect(() => {
    if (error) {
      navigate("/auth/login");
    }
  }, [navigate, error]);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      console.log("decoded:", decoded);
      await controller.post(`${endpoints.users}/reset-password`, {
        newPassword: values.newPassword,
        email: decoded?.email,
      });
      actions.resetForm();
      enqueueSnackbar("password reset successfully!", {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 2000,
      });
      navigate("/auth/login");
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5 text-sm">
          <div>
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.errors.newPassword && formik.touched.newPassword && (
              <span className="text-red-500 text-sm">
                {formik.errors.newPassword}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              name="confirmNewPassword"
              value={formik.values.confirmNewPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.errors.confirmNewPassword &&
              formik.touched.confirmNewPassword && (
                <span className="text-red-500 text-sm">
                  {formik.errors.confirmNewPassword}
                </span>
              )}
          </div>

          <button
            disabled={
              formik.isSubmitting ||
              !formik.dirty ||
              Object.entries(formik.errors).length > 0
            }
            type="submit"
            className="w-full py-3 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer bg-blue-600 text-white font-semibold rounded-xl transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;