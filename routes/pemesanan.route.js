const express = require("express");
const app = express();
const bookingController = require("../controllers/pemesanan.controller");
const { validateUser } = require("../middlewares/user-validation");
const { authorize } = require("../controllers/auth.controller");
const { isCustomer, isAdmin } = require("../middlewares/role-validation");

app.use(express.json());

app.post("/", bookingController.bookRoom);
// app.get("/getAdmin", authorize, isAdmin, bookingController.getAllpemesanan);
app.get("/getcheckin", authorize, isAdmin, bookingController.getAllCheckIn);
app.get("/getcheckout", authorize, isAdmin, bookingController.getAllCheckOut);
app.get("/SumTransaksi", authorize, isAdmin, bookingController.countTransaksi);
app.get("/checkin", authorize, isAdmin, bookingController.getCheckIn);
app.get("/checkout", authorize, isAdmin, bookingController.getCheckOut);
app.get("/kamar", authorize, isAdmin, bookingController.getKamar);
app.get("/getOrder", bookingController.getAllPemesanan);

module.exports = app;