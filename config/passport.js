// PassportJS Strategy and Verification Callback functions.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');

const User = require('../config/user');
const Admin = require('../config/admin');


// User ----------------------------------------

const oauth = {
    clientID: process.env.GIT_CLIENT_ID,
    clientSecret: process.env.GIT_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}

const gitVerifyCallback = async (accessToken, refreshToken, profile, done) => {

    const user = await User.findOne({ userid: profile.id });

    if (user)
        return done(null, user);

    User.create({
        userid: profile.id,
        displayname: profile.displayName,
        username: profile._json.login,
        avatarUrl: profile._json.avatar_url,
        profileUrl: profile.profileUrl,
        email: profile._json.email,
        bio: profile._json.bio,
        blog: profile._json.blog,
        publicRepo: profile._json.public_repos,
        followers: profile._json.followers,
        following: profile._json.following
    }, (err, user) => {
        return done(err, user);
    });
}

const gitStrategy = new GitHubStrategy(oauth, gitVerifyCallback);

passport.use(gitStrategy);




// Admin ----------------------------------------

const fields = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (email, password, done) => {
    Admin.findOne({ email: email })
        .then((admin) => {

            if (!admin) { return done(null, false) }

            //Comparing provided plaintext password and saved password hash
            const isValid = bcrypt.compareSync(password, admin.hash);

            if (isValid) {
                return done(null, admin);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}

// Local Strategy, email and password
const localStrategy = new LocalStrategy(fields, verifyCallback);
passport.use(localStrategy);


// Serialize User function with session cookies
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize User function, return user from id
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});