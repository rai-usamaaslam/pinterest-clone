const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017//Pinterest");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  dp: {
    type: String,
    default: "",
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
