const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const music = require("./Model");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "doxnfrmdd",
  api_key: "111997775637126",
  api_secret: "aqzZh8P5hBieIa0KB_O29pzocsw",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb("unsupported file format");
  }
};

const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

router.get("/", async (req, res) => {
  try {
    const getData = await music.find();
    res.status(200).json({
      msg: "found successfully",
      data: getData,
    });
  } catch (error) {
    res.status(404).json({
      error: "error",
      data: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getData = await music.findById(req.params.id);
    res.status(200).json({
      msg: "found successfully",
      data: getData,
    });
  } catch (error) {
    res.status(404).json({
      error: "error",
      data: error,
    });
  }
});

router.post("/", upload.single("avatar"), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  console.log(result);
  // res.json(result);
  try {
    const getData = await music.create({
      title: req.body.title,
      artiste: req.body.artiste,
      description: req.body.description,
      price: req.body.price,
      image: result.secure_url,
      filepath: req.file.path,
      cloud_id: result.public_id,
    });
    res.status(201).json({
      msg: "created successfully",
      data: getData,
    });
  } catch (error) {
    res.status(400).json({
      error: "error",
      data: error,
    });
  }
});

router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    let findID = await music.findById(req.params.id);

    await cloudinary.uploader.destroy(findID.cloud_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
      title: req.body.title || findID.title,
      artiste: req.body.artiste || findID.artiste,
      description: req.body.description || findID.description,
      price: req.body.price || findID.price,
      image: result.secure_url || findID.image,
      filepath: req.file.path || findID.filepath,
      cloud_id: result.public_id || findID.cloud_id,
    };
    findID = await music.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(findID);
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const findID = await music.findById(req.params.id);
    await cloudinary.uploader.destroy(findID.cloud_id);

    const deleted = await music.findByIdAndRemove(req.params.id, req.body);

    res.send("entry deleted");
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
});

module.exports = router;
