import { NextFunction, Request, Response } from "express";
import userValidationSchema from "../validations/user.validation.js";

const userValidate = (req: Request, _: Response, next: NextFunction): void => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    throw new Error(errorMessage);
  } else {
    next();
  }
};

export default userValidate;
