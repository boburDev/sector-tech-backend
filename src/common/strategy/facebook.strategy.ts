import * as dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as FaceBookStrategy } from "passport-facebook";

passport.use(
  new FaceBookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
      profileFields: ["id", "displayName", "name", "email"],
    },
    (accessToken: string, refreshToken: string, profile: any, done) => {
      try {
        const user = {
          name: profile.name?.givenName,
          email: profile.emails?.[0].value,
        };

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
