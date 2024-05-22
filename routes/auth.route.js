const express = require(`express`);
const app = express();
const { authenticate } = require("../controllers/auth.controller");

app.use(express.json());

app.post("/", authenticate);

module.exports = app;
