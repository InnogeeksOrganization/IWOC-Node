
// Routes for the express app

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../config/user");
const ProjectHandler = require("../config/ProjectHandler");
const UserHandler = require("../config/UserHandler");
const Project = require("../config/project")


const router = express.Router();

let tvisits = 0;

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
  // console.log("IWOC Landing Sending ",tvisits++);
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
    // console.log("Innogeeks Dashboard Sending", req.session.passport);
  }
);

// router.get("/project", async (req, res, next) => {
//   const projects = await Project.find();
//   res.render("project", {project : projects});
// });

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
    // console.log("Innogeeks Login Sending", req.session.passport);
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
    res.sendFile(path.join(__dirname, "../pages/form.html"));
    // console.log("Innogeeks Register Sending", req.session.passport);
  }
);

// 'Github Oauth' routes for PassportJS github strategy and verification callbacks.

router.get(
  "/auth/github",
  (req, res, next) => {
    // console.log(req.session);
    // console.log(req.user);
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
    // console.log(req.session);
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
    // console.log("Innogeeks Admin Login Sending", req.session.passport);
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
    // console.log("Innogeeks Admin Register Sending", req.session.passport);
  }
);

router.post(
  "/admin-login",
  passport.authenticate("local", {
    failureRedirect: "/admin-login",
    successRedirect: "/dashboard",
  })
);

router.post(
  "/register-project",
  async (req, res, next) => {
    // console.log(req.body);
    await ProjectHandler.addProject(req.body);

    // if(validateData(req.body)){
    //   await addProject(req.body);
    //   next();
    // }
    // else

  }, (req, res) => {
    res.send("Done");
  }
);

router.get(
  "/submit-project", (req, res) => {
    res.redirect("https://forms.gle/zhrY8EvbFZCty1tw9");
  }
);

router.post(
  "/register",
  async (req, res) => {
    // console.log(req.body);
    if(validateData(req.body)){
      const resp = await UserHandler.addUser(req.body);
      res.send(JSON.stringify(resp));
    }
    else{
      const resp = {message: "Invalid Data"};
      res.send(JSON.stringify(resp));
    } 
  }
);

async function validateData(data) {


  var regExp = /[0-9]/;

  if (data.name == '' || data.name == null || regExp.test(data.name))
    return false;

  var chkExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (data.email == '' || data.email == null || !chkExp.test(data.email)) 
    return false;
  
  if (data.libid == '' || data.libid == null) 
    return false;

  regExp = /[a-zA-Z]/g;

  if (data.phone == '' || data.phone == null || regExp.test(data.phone) || data.phone.length != 10) 
    return false;

  if (data.git == '' || data.git == null)
    return false;

  return true;
}

router.post("/admin-register", (req, res, next) => {
  // console.log(req.body);

  const hash = bcrypt.hashSync(req.body.password, 10);

  const newAdmin = new Admin({
    adminname: req.body.name,
    email: req.body.email,
    sessionid: req.sessionID,
    hash: hash,
  });

  newAdmin.save().then((user) => {
    // console.log(user);
  });

  res.redirect("/admin-login");
});

router.get("/maintenance", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/maintenance.html"));
  console.log("IWOC Maintenance Sending ",tvisits++);
});


module.exports = router;

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

