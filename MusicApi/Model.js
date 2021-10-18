const mongoose = require("mongoose");
const music = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artiste: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,

      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    cloud_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("musics", music);
