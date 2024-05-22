const bodyParser = require("body-parser");
const { sequelize } = require("../models/index");

const tipeModel = require("../models/index").tipe_kamar;
const pemesananModel = require("../models/index").pemesanan;
const detailModel = require("../models/index").detail_pemesanamn;
const kamarModel = require("../models/index").kamar;
const Op = require("sequelize").Op;
const express = require("express");

const app = express();

app.use(bodyParser.json());
app.use(express.json());

//get pemesanan by user
exports.getAllpemesanan = async (req, res) => {
  let pemesanan = await pemesananModel.findAll();
  return res.json({
    succsess: true,
    data: pemesanan,
    message: `All datas have been loaded`,
  });
};

exports.getAllCheckIn = async (req, res) => {
  let pemesanan = await pemesananModel.findAll({
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
  let pemesanan = await pemesananModel.findAll({
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
//get pemesanan by id
app.get("/findById/:id", (req, res) => {
  pemesanan
    .findAll({
      where: { id_user: req.params.id },
    })
    .then((result) => {
      res.json({
        pemesanan: result,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});
//pemesanan kamar hotel
app.post("/", async (req, res) => {
  // Mendapatkan timestamp saat ini
  let tw = Date.now();

  // Membuat nomor pemesanan acak
  let numberRandom = Math.floor(
    Math.random() * (10000000 - 99999999) + 99999999
  );

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

  // Mendapatkan data kamar berdasarkan tipe kamar
  let dataKamar = await kamarModel.findAll({
    where: {
      id_tipe_kamar: requestData.id_tipe_kamar,
    },
  });

  // Mendapatkan data tipe kamar berdasarkan id
  let dataTipeKamar = await tipeModel.findOne({
    where: { id_tipe_kamar: requestData.id_tipe_kamar },
  });

  // Mendapatkan data pemesanan kamar dalam rentang tanggal
  let dataPemesanan = await tipeModel.findAll({
    attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
    where: { id_tipe_kamar: requestData.id_tipe_kamar },
    include: [
      {
        model: kamarModel,
        as: "kamar",
        attributes: ["id_kamar", "id_tipe_kamar"],
        include: [
          {
            model: detailModel,
            as: "detail_pemesanan",
            attributes: ["tgl_akses"],
            where: {
              tgl_akses: {
                [Op.between]: [
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
    dataKamar == null ||
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
    await pemesananModel
      .create(requestData)
      .then(async (result) => {
        // Proses untuk menambahkan detail pemesanan
        for (let i = 0; i < dayTotal; i++) {
          for (let j = 0; j < roomsDataSelected.length; j++) {
            let tgl_akses = new Date(checkInDate);
            tgl_akses.setDate(tgl_akses.getDate() + i);
            let requestDataDetail = {
              id_pemesanan: result.id_pemesanan,
              id_kamar: roomsDataSelected[j].id_kamar,
              tgl_akses: tgl_akses,
              harga: dataTipeKamar.harga,
            };
            // Menambahkan detail pemesanan ke database
            await detail_pemesanan.create(requestDataDetail);
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
});

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
  let dataKamar = await sequelize.query(`SELECT tipe_kamars.*, kamars.id as id_kamar, kamars.nomor_kamar, kamars.status FROM tipe_kamars LEFT OUTER JOIN kamars ON tipe_kamars.id = kamars.id_tipe_kamar;`)

  console.log(dataKamar[0]);

  return res.json({
    data: dataKamar[0],
  });
};
