import passport from "passport";
import { Strategy as GoogleStrategy, } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, } from "passport-github2";
import config from "./config.js";
import UserModel from "../models/userModel.js";
// GOOGLE LOGIN STRATEGY
passport.use("google-login", new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/google/callback`,
    passReqToCallback: true,
}, async (_req, _accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email)
            return done(new Error("No email from Google"), false);
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return done(null, false, {
                message: "No user found with this email",
            });
        }
        return done(null, existingUser);
    }
    catch (err) {
        return done(err, false);
    }
}));
// GITHUB LOGIN STRATEGY
passport.use("github-login", new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/github/callback`,
    passReqToCallback: true,
}, async (_req, _accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value ||
            profile._json.email ||
            `${profile.username}@github.com`;
        if (!email)
            return done(new Error("No email from GitHub"), false);
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return done(null, false, {
                message: "No user found with this email",
            });
        }
        return done(null, existingUser);
    }
    catch (err) {
        return done(err, false);
    }
}));
