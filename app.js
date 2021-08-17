const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: "*" }));

// const activitiesRoute = require("./routes/activitiesRoute"),

// app.use("/api/ot", activitiesRoute);

app.all("/", (req, res) => {
  res.status(200).send({
    code: 200,
    statustext: "OK",
    success: true,
    message: "API OF MIRЯOR APP",
  });
});

app.all("*", (req, res) => res.send(message));

app.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT 1927 or ${process.env.PORT}`);
});

const message = `Wrong Route Buddy. Please Do Not Be Sad, Here I'll Tell You An Iconic Story Of How Indonesia Got Its Freedom

Peristiwa Rengasdengklok Para pejuang dari golongan muda membawa Sukarno dan Hatta ke Rengasdengklok, dekat Karawang. Pengamanan pun berjalan lancar karena dibantu oleh Latief Hendraningrat yang merupakan prajurit PETA (Pembela Tanah Air) berpangkat Sudanco atau Komandan Kompi.

Tepat pada pukul 04.30 dini hari tanggal 16 Agustus 1945, Sukarno bersama Fatmawati dan putra sulungnya, Guntur, serta Hatta dibawa ke Rengasdengklok, kemudian ditempatkan di rumah seorang warga keturunan Tionghoa bernama Jiauw Ki Song.

Aksi "penculikan" ini semula dimaksudkan untuk menekan Sukarno dan Hatta agar bersedia segera memproklamirkan kemerdekaan, tetapi karena wibawa dua tokoh bangsa itu, para pemuda pun merasa segan. Di Jakarta, Achmad Soebardjo yang termasuk tokoh dari golongan tua mengetahui peristiwa tersebut. Ia lantas menemui Wikana, salah satu tokoh pemuda.

Pembicaraan pun dilakukan dan disepakati bahwa kemerdekaan harus segera dideklarasikan di Jakarta. Selanjutnya, Achmad Soebardjo bersama dengan Sudiro dan Jusuf Kunto menuju Rengasdengklok untuk menjemput Sukarno-Hatta dan membawa keduanya kembali ke Jakarta.

Pada hari itu juga, dilakukan pembicaraan terkait rencana pelaksanaan deklarasi kemerdekaan. Malam harinya, di kediaman Laksamana Muda Maeda, seorang perwira Jepang yang mendukung kemerdekaan Indonesia, dirumuskanlah naskah teks proklamasi.

Keesokan harinya, tanggal 17 Agustus 1945, Sukarno-Hatta membacakan teks proklamasi kemerdekaan Indonesia di Jalan Pegangsaan Timur No. 56, Jakarta. Indonesia pun merdeka dan bukan merupakan hadiah dari Jepang.

Source: https://tirto.id/f9kW`;
