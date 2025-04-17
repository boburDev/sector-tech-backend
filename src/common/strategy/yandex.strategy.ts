// import * as dotenv from "dotenv";
// dotenv.config();

import passport from "passport";
import { Strategy as YandexStrategy } from "passport-yandex";

passport.use(
  new YandexStrategy(
    {
      clientID: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
      callbackURL: process.env.YANDEX_CALLBACK_URL as string,
    },
    (accessToken: string, refreshToken: string, profile: any, done) => {
      try {
        const user = {
          id: profile.id,
          name: profile?.name?.familyName,
          email: profile.emails?.[0]?.value,
        };

        return done(null, user);
      } catch (error: any) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
