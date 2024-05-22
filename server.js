const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const app = express();

app.use(cors());
app.use(express.json())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const PORT = 7000;

const userRoute = require("./routes/user.route");
const tipeRoute = require("./routes/tipe_kamar.route")
const auth = require("./routes/auth.route")
const kamarRoute = require("./routes/kamar.route")
const pemesanan = require("./routes/pemesanan.route")

app.use("/user", userRoute);
app.use("/tipe_kamar", tipeRoute)
app.use("/kamar", kamarRoute)
app.use("/pemesanan", pemesanan)
app.use("/auth", auth)

app.use(express.static(__dirname))

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
