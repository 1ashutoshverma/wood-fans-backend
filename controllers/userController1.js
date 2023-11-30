require("dotenv").config();
const express = require("express");
const { UserModel } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userController = express.Router();

userController.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;

  if (email && name && password) {
    const user_exist = await UserModel.findOne({ email });

    if (user_exist) {
      return res
        .status(400)
        .json({ message: "User already exists please login!" });
    }

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.send(err);
      }
      const user = await UserModel.create({ email, password: hash, name });
      res.send({ message: "user signed up successfully" });
    });
  } else {
    res.status(400).json({ message: "Fill all the details" });
  }
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user_exist = await UserModel.findOne({ email });

    if (!user_exist) {
      return res
        .status(400)
        .json({ message: "User doesn't exist please sign up first!" });
    }

    bcrypt.compare(password, user_exist.password, function (err, result) {
      if (!result) {
        return res.status(400).json({ message: "User credentials are wrong" });
      }
      const token = jwt.sign(
        { userId: user_exist._id },
        process.env.JWT_SECRET
      );

      res.json({
        message: "login successful",
        token: token,
        name: user_exist.name,
      });
    });
  } else {
    res.status(400).json({ message: "Fill all the details" });
  }
});

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

  function (req, res) {
    // Successful authentication, redirect home.
    const token = jwt.sign({ userId: req.user.userId }, process.env.JWT_SECRET);

    // Send the token as a JSON response
    res.json({ token, name: req.user.name });
  }
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/user/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user_exist = await UserModel.findOne({
        email: profile._json.email,
      });

      if (user_exist && user_exist.googleId) {
        return cb(null, { userId: user_exist._id });
      } else {
        const user = await UserModel.create({
          googleId: profile.id,
          name: profile._json.name,
          email: profile._json.email,
        });

        return cb(null, { userId: user._id });
      }

      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
      //   });
      //   console.log(profile);
    }
  )
);

userController.get("/google", (req, res) => {});

module.exports = { userController };
