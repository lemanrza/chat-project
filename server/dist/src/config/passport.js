import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import UserModel from "../models/userModel.js";
import { Strategy as GitHubStrategy, } from "passport-github2";
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        if (!profile.id || !profile.emails?.length) {
            return done(new Error("Invalid Google profile"), false);
        }
        const existingUser = await UserModel.findOne({
            providerId: profile.id,
        });
        if (existingUser) {
            return done(null, existingUser);
        }
        const emailTaken = await UserModel.findOne({
            email: profile.emails?.[0].value,
        });
        if (emailTaken) {
            return done(null, false, {
                message: "Email is already used",
            });
        }
        const displayName = profile.displayName;
        const nameParts = displayName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        const DEFAULT_BIO = `Welcome to my profile! I'm just getting started here and looking forward to meeting new people, learning new things, and sharing great conversations. Stay tuned as I update more about myself!`;
        const newUser = await UserModel.create({
            username: `${profile.emails?.[0]?.value.split("@")[0]}-${Date.now()}`,
            email: profile.emails?.[0]?.value,
            profile: {
                firstName,
                lastName,
                displayName,
                avatar: profile.photos?.[0]?.value,
                bio: DEFAULT_BIO,
                location: "",
                dateOfBirth: null,
            },
            provider: "google",
            providerId: profile.id,
            emailVerified: true,
        });
        return done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
}));
passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/github/callback`,
    scope: ["user:email"],
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        if (!profile.id) {
            return done(new Error("Invalid GitHub profile"), false);
        }
        const existingUser = await UserModel.findOne({
            providerId: profile.id,
        });
        if (existingUser) {
            return done(null, existingUser);
        }
        const email = profile.emails?.find((e) => e.verified)
            ?.value || profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found in GitHub profile"), false);
        }
        const emailTaken = await UserModel.findOne({ email });
        if (emailTaken) {
            return done(null, false, {
                message: "Email is already used",
            });
        }
        const displayName = profile.displayName || profile.username || "New User";
        const nameParts = displayName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        const DEFAULT_BIO = `Welcome to my profile! I'm just getting started here and looking forward to meeting new people, learning new things, and sharing great conversations. Stay tuned as I update more about myself!`;
        const newUser = await UserModel.create({
            username: `${profile.username}-${Date.now()}`,
            email,
            provider: "github",
            providerId: profile.id,
            emailVerified: true,
            profile: {
                firstName,
                lastName,
                displayName,
                avatar: profile.photos?.[0]?.value || "",
                bio: DEFAULT_BIO,
                location: "",
                dateOfBirth: null,
            },
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
}));
