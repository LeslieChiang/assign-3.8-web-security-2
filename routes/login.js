// Create a new set of route
const express = require("express");
const router = express.Router(); // create route

// bcrpyt
const bcrypt = require("bcrypt");

// jwt
const jwt = require("jsonwebtoken");
const fs = require("fs");
// Private RS256 key
const rs256Key = fs.readFileSync("./jwtRS256.key");

// Import db
const User = require("./model");

const loginUserPwd = async (req, res) => {
  let result = {
    message: null,
    status: null,
    jwt: null,
  };

  // look for user in the database
  const user = await User.findOne({
    where: { userName: req.body.username },
  });

  if (!user) {
    result.status = 400;
    result.message = "Please register a new user";
    return res.json({ status: result.status, message: result.message });
  }

  if (user) {
    // Verify user password
    bcrypt.compare(req.body.password, user.passWord, (err, resultMatch) => {
      // console.log("resultMatch", resultMatch);
      if (err) {
        return res.json({
          error: "Server is not performing right now.",
          errorCode: "INTERNAL_ERROR",
        });
      }

      if (!resultMatch) {
        result.status = 400;
        result.message = "Password is invalid";
        return res.json({ status: result.status, message: result.message });
      } else {
        // result.status = 200;
        // result.message = "Login successful";

        // Create JWT
        jwt.sign(
          req.body,
          rs256Key,
          { algorithm: "RS256", expiresIn: "30d" },
          (err, jwToken) => {
            if (err) {
              console.log(err);
              return res.json({
                error: "Server is not performing right now.",
                errorCode: "INTERNAL_ERROR",
              });
            }
            // console.log("jwtoken: ",jwToken);
            result.status = 200;
            result.message = "Login successful";
            result.jwt = jwToken;
            return res.json({
              status: result.status,
              message: result.message,
              jwt: result.jwt,
            });
          }
        );
      }

      // console.log("Result in bcrypt: ", result);
      // return res.json({ status: result.status, message: result.message });
      // return result;
    });

    // console.log("results after bcrypt: ", result);
    // return result;
  }

  // console.log("results after user found: ", result);

  // Return results
  // return res.json({ status: result.status, message: result.message });
};

router.get("/login", (request, response) => {
  return response.send("You have called a login route!");
});

router.post("/login", loginUserPwd);

module.exports = router;
