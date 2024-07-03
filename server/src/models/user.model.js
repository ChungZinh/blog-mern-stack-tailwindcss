const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username });
};

userSchema.statics.findById = async function (id) {
  return this.findOne({ _id: id });
};

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
