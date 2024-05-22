const express = require("express");
const app = express();
const {validateUser} = require('../middlewares/user-validation')
const {authorize} = require('../controllers/auth.controller')
const {isCustomer,isAdmin} = require('../middlewares/role-validation')
const userController = require("../controllers/user.controller");

app.use(express.json())

app.get("/", authorize, isAdmin, userController.getAllUser);
app.get("/count", authorize, isAdmin, userController.countCustomer)
app.post("/add", authorize, isAdmin, userController.addUser);
app.post("/register", userController.register);
app.post("/find/:keyword", authorize, isAdmin, userController.getUser);
app.put("/update/:id", authorize, isCustomer, validateUser, userController.updateUser);
app.put("/reset/:id", userController.resetPassword)
app.delete("/delete/:id", authorize, isAdmin, userController.deleteUser);

module.exports = app;
