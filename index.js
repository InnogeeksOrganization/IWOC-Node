const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

require('./config/passport')
const routes = require('./routes');


const app = express();

// Connection to MongoDB (Single-Default)
mongoose.connect(process.env.DB_STRING, () => { console.log("Connected to MongoDB.") });


// Session Store for storing session data by express-sessions
const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_STRING,
    collection: 'sessions'
})



// Compulsory Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public',express.static(__dirname + '/public'));



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


// Rendering Engine Middleware (ejs)
app.set('view engine', 'ejs');


app.use(routes);


// Port for running instance
app.listen(6969);
