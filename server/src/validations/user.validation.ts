import Joi from "joi";

const profileSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  displayName: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
  public_id: Joi.string().optional(),
  bio: Joi.string().optional(),
  location: Joi.string().optional(),
  dateOfBirth: Joi.date().iso().optional(),
});

const userValidationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).when("provider", {
    is: "local",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  connections: Joi.array().optional(),
  connectionsRequests: Joi.array().optional(),
  hobbies: Joi.array().optional(),
  provider: Joi.string().valid("local", "google", "github").default("local"),
  providerId: Joi.string().allow(null, "").optional(),

  profile: profileSchema.required(),

  lastLogin: Joi.date().optional(),
  loginAttempts: Joi.number().min(0).optional(),
  lockUntil: Joi.date().optional(),
  lastSeen: Joi.boolean().optional(),
  isOnline: Joi.boolean().optional(),
  emailVerified: Joi.boolean().optional(),
});

export default userValidationSchema;
