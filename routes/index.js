
// Routes for the express app

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../config/user");
const ProjectHandler = require("../config/ProjectHandler");
const UserHandler = require("../config/UserHandler");
const Project = require("../config/project")
const event = require("../config/event")


const router = express.Router();

let tvisits = 0;

// Checks if a user/ admin of the provided id exists in Mongo
async function Exists(id) {
  const user = await User.findById(id);
  if (user !== null)
      return true;

  return false;
  // const admin = await Admin.findById(id);
  // return admin !== null;
}

async function Registered(id) {
  const user = await User.findById(id);
  if (user.libid)
      return true;

  return false;
  // const admin = await Admin.findById(id);
  // return admin !== null;
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
    if (await Registered(req.session.passport.user))
      next();
    else{
      await User.deleteOne({_id:req.session.passport.user});
      res.redirect("/unauthenticated");
    } 
  },
  async (req, res, next) => {
    const user = await User.findById(req.session.passport.user);

    res.render("dashboard", { user: user });
    // console.log("Innogeeks Dashboard Sending", req.session.passport);
  }
);

router.get("/project", async (req, res, next) => {
  const projects = await Project.find();
  res.render("project", {project : projects});
});

router.get("/projects", async (req, res, next) => {
  const projects = await Project.find();
  res.render("project", {project : projects});
});

router.get("/unauthenticated", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../pages/unauthenticated.html"));
});

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
      next();
    else res.sendFile(path.join(__dirname, "../pages/login.html"));
  },
  async (req, res, next) => {
    if (await Registered(req.session.passport.user))
      res.redirect("/dashboard");
    else
      next();
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
      next();
    else res.sendFile(path.join(__dirname, "../pages/form.html"));
  },
  async (req, res, next) => {
    if (await Registered(req.session.passport.user))
      res.redirect("/dashboard");
    else
      next();
  },
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "../pages/form.html"));
    // console.log("Innogeeks Register Sending", req.session.passport);
  }
);

router.get("/eventRegistration", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/event_registration.html"));
})

router.get(
  "/dashboard/leaderboard",
  async (req, res, next) => {
    if (req.session.passport && (await Exists(req.session.passport.user)))
      next();
    else res.redirect("/login");
  },
  async (req, res, next) => {
    if (await Registered(req.session.passport.user))
      next();
    else{
      await User.deleteOne({_id:req.session.passport.user});
      res.redirect("/unauthenticated");
    } 
  },
  async (req, res, next) => {
    const user_t = await User.findById(req.session.passport.user);
    const users = await User.find();
    await users.sort(function(a, b){return b.score - a.score});
    const rank = users.map(e => e.username).indexOf(user_t.username) + 1;
    if(req.query.user){
      const user = await User.findOne({username:req.query.user});
      res.render("history", { user_t:user_t,user: user,rank:rank });
    }
    else{ 
      res.render("leaderboard", { user: user_t,users: users, rank:rank});
    }
    
    // console.log("Innogeeks Dashboard Sending", req.session.passport);
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
    await ProjectHandler.addProject(req.body);

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

router.post(
  "/eventRegister",
  async (req, res) => {
    if(validateData(req.body)){
      const allUsers = await event.find();
      if(allUsers.find(user => user.libid === req.body.libid)){
        resp = {
          status: 409,
          id: 3,
          title: `❌ Library ID "${req.body.libid}" Already Exists`,
          message: "You have already registered"
      }
        return res.send(JSON.stringify(resp));
      }
      if(allUsers.find(user => user.email === req.body.email)){
        resp = {
          status: 409,
          id: 3,
          title: `❌ Email "${req.body.email}" Already Exists`,
          message: "You have already registered"
      }
        return res.send(JSON.stringify(resp));
      }
      if(allUsers.find(user => user.phone === req.body.phone)){
        resp = {
          status: 409,
          id: 3,
          title: `❌ Phone number "${req.body.phone}" Already Exists`,
          message: "You have already registered"
      }
        return res.send(JSON.stringify(resp));
      }
      await event.create(req.body)
      resp = {
        status: 200,
        id: 1,
        title: "✔Registration Successfull!",
        message: "Let's make this winter hot!🔥"
    }
      return res.send(JSON.stringify(resp));
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

  const hash = bcrypt.hashSync(req.body.password, 10);

  const newAdmin = new Admin({
    adminname: req.body.name,
    email: req.body.email,
    sessionid: req.sessionID,
    hash: hash,
  });

  newAdmin.save().then((user) => {
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

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/404.html"));
})

