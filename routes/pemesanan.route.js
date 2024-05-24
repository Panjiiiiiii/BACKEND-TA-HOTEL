const express = require("express");
const app = express();
const bookingController = require("../controllers/pemesanan.controller");
const {validateUser} = require('../middlewares/user-validation')
const {authorize} = require('../controllers/auth.controller')
const {isCustomer,isAdmin} = require('../middlewares/role-validation')

app.use(express.json());

app.post("/",  bookingController.bookRoom)

module.exports = app;
