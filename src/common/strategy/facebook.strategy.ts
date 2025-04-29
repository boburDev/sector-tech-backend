import passport from "passport";
import { Strategy as FaceBookStrategy } from "passport-facebook";
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_CALLBACK_URL } from "../../config/env";

passport.use(
  new FaceBookStrategy(
    {
      clientID: FACEBOOK_APP_ID as string,
      clientSecret: FACEBOOK_APP_SECRET as string,
      callbackURL: FACEBOOK_CALLBACK_URL as string,
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
