const app = require("express")();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");
require('dotenv').config()


app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

// Set up express-handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// User and Mongoose code
const User = require("./models/User");
const mongoose = require("mongoose");
const cleanDb = require('./seeds/clean');

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  }
  else {
    mongoose.connect("mongodb://localhost/passport-assignment")
      .then(() => {
        cleanDb().then(() => {
          next()
        })
      });
  }
});



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Require and use Facebook Strategy
const {
  facebookStrategy
} = require("./strategies/facebook");

passport.use(facebookStrategy());




// Facebook Auth Routes
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

// app.use(fbPicturesMiddleware());



app.get("/", (req, res) => {
  if (req.user) {
    res.render("home", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000);



