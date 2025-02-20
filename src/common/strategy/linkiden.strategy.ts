import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL as string,
      scope: ["r_liteprofile", "r_emailaddress"], // Kompaniya kerak emas
    },
    (accessToken: string, refreshToken: string, profile: any, done) => {
      try {
        console.log(profile);

        const user = {
          id: profile.id,
          fullName: profile.displayName,
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value,
        };

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
