//import model
const userModel = require("../models/index").user;
const Op = require(`sequelize`).Op;
const bcrypt = require(`bcrypt`);
const upload = require("./upload-foto-user.controller copy").single("foto");
const fs = require("fs");
const path = require("path");
const {sequelize} = require('../models/index')

exports.getAllUser = async (req, res) => {
  try {
    let dataUser = await userModel.findAll();

    return res.status(200).json({
      success: true,
      data: dataUser,
      message: "All Customer have been loaded",
    });
  } catch (error) {
    console.error("Error in getAlluser: ", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Data Customer is empty",
    });
  }
};

exports.getUser = async (req, res) => {
  let keyword = req.params.keyword;

  try {
    let dataUser = await userModel.findOne({
      where: {
        [Op.or]: [
          { username: { [Op.substring]: keyword } },
          { email: { [Op.substring]: keyword } },
          { role: { [Op.substring]: keyword } },
        ],
      },
    });

    return res.status(200).json(dataUser);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Member Not Found",
    });
  }
};

exports.addUser = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }

    if (!req.file) {
      return res.json({ message: "No uploaded file" });
    }

    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      foto: req.file.filename,
      role: req.body.role,
    };

    userModel
      .create(newUser)
      .then((result) => {
        return res.json({
          success: true,
          data: newUser,
          message: "New user has been inserted",
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to add user" });
      });
  });
};

exports.updateUser = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    let idUser = req.params.id;
    let dataUser = {
      username: req.body.username,
      password: req.body.password,
    };
    if (req.file) {
      const selectedCust = await userModel.findOne({
        where: { id: idUser },
      });

      const oldFoto = selectedCust.foto;

      const pathFoto = path.join(__dirname, `../images/customer`, oldFoto);

      if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, (error) => console.log(error));
      }
      dataUser.foto = req.file.filename;
    }

    userModel
      .update(dataUser, { where: { id: idUser } })
      .then((result) => {
        res.json({
          result: result,
          message: "data has been updated",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  });
};

exports.deleteUser = async (req, res) => {
  let idUser = req.params.id;
  const user = await userModel.findOne({ where: { id: idUser } });
  const oldFoto = user.foto;
  const pathFoto = path.join(__dirname, "../images/customer", oldFoto);

  if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, (error) => console.log(error));
  }

  userModel
    .destroy({ where: { id: idUser } })
    .then((result) => {
      return res.json({
        success: true,
        data: result,
        message: "Data user has been removed",
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: error.message,
      });
    });
};

exports.register = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }

    const existingUser = await userModel.findOne({
      where: { username: req.body.username },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }
    // if (!req.file) {
    //   return res.json({ message: "No uploaded file" });
    // }

    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      foto: null,
      role: "customer",
    };

    userModel
      .create(newUser)
      .then((result) => {
        return res.json({
          success: true,
          data: result,
          message: "New user has been inserted",
        });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Failed to add user" });
      });
  });
};

exports.resetPassword = async (req, res) => {
  try {
    let idUser = req.params.id;
    let oldPassword = bcrypt.hashSync(req.body.oldPassword, 10);
    let newPassword = bcrypt.hashSync(req.body.newPassword, 10);

    const user = await userModel.findOne({
      where: {
        id: idUser,
        password: oldPassword,
      },
    });

    if (user) {
      await userModel.update(
        { password: newPassword },
        { where: { id: idUser } }
      );
      return res.json({
        success: true,
        message: "Password has been updated",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Incorrect old password or user not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.countCustomer = async (req, res) => {
  try {
    const count = await sequelize.query(
      `SELECT COUNT(id) as total_customers FROM users where role like '%customer%' `
    );
    return res.json({
      success: true,
      datas: count[0],
      message: `All datas have been loaded`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
