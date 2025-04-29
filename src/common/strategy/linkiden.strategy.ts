import passport from "passport";
import { LINKEDIN_ID, LINKEDIN_SECRET, LINKEDIN_CALLBACK_URL } from "../../config/env";
import {
  Strategy as OpenIDConnectStrategy,
  Profile,
} from "passport-openidconnect";

passport.use(
  "linkedin",
  new OpenIDConnectStrategy(
    {
      issuer: "https://www.linkedin.com/oauth",
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
      userInfoURL: "https://api.linkedin.com/v2/userinfo",
      clientID: LINKEDIN_ID as string,
      clientSecret: LINKEDIN_SECRET as string,
      callbackURL: LINKEDIN_CALLBACK_URL as string,
      scope: ["openid", "profile", "email"],
    },
    (
      issuer: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      const user = {
        name: profile.name?.givenName,
        email: profile.emails?.[0].value,
      };

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});
