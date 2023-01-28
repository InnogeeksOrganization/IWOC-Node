const express = require('express');
const session = require('express-session');
const passport = require("passport");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const adminrouter = require('./routes/app.router');
require('dotenv').config();

require('./config/passport')
const routes = require('./routes');


const app = express();
mongoose.connect(process.env.DB_STRING, () => { console.log("Connected to MongoDB.") });


// Session Store for storing session data by express-sessions
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING,
  collection: "sessions",
});



// Compulsory Middlewares
app.use('/admin',adminrouter); //Admin route
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public',express.static(__dirname + '/public'));    //If static files does not load try: app.use(express.static('public'));


// Session Middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    autoRemove: 'native',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1-Day
        name: 'login'
    }
}))

app.use(passport.initialize());
app.use(passport.session());


// Rendering Engine Middleware (ejs)
app.set('view engine', 'ejs');


app.use(routes);

// Port for running instance

const PORT = process.env.PORT;


app.listen(PORT , (err) => {
  if(err){
    console.log(err);
  }else{
    console.log(`app is listening to port ` + PORT);
  }
});
