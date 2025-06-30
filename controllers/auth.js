const User = require('../models/users');
const Transaction = require('../models/transaction');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPage = (req, res) => res.render('register',{   error:null,success: null});
exports.loginPage = (req, res) => res.render('login',{   error:null,
  success: null});

exports.Booking= async (req, res) =>{
  const {address,date,time,reference} = req.body
  console.log(req.body)
  const user=await User.findOne({_id:req.user.id})
  const fullDateTime = new Date(`${date}T${time}`);
let b = await Transaction.create({
    user:user._id,
    address,
    reference,
    status:"Pending",
    transaction_type:"booking",
    date,
    time:fullDateTime,
  })
  if(b) return   res.send({status:true,message:"success"})
  return   res.send({status:false,message:"failed"})
 }

exports.dashboard = async (req, res) =>{
 let customers = await User.find({role:"user"})
 let t = await Transaction.find({transaction_type:"booking"}).populate("user").sort({ createdAt: -1 });
 let a = await Transaction.find().then(transactions => {
  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalInNaira = totalAmount / 100;
  
  console.log('Total Amount in Naira:', totalInNaira);
  return totalInNaira;
});

let s = await Transaction.find({transaction_type:"subscription"})
let u = await User.find({role:"user"})

  res.render('admin-dashboard',{customers,user:req.user,t,a,s:s.length,u:u.length});
}
exports.tdashboard = async (req, res) =>{
  let customers = await User.find({role:"admin"})
  let a = await Transaction.find().then(transactions => {
    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalInNaira = totalAmount / 100;
    
    console.log('Total Amount in Naira:', totalInNaira);
    return totalInNaira;
  });
  
  let s = await Transaction.find({transaction_type:"subscription"})
  let u = await User.find({role:"user"})
  let t = await Transaction.find({}).populate("user").sort({ createdAt: -1 });
  console.log(a)
   res.render('admin-transaction',{customers,user:req.user,t,a,s:s.length,u:u.length});
}
exports.cdashboard = async (req, res) =>{
  let a = await Transaction.find().then(transactions => {
    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalInNaira = totalAmount / 100;
    
    console.log('Total Amount in Naira:', totalInNaira);
    return totalInNaira;
  });
  
  let s = await Transaction.find({transaction_type:"subscription"})
  let u = await User.find({role:"user"})
   res.render('customers',{customers,user:req.user,a,s:s.length,u:u.length});
}

exports.dash = async (req, res) =>{
  let user = await User.findOne({_id:req.user.id})
  if(user.role==="admin") return res.redirect('/dashboard');
  if(user.role==="user") return res.redirect('/user-profile');

 }

exports.userProfile =async (req, res) => {
  let userd = await User.findOne({_id:req.user.id})
  let t = await Transaction.find({user:req.user.id}).sort({   createdAt: -1 });
  res.render('dashboard',{user:req.user?req.user:null,t,userd});
}
 

