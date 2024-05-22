const express = require("express");
const app = express();
const {authorize} = require('../controllers/auth.controller')
const {validateUser} = require('../middlewares/user-validation')
const {isAdmin, isCustomer} = require('../middlewares/role-validation')
const tipeControllers = require('../controllers/tipe_kamar.controller')

app.use(express.json())

app.get("/", tipeControllers.getAllType)
app.get("/count", authorize,isAdmin, tipeControllers.CountType)
app.post("/find/:keyword", authorize,isAdmin, tipeControllers.findType)
app.post("/insert", authorize, isAdmin, tipeControllers.addType)
app.put("/update/:id", authorize, isAdmin, tipeControllers.updateType)
app.delete("/delete/:id", authorize, isAdmin, tipeControllers.deleteType)

module.exports = app;