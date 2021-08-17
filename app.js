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

app.all("*", (req, res) =>
  res.send("THIS ROUTE IS SO QUIET AND EMPTY. IT HURTS.")
);

app.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT 1927 or ${process.env.PORT}`);
});
