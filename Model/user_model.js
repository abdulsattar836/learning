const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: [{ type: String }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      default: null, // Optional if not required at user creation
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type
      },
      coordinates: {
        type: [Number], // Array of numbers for longitude and latitude
        required: true,
      },
    },
  },
  { timestamps: true }
);
userSchema.index({location:"2dsphere"})
const userSchemaData = mongoose.model("User", userSchema);
module.exports = userSchemaData;
