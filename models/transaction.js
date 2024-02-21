import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
  month: Number,
});

// Create model
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
