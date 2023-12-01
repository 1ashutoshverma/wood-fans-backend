const { default: mongoose } = require("mongoose");

const productsSchema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["ArmChairs", "ChildrensFurniture", "Beds", "Sofas"],
  },
  sellerId: { type: mongoose.Types.ObjectId, required: true },
});

const ProductsModel = mongoose.model("product", productsSchema);

module.exports = { ProductsModel };
