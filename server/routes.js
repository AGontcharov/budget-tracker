const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./database");

const saltRounds = 10;
const router = express.Router();

router.use((req, res, next) => {
  console.log(req.method, req.url);
  console.log(req.body);
  next();
});
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get()
    .collection("Users")
    .find({ username })
    .toArray((err, user) => {
      // TODO: err should return back 500 internal error
      if (err) throw err;

      // User not found
      if (!user.length) {
        return res
          .status(401)
          .json({ message: "Username or Password is incorrect." });
      }

      bcrypt.compare(password, user[0].password, (err, result) => {
        // User password mismatch
        if (!result) {
          return res.status(404).json({
            message: "Username or password is incorrect"
          });
        }

        // Create token
        const token = jwt.sign({ username }, "secret", {
          expiresIn: "2m"
        });
        res.cookie("access-token", token, { httpOnly: true });
        return res
          .status(200)
          .json({ message: "User successfully authenticated." });
      });
    });
});

// TODO: Is there a different way to structure this?
router.post("/user", (req, res) => {
  const { username, password } = req.body;

  db.get()
    .collection("Users")
    .find({ username })
    .toArray((err, user) => {
      // TODO: err should return back 500 internal error
      if (err) throw err;

      // User already exists
      if (user.length) {
        return res.status(409).json({ message: "Username already exists." });
      }

      // Auto generate salt and hash
      bcrypt.hash(password, saltRounds, (err, hash) => {
        // Store the hash of the password in the DB.
        db.get()
          .collection("Users")
          .insertOne(
            {
              username: username,
              password: hash
            },
            (err, result) => {
              // TODO: err should return back 500 internal error
              if (err) throw err;

              // Create token
              const token = jwt.sign({ username }, "secret", {
                expiresIn: "2m"
              });
              res.cookie("access-token", token, { httpOnly: true });
              return res
                .status(200)
                .json({ message: "User successfully created." });
            }
          );
      });
    });
});

module.exports = router;
