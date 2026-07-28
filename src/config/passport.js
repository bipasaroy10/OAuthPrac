import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";
import { Strategy as GitHubStrategy } from "passport-github2";
// import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import User from "../models/user.model.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Shared verification logic
// config/passport.js

const handleOAuthUser = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id });

    if (!user) {
      // Determine display name with proper fallbacks
      const name =
        profile.displayName ||
        profile.username ||
        (profile.emails && profile.emails[0] ? profile.emails[0].value.split("@")[0] : "User");

      user = await User.create({
        providerId: profile.id,
        provider: profile.provider,
        displayName: name, // Guaranteed non-empty string
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : "",
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    handleOAuthUser
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos"], // Removed 'emails'
    },
    handleOAuthUser
  )
);



passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    handleOAuthUser
  )
);

// --- LINKEDIN OPENID CONNECT STRATEGY ---
passport.use(
  "linkedin",
  new OpenIDConnectStrategy(
    {
      issuer: "https://www.linkedin.com/oauth",
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
      userInfoURL: "https://api.linkedin.com/v2/userinfo",
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      scope: ["openid", "profile", "email"],
    },
    (issuer, profile, done) => {
      // Map OpenIDConnect profile format to standard OAuth user
      profile.provider = "linkedin";
      handleOAuthUser(null, null, profile, done);
    }
  )
);



// Microsoft Strategy
// passport.use(
//   new MicrosoftStrategy(
//     {
//       clientID: process.env.MICROSOFT_CLIENT_ID,
//       clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//       callbackURL: "/auth/microsoft/callback",
//       scope: ["user.read"],
//     },
//     handleOAuthUser
//   )
// );

export default passport;