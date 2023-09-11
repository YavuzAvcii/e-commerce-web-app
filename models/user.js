const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: String,
  password: String,
  userType: {
    type: String,
    enum: ["seller", "buyer"],
  },
  email: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
