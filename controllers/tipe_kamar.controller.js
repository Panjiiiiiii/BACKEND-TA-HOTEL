const tipeModel = require("../models/index").tipe_kamar;
const Op = require("sequelize").Op;
const path = require("path");
const fs = require("fs");
const upload = require("./upload-foto-tipe_kamar.controller").single(`foto`);

exports.getAllType = async (req, res) => {
  let tipe = await tipeModel.findAll();
  return res.json({
    succsess: true,
    data: tipe,
    message: "All tipe kamar have been loaded",
  });
};

exports.findType = async (req, res) => {
  let keyword = req.params.keyword;

  let tipe = await tipeModel.findAll({
    where: {
      [Op.or]: [
        { nama_tipe_kamar: { [Op.substring]: keyword } },
        { harga: { [Op.substring]: keyword } },
        { deskripsi: { [Op.substring]: keyword } },
        { foto: { [Op.substring]: keyword } },
      ],
    },
  });
  return res.json({
    succsess: true,
    data: tipe,
    message: "Tipe kamar have been finded",
  });
};

exports.addType = (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.json({ message: error });
    }
    let newType = {
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: Number(req.body.harga),
      deskripsi: req.body.deskripsi,
      foto: req.file.filename,
    };
    await tipeModel
      .create(newType)
      .then((result) => {
        return res.json({
          success: true,
          data: result,
          message: "New tipe kamar have been added",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateType = (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    } else {
      // If no error occurred during upload, continue processing the request.
      let id = req.params.id;
      let newTypes = {
        nama_tipe_kamar: req.body.nama_tipe_kamar,
        harga: Number(req.body.harga),
        deskripsi: req.body.deskripsi,
      };

      if (req.file) {
        const selectedType = await tipeModel.findOne({ where: { id: id } });
        const oldFotoType = selectedType.foto;
        const pathFoto = path.join(
          __dirname,
          "../images/customer",
          oldFotoType
        );

        if (fs.existsSync(pathFoto)) {
          fs.unlink(pathFoto, (error) => console.log(error));
        }
      }

      tipeModel
        .update(newTypes, { where: { id: id } })
        .then((result) => {
          return res.json({
            success: true,
            message: "Data has been updated",
          });
        })
        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    }
  });
};

exports.deleteType = async (req, res) => {
  let id = req.params.id;

  const type = await tipeModel.findOne({ where: { id: id } });
  const oldFotoType = type.foto;
  const pathFoto = path.join(__dirname, "../images/customer", oldFotoType);
  if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, (error) => console.log(error));
  }

  tipeModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return res.json({
        succsess: true,
        code: res.statusCode,
        message: "Data has been updated",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        succsess: false,
        message: error.message,
      });
    });
};

exports.CountType = async (req, res) => {
  try {
    const count = await sequelize.query(
      `SELECT COUNT(id_tipe_kamar) as total_tipe FROM tipe_kamars`
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
