import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import UserModel from "../models/userModel.js";
import { Strategy as GitHubStrategy, } from "passport-github2";
// Only initialize OAuth strategies if credentials are available
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.SERVER_URL}/auth/google/callback`,
        passReqToCallback: true,
    }, async (req, _accessToken, _refreshToken, profile, done) => {
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
            const lastName = nameParts.slice(1).join(" ") || firstName;
            const DEFAULT_BIO = `Welcome to my profile! I'm just getting started here and looking forward to meeting new people, learning new things, and sharing great conversations. Stay tuned as I update more about myself!`;
            let location = "";
            if (profile._json) {
                const jsonData = profile._json;
                location =
                    jsonData.locale || jsonData.location || jsonData.country || "";
                if (jsonData.locale && !location.includes(",")) {
                    const localeMap = {
                        "en-US": "United States",
                        "en-GB": "United Kingdom",
                        "tr-TR": "Turkey",
                        "de-DE": "Germany",
                        "fr-FR": "France",
                        "es-ES": "Spain",
                        "it-IT": "Italy",
                        "pt-BR": "Brazil",
                        "ru-RU": "Russia",
                        "ja-JP": "Japan",
                        "ko-KR": "South Korea",
                        "zh-CN": "China",
                    };
                    location = localeMap[jsonData.locale] || jsonData.locale;
                }
            }
            if (!location && profile.emails?.[0]?.value) {
                const emailDomain = profile.emails[0].value.split("@")[1];
            }
            console.log("Google profile location extracted:", location);
            console.log("Google profile data available:", Object.keys(profile._json || {}));
            const newUser = await UserModel.create({
                username: `${profile.emails?.[0]?.value.split("@")[0]}-${Date.now()}`,
                email: profile.emails?.[0]?.value,
                profile: {
                    firstName,
                    lastName,
                    displayName,
                    avatar: profile.photos?.[0]?.value || "",
                    bio: DEFAULT_BIO,
                    location: location,
                    dateOfBirth: null,
                },
                provider: "google",
                providerId: profile.id,
                emailVerified: true,
            });
            return done(null, newUser);
        }
        catch (error) {
            return done(error, false);
        }
    }));
}
else {
    console.log("Google OAuth credentials not found, skipping Google strategy");
}
// Only initialize GitHub strategy if credentials are available
if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: `${config.SERVER_URL}/auth/github/callback`,
        scope: ["user:email"],
        passReqToCallback: true,
    }, async (req, _accessToken, _refreshToken, profile, done) => {
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
            const lastName = nameParts.slice(1).join(" ") || firstName; // Use firstName as lastName if no last name
            const DEFAULT_BIO = `Welcome to my profile! I'm just getting started here and looking forward to meeting new people, learning new things, and sharing great conversations. Stay tuned as I update more about myself!`;
            // Extract location from GitHub profile - try multiple sources
            let location = "";
            if (profile._json) {
                const jsonData = profile._json;
                location = jsonData.location || jsonData.company || "";
                if (location) {
                    location = location.trim();
                }
            }
            if (!location && profile.profileUrl) {
            }
            console.log("GitHub profile location extracted:", location);
            console.log("GitHub profile data available:", Object.keys(profile._json || {}));
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
                    location: location,
                    dateOfBirth: null,
                },
            });
            return done(null, newUser);
        }
        catch (error) {
            return done(error, false);
        }
    }));
}
else {
    console.log("GitHub OAuth credentials not found, skipping GitHub strategy");
}
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
export default passport;
