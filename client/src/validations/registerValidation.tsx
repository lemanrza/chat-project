import * as Yup from "yup";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const registerValidation = Yup.object().shape({
  // location: Yup.string().required("Country is required"),
  // birthDate: Yup.date().required("Birth date is required"),
  // hobbies: Yup.array().required("Hobbies are required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, and one symbol"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default registerValidation;
