const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
  },
  contact: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  role:{
    type: String,
    enum: ["admin", "user"],  
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User
async function a(){
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash("Admin@2024", saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  User.create({
      email:"admin@teezcut.com",
      password:hashedPassword,
      verified:true,
      role:"admin"
  }).then(e=>{
      console.log("yes created")
  })
  }
 //a()
//  User.find().then(e=>{
//   console.log(e)
//  })
 //685f9f29d99aea17814daaa2
 //685f9eb027427e051508f294
//  User.deleteOne({_id:"685f9eb027427e051508f294"}).then(e=>{
//   console.log(e)
//  })