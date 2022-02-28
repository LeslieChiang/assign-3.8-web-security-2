// Generate the app routes
const express = require("express");
const app = express();
app.use(express.json());

const registerRoute = require("./register");
const loginRoute = require("./login");

app.use(registerRoute);
app.use(loginRoute);

module.exports = app;

// POSTMAN: POST-body-raw-json: { "username": "Leslie", "password": "lesliwee" }
