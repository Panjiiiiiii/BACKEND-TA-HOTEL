//import model
const bookingModel = require("../models/index").pemesanan;
const roomModel = require("../models/index").kamar;
const typeModel = require("../models/index").tipe_kamar;
const detailModel = require("../models/index").detail_pemesanan;
const {sequelize} = require('../models/index')


const Op = require(`sequelize`).Op;
const moment = require("moment");

exports.getAllPemesanan = async (req, res) => {
  try {
    const bookingData = await bookingModel.findAll();

    if (bookingData.length == 0) {
      return res.status(404).json({
        success: true,
        message: "empty data",
      });
    }
    return res.status(200).json({
      success: true,
      data: bookingData,
      message: "All data have been loaded",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

exports.getAllCheckIn = async (req, res) => {
  let pemesanan = await bookingModel.findAll({
    where: {
      status_pemesanan: "check_in",
    },
  });
  return res.json({
    succsess: true,
    data: pemesanan,
    message: `All datas have been loaded`,
  });
};

exports.getAllCheckOut = async (req, res) => {
  let pemesanan = await bookingModel.findAll({
    where: {
      status_pemesanan: "check_out",
    },
  });
  return res.json({
    succsess: true,
    data: pemesanan,
    message: `All datas have been loaded`,
  });
};

exports.filterKamar = async (req, res) => {
  try {
  } catch (error) {}
};

exports.bookRoom = async (req, res) => {
  try {
    // Mendapatkan timestamp saat ini
    let tw = Date.now();

    // Membuat nomor pemesanan acak
    let numberRandom =
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

    // Data pemesanan yang akan dibuat
    let requestData = {
      nomor_pemesanan: numberRandom,
      tgl_pemesanan: tw,
      tgl_check_in: req.body.tgl_check_in,
      tgl_check_out: req.body.tgl_check_out,
      nama_tamu: req.body.nama_tamu,
      jumlah_kamar: req.body.jumlah_kamar,
      id_tipe_kamar: req.body.id_tipe_kamar,
      status_pemesanan: req.body.status_pemesanan,
      id_user: req.body.id_user,
    };

    let CheckIn = moment(requestData.tgl_check_in).format("YYYY-MM-DD");
    let CheckOut = moment(requestData.tgl_check_out).format("YYYY-MM-DD");

    // Mendapatkan data kamar berdasarkan tipe kamar
    let dataKamar = await roomModel.findAll({
      where: {
        id_tipe_kamar: requestData.id_tipe_kamar,
      },
    });

    // Mendapatkan data tipe kamar berdasarkan id
    let dataTipeKamar = await typeModel.findOne({
      where: { id: requestData.id_tipe_kamar },
    });

    if (dataKamar == null || dataTipeKamar == null) {
      // Mengembalikan pesan kesalahan jika tidak memenuhi syarat
      return res.json({
        message: "Maaf, Kamar tidak tersedia",
      });
    }

    //Mendapatkan data pemesanan kamar dalam rentang tanggal
    let dataPemesanan = await typeModel.findAll({
      where: { id: requestData.id_tipe_kamar },
      include: [
        {
          model: roomModel,
          as: "kamar",
          where: { status: "booked" },
          include: [
            {
              model: detailModel,
              as: "detail_pemesanan",
              where: {
                tgl_akses: {
                  [Op.between]: [CheckIn, CheckOut],
                },
              },
              attributes: ["id_pemesanan", "tgl_akses"],
            },
          ],
          attributes: ["id", "nomor_kamar", "status"],
        },
      ],
      attributes: ["id", "nama_tipe_kamar"],
    });

    // Mendapatkan daftar id kamar yang sudah dipesan
    let bookedRoomIds = dataPemesanan[0].kamar.map((room) => room.id);

    // Filter kamar yang tersedia
    let availableRooms = dataKamar.filter(
      (room) => !bookedRoomIds.includes(room.id)
    );

    // Memilih kamar yang tersedia sesuai jumlah yang diminta
    let roomsDataSelected = availableRooms.slice(0, requestData.jumlah_kamar);

    // Menghitung durasi pemesanan dalam hari
    let checkInDate = new Date(requestData.tgl_check_in);
    let checkOutDate = new Date(requestData.tgl_check_out);
    const dayTotal = Math.round(
      (checkOutDate - checkInDate) / (1000 * 3600 * 24)
    );
    // Memeriksa apakah pemesanan memenuhi syarat
    if (
      availableRooms.length < requestData.jumlah_kamar ||
      dayTotal == 0 ||
      roomsDataSelected == null
    ) {
      // Mengembalikan pesan kesalahan jika tidak memenuhi syarat
      return res.json({
        message: "Maaf, kamar yang Anda pilih saat ini tidak tersedia",
      });
    } else {
      // Membuat pemesanan baru jika memenuhi syarat
      await bookingModel
        .create(requestData)
        .then(async (result) => {
          // Update the status of selected rooms in the database
          for (let room of roomsDataSelected) {
            await roomModel.update(
              { status: "booked" },
              { where: { id: room.id } }
            );
          }
          // Proses untuk menambahkan detail pemesanan
          for (let i = 0; i < dayTotal; i++) {
            for (let j = 0; j < roomsDataSelected.length; j++) {
              let tgl_akses = new Date(checkInDate);
              tgl_akses.setDate(tgl_akses.getDate() + i);
              let requestDataDetail = {
                id_pemesanan: result.id,
                id_kamar: roomsDataSelected[j].id,
                tgl_akses: tgl_akses,
                harga: dataTipeKamar.harga,
              };
              // Menambahkan detail pemesanan ke database
              await detailModel.create(requestDataDetail);
            }
          }
          // Mengembalikan respons sukses dengan data pemesanan
          return res.json({
            data: result,
            statusCode: res.statusCode,
            message: "Pemesanan baru telah dibuat",
          });
        })
        .catch((error) => {
          // Mengembalikan pesan kesalahan jika ada kesalahan dalam proses
          return res.json({
            message: error.message,
          });
        });
    }
  } catch (error) {}
};

exports.getExistingRoom = async (req, res) => {
  try {
    const { id_tipe_kamar, tgl_check_in, tgl_check_out } = req.body;

    let dataPemesanan = await tipe_kamar.findAll({
      attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
      where: { id: id_tipe_kamar },
      include: [
        {
          model: kamar,
          as: "kamar",
          attributes: ["id_kamar", "id_tipe_kamar"],
          include: [
            {
              model: detail_pemesanan,
              as: "detail_pemesanan",
              attributes: ["tgl_akses"],
              where: {
                tgl_akses: {
                  [operator.between]: [
                    requestData.tgl_check_in,
                    requestData.tgl_check_out,
                  ],
                },
              },
            },
          ],
        },
      ],
    });
  } catch (error) {}
};

exports.countTransaksi = async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT COUNT(id) as total_transaksi from pemesanans`
    );
    return res.json({
      succsess: true,
      datas: data[0],
      message: `Datas have been loaded`,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

exports.getCheckIn = async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT COUNT(status_pemesanan) as check_in from pemesanans WHERE status_pemesanan = 'check_in'`
    );

    return res.json({
      succsess: true,
      datas: data[0],
      message: `Datas have been loaded`,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

exports.getCheckOut = async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT COUNT(status_pemesanan) as check_out from pemesanans WHERE status_pemesanan = 'check_out'`
    );

    return res.json({
      succsess: true,
      datas: data[0],
      message: `Datas have been loaded`,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

exports.getKamar = async (req, res) => {
  let dataKamar = await sequelize.query(
    `SELECT tipe_kamars.*, kamars.id as id_kamar, kamars.nomor_kamar, kamars.status FROM tipe_kamars LEFT OUTER JOIN kamars ON tipe_kamars.id = kamars.id_tipe_kamar;`
  );

  console.log(dataKamar[0]);

  return res.json({
    data: dataKamar[0],
  });
};
