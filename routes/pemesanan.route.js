const express = require("express");
const app = express();
const bookingController = require("../controllers/pemesanan.controller");
const { validateUser } = require("../middlewares/user-validation");
const { authorize } = require("../controllers/auth.controller");
const { isCustomer, isAdmin } = require("../middlewares/role-validation");

app.use(express.json());

app.post("/",  bookingController.bookRoom)
app.get("/getOrder",  bookingController.getAllPemesanan)
app.get("/filterKamar", bookingController.filterKamar)
app.get("/getCheckIn", bookingController.getAllCheckIn)
app.get("/getCheckOut", bookingController.getAllCheckOut)
app.get("/bookingFilter", bookingController.bookingFilter)
app.post("/check_in", bookingController.checkIn)
app.post("/check_out", bookingController.checkOut)
app.post("/clear_status", bookingController.clearStatus)

module.exports = app;