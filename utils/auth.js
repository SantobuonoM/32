import passport from "passport";

export const authLog = passport.authenticate("login", {
  failureRedirect: "/faillogin",
});

export const authReg = passport.authenticate("register", {
    failureRedirect: "/failregister",
  });