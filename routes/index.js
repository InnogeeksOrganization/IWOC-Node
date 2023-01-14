
// Routes for the express app

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../config/user");
const Admin = require("../config/admin");

const router = express.Router();

// Checks if a user/ admin of the provided id exists in Mongo
async function Exists(id) {
  const user = await User.findById(id);

  if (user !== null) return true;

  const admin = await Admin.findById(id);

  return admin !== null;
}

// Checks for unauthenticated access to '/' route
async function authManager(req, res, next) {
  if (req.session.passport && (await Exists(req.session.passport.user)))
    res.redirect("/dashboard");
  else res.redirect("/login");
}



router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/landing.html"));
});

router.get(
  "/dashboard",
  async (req, res, next) => {
    if (req.session.passport && (await Exists(req.session.passport.user)))
      next();
    else res.redirect("/login");
  },
  async (req, res, next) => {
    const user = await User.findById(req.session.passport.user);

    res.render("dashboard", { user: user });
    console.log("Innogeeks Dashboard Sending", req.session.passport);
  }
);

router.get(
  "/profile",
  async (req, res, next) => {
    if (req.session.passport && (await Exists(req.session.passport.user)))
      next();
    else res.redirect("/login");
  },
  async (req, res, next) => {
    const user = await User.findById(req.session.passport.user);
    res.render("profile", { user: user });
  }
);

router.get(
  "/login",
  async (req, res, next) => {
    if (req.session.passport && (await Exists(req.session.passport.user)))
      res.redirect("/dashboard");
    else next();
  },
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "../pages/login.html"));
    //console.log(req.session.passport);
    console.log("Innogeeks Login Sending", req.session.passport);
  }
);

router.get(
  "/register",
  async (req, res, next) => {
    if (req.session.passport && (await Exists(req.session.passport.user)))
      res.redirect("/dashboard");
    else next();
  },
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "../pages/register.html"));
    console.log("Innogeeks Register Sending", req.session.passport);
  }
);

// 'Github Oauth' routes for PassportJS github strategy and verification callbacks.

router.get(
  "/auth/github",
  (req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async function (req, res) {
    const user = await User.findById(req.session.passport.user);
    const d = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    user.sessions.push({ sessionid: req.sessionID, date: d });
    await user.save();
    console.log(req.session);
    res.redirect("/dashboard");
  }
);

// Admin (in-progress)-------------------------

async function adminExists(adminid) {
  const admin = await Admin.findById(adminid);
  return admin !== null;
}

router.get(
  "/admin-login",
  async (req, res, next) => {
    if (req.session.passport && (await adminExists(req.session.passport.user)))
      res.redirect("/dashboard");
    else next();
  },
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "../pages/admin-login.html"));
    console.log("Innogeeks Admin Login Sending", req.session.passport);
  }
);

router.get(
  "/admin-register",
  async (req, res, next) => {
    if (req.session.passport && (await adminExists(req.session.passport.user)))
      res.redirect("/dashboard");
    else next();
  },
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "../pages/admin-register.html"));
    console.log("Innogeeks Admin Register Sending", req.session.passport);
  }
);

router.post(
  "/admin-login",
  passport.authenticate("local", {
    failureRedirect: "/admin-login",
    successRedirect: "/dashboard",
  })
);

router.post("/admin-register", (req, res, next) => {
  console.log(req.body);

  const hash = bcrypt.hashSync(req.body.password, 10);

  const newAdmin = new Admin({
    adminname: req.body.name,
    email: req.body.email,
    sessionid: req.sessionID,
    hash: hash,
  });

  newAdmin.save().then((user) => {
    console.log(user);
  });

  res.redirect("/admin-login");
});

module.exports = router;

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});
