const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: "https://tse2.mm.bing.net/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&pid=Api&P=0&h=180"
  },
  //whether checking admin or not
  isAdmin : {
    type: Boolean,
    default: false
  }
},  {timestamps: true}
)

const User = mongoose.model('User', userSchema);

module.exports = User;