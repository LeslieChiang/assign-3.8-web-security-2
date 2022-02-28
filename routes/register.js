// Create a new set of route
const express = require("express");
const router = express.Router(); // create route

// bcrpyt
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Import db
const User = require("./model");
User.sync({ alter: true }).then(() => console.log("db is ready"));
console.log("User: ", User);

const registerUserPwd = async (req, res, next) => {
  let result = {
    message: null,
    status: null,
  };

  // look for user in the database
  const user = await User.findOne({
    where: { userName: req.body.username },
  });
  // console.log("user: ", user);

  if (!user) {
    // user.userName = req.body.username;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      // A callback function called after hash() complete.
      if (err) {
        // console.error(err);
        return res.json({
          error: "Server is not performing right now.",
          errorCode: "INTERNAL_ERROR",
        });
      } else {
        // console.log("Hash: ", hash, req.body.username);
        User.create({
          userName: req.body.username,
          passWord: hash,
        });
      }
    });
    result.status = 200;
    result.message = "Registration successful";
  } else {
    result.status = 400;
    result.message = "User already exists! Please login with password";
  }
  // const resultUser = await User.findAll();
  // console.log("\n attribute", JSON.stringify(resultUser));

  // Return results
  return res.json({ status: result.status, message: result.message });
};

router.get("/register", (request, response) => {
  return response.send("You have called a register route!");
});

router.post("/register", registerUserPwd);

module.exports = router;
