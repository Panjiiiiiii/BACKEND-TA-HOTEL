const express = require("express");
const app = express();
const {authorize} = require('../controllers/auth.controller')
const {isAdmin, isCustomer} = require('../middlewares/role-validation')
const roomControllers = require('../controllers/kamar.controller')

app.use(express.json())


app.get("/", authorize, isAdmin, roomControllers.getAllkamar)
app.get("/avalaible/:id", authorize, isCustomer, roomControllers.getAvalaible)
app.get("/totalAvalaible", authorize, isAdmin, roomControllers.sumAvalaible)
app.post("/add", authorize, isAdmin, roomControllers.addKamar)
app.put("/update", authorize, isAdmin, roomControllers.updateKamar)
app.delete("/delete/:id", authorize, isAdmin, roomControllers.deleteKamar)

module.exports = app;