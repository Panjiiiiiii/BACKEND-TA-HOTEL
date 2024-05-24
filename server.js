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
const typeRoute = require("./routes/tipe_kamar.route")
const auth = require("./routes/auth.route")
const roomRoute = require("./routes/kamar.route")
const bookingRoute = require("./routes/pemesanan.route")

app.use("/user", userRoute);
app.use("/type",  typeRoute)
app.use("/room", roomRoute)
app.use("/booking", bookingRoute)
app.use("/auth", auth)

app.use(express.static(__dirname))

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});
