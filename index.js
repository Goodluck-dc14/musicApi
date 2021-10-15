require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 2001;
const app = express();
const cors = require("cors");
app.use(express.json());

mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
});

mongoose.connection
  .on("open", (req, res) => {
    console.log("Database is connected successfully");
  })
  .once("error", (req, res) => {
    console.log("failed to connect to database");
  });

app.get("/", async (req, res) => {
  res.send("music api build by codelab student");
});

app.use(cors());

app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});
