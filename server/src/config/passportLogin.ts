import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { VerifyCallback } from "passport-oauth2";
import config from "./config.js";
import UserModel from "../models/userModel.js";

// GOOGLE LOGIN STRATEGY
passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${config.SERVER_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (
      _req,
      _accessToken,
      _refreshToken,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"), false);

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
          return done(null, false, {
            message: "No user found with this email",
          });
        }

        return done(null, existingUser);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

// GITHUB LOGIN STRATEGY
passport.use(
  "github-login",
  new GitHubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID!,
      clientSecret: config.GITHUB_CLIENT_SECRET!,
      callbackURL: `${config.SERVER_URL}/auth/github/callback`,
      passReqToCallback: true,
    },
    async (
      _req: any,
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          profile._json.email ||
          `${profile.username}@github.com`;

        if (!email) return done(new Error("No email from GitHub"), false);

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
          return done(null, false, {
            message: "No user found with this email",
          });
        }

        return done(null, existingUser);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);
