import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Strategy as SlackStrategy } from "passport-slack-oauth2";
import { Strategy as GitLabStrategy } from "passport-gitlab2";
import { Strategy as TwitterStrategy } from "@superfaceai/passport-twitter-oauth2";
import { Strategy as TwitchStrategy } from "passport-twitch-new";

import User from "../models/user.model.js";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const handleOAuthUser = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id });

    if (!user) {
      const name =
        profile.displayName ||
        profile.username ||
        (profile.emails && profile.emails[0] ? profile.emails[0].value.split("@")[0] : "User");

      user = await User.create({
        providerId: profile.id,
        provider: profile.provider,
        displayName: name,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : "",
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

// --- Google Strategy ---
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

// --- Facebook Strategy ---
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos"],
    },
    handleOAuthUser
  )
);

// --- GitHub Strategy ---
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

// --- LinkedIn OpenID Strategy ---
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
      profile.provider = "linkedin";
      handleOAuthUser(null, null, profile, done);
    }
  )
);

// --- Spotify Strategy ---
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK_URL,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'spotify' });

        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: 'spotify',
            displayName: profile.displayName || profile.username || 'User',
            email: profile.emails?.[0]?.value || '',
            spotifyId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- Discord Strategy ---
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'discord' });

        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: 'discord',
            displayName: profile.username || 'User',
            email: profile.email || '',
            discordId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- Slack Strategy ---
passport.use(
  'slack',
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      callbackURL: process.env.SLACK_CALLBACK_URL,
      scope: ['identity.basic', 'identity.email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'slack' });

        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: 'slack',
            displayName: profile.displayName || profile.user?.name || 'User',
            email: profile.user?.email || '',
            slackId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- GitLab Strategy ---
passport.use(
  new GitLabStrategy(
    {
      clientID: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      callbackURL: process.env.GITLAB_CALLBACK_URL,
      baseURL: "https://gitlab.com/",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'gitlab' });

        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: 'gitlab',
            displayName: profile.displayName || profile.username || 'User',
            email: profile.emails?.[0]?.value || '',
            gitlabId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- X (Twitter) OAuth 2.0 Strategy ---

passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      clientType: "confidential",
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      scope: ["users.read", "tweet.read", "offline.access"], // 👈 ADD SCOPE HERE DIRECTLY
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const twitterId = profile.id || profile._json?.data?.id;

        if (!twitterId) {
          return done(new Error("Failed to retrieve Twitter user ID"), null);
        }

        let user = await User.findOne({ providerId: twitterId, provider: "twitter" });

        if (!user) {
          user = await User.create({
            providerId: twitterId,
            provider: "twitter",
            displayName: profile.displayName || profile.username || profile._json?.data?.name || "Twitter User",
            email: profile.emails?.[0]?.value || "",
            twitterId: twitterId,
          });
        }
        return done(null, user);
      } catch (err) {
        console.error("Twitter Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

// --- Twitch Strategy ---
passport.use(
  new TwitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: process.env.TWITCH_CALLBACK_URL,
      scope: "user:read:email",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'twitch' });

        if (!user) {
          user = await User.create({
            providerId: profile.id,
            provider: 'twitch',
            displayName: profile.display_name || profile.login || 'User',
            email: profile.email || '',
            twitchId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;