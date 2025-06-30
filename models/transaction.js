const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 
  reference: {
    type: String,
    trim: true
  },
  plan_id: {
    type: String,
    trim: true
  },
  address:{
    type: String,
    trim: true
  },
  time: {
    type: Date,
    default: Date.now // optional: sets current time by default
  },
  date:{
    type: Date,
    default: Date.now // optional: sets current time by default

  },
  amount:{
    type: Number,
    trim: true
  },
  contact:{
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["Active", "Pending","Paid"],  
  },
  transaction_type:{
    type: String,
    enum: ["booking", "subscription"],  
  },

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction
