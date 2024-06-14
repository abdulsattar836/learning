const mongoose = require("mongoose"); 
const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    forgetPassword: {
      type: String,
      default: null,
    },
    refreshToken: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const vendorSchemaData = mongoose.model("vendor", vendorSchema);

module.exports = vendorSchemaData;
