const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");
require("dotenv").config();

const userController = express.Router();
userController.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;

  if (!(email && password && name)) {
    return res.status(400).json({ message: "Please fill all the details" });
  }

  try {
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login!" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.json({ token, name: newUser.name });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userController.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.json({ token, name: req.user.name });
  }
);

userController.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userController.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.json({ token, name: req.user.name });
  }
);

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/user/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          return cb(null, user);
        }

        const newUser = await UserModel.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });

        return cb(null, newUser);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

module.exports = { userController };
