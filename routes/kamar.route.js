const express = require("express");
const app = express();
const {authorize} = require('../controllers/auth.controller')
const {isAdmin, isCustomer} = require('../middlewares/role-validation')
const kamarControllers = require('../controllers/kamar.controller')

app.use(express.json())


app.get("/", authorize, isAdmin, kamarControllers.getAllkamar)
app.get("/avalaible/:id", authorize, isCustomer, kamarControllers.getAvalaible)
app.get("/totalAvalaible", authorize, isAdmin, kamarControllers.sumAvalaible)
app.post("/add", authorize, isAdmin, kamarControllers.addKamar)
app.put("/update", authorize, isAdmin, kamarControllers.updateKamar)
app.delete("/delete/:id", authorize, isAdmin, kamarControllers.deleteKamar)

module.exports = app;