const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPage = (req, res) => res.render('register',{   error:null,success: null});
exports.loginPage = (req, res) => res.render('login',{   error:null,
  success: null});


exports.dashboard = async (req, res) =>{
 let customers = await User.find({role:"user"})
 console.log(customers)
  res.render('admin-dashboard',{customers,user:req.user});
}
exports.userProfile = (req, res) => {
  res.render('dashboard',{user:req.user});
}
 

