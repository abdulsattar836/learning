const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ProductImage: [
      {
        type: String,
        required: true,
      },
    ],
    ProductName: {
      type: String,
      required: true,
    },
    ProductPrice: {
      type: Number,
      required: true,
    },
    StockQuantity: {
      type: Number,
      required: true,
    },
    ProductDescription: {
      type: String,
      required: true,
    },
    SelectStatus: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const productSchemaData = mongoose.model("Product", productSchema);
module.exports = productSchemaData;
