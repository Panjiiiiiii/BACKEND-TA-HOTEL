const express = require("express");
const app = express();
const {authorize} = require('../controllers/auth.controller')
const {validateUser} = require('../middlewares/user-validation')
const {isAdmin, isCustomer} = require('../middlewares/role-validation')
const typeControllers = require('../controllers/tipe_kamar.controller')

app.use(express.json())

app.get("/", typeControllers.getAllType)
app.get("/count", authorize,isAdmin, typeControllers.CountType)
app.post("/find/:keyword", authorize,isAdmin, typeControllers.findType)
app.post("/insert", authorize, isAdmin, typeControllers.addType)
app.put("/update/:id", authorize, isAdmin, typeControllers.updateType)
app.delete("/delete/:id", authorize, isAdmin, typeControllers.deleteType)

module.exports = app;