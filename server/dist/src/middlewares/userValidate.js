import userValidationSchema from "../validations/user.validation.js";
const userValidate = (req, _, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(", ");
        throw new Error(errorMessage);
    }
    else {
        next();
    }
};
export default userValidate;
