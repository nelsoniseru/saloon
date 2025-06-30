const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const auth = require('../middleware/authMiddleware');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users'); 

router.get('/login', controller.loginPage);
router.get('/register', controller.registerPage);
router.get('/dashboard',auth, controller.dashboard);
router.get('/transactions',auth, controller.tdashboard);
router.get('/customers',auth, controller.cdashboard);
router.get('/user-profile',auth, controller.userProfile);
router.get('/dashboard-prof',auth, controller.dash);
router.post('/booking',auth, controller.Booking);
const schema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email cannot be empty',
        'string.email': 'Enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
      })
  });
  
  const registerSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email cannot be empty',
      'string.email': 'Enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    }),
    contact: Joi.string().required().messages({
      'string.empty': 'Contact cannot be empty',
      'any.required': 'Contact is required'
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Address cannot be empty',
      'any.required': 'Address is required'
    }),
  });



  router.post('/login', async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error)  return  res.render('login', {
        error:error.details[0].message,
        success: null
      });
  
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return  res.render('login', {
            error: 'Invalid email or password',
            success: null
          });
      }
  
      const token = jwt.sign({ id: user._id, email: user.email }, "nelsoniseru", {
        expiresIn: '3d'
      });
  
      res.cookie('token', token, {
        path: '/',
        maxAge: 3 * 24 * 60 * 60 * 1000,
        secure: false, // set to true if using HTTPS
        sameSite: 'lax'
      });     
      if(user.role==="admin") return res.redirect('/dashboard');
      if(user.role==="user") return res.redirect('/user-profile');
  
    } catch (err) {
      console.error('Login error:', err.message);
      res.render('login', { error: 'Something went wrong. Please try again.' });
    }
  });


  
  router.post('/register', async (req, res) => {
    console.log(req.body)

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.render('register', {
        error: error.details[0].message,
        success: null
      });
    }
  
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.render('register', {
          error: 'Email already registered',
          success: null
        });
      }
  
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        contact: req.body.contact,
        location: req.body.location,
        role:"user"
      });
  
      await newUser.save();
      return res.render('login', {
        error:null,
        success:'membership registration successful'
      });
  
    } catch (err) {
      console.error('Registration error:', err.message);
      res.render('register', {
        error: 'Something went wrong. Please try again.',
        success: null
      });
    }
  });
  router.get('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
     res.redirect('/login');
  });

  
   router.post("/token",(req,res)=> {
    const token = req.body.token;
    if (!token) return res.redirect('/login');
  
    jwt.verify(token, "nelsoniseru", (err, user) => {
      if (err) {
        res.clearCookie('token', { path: '/' });
        return res.send({status:false,message:"invalid token"});
      }
      req.user = user;
      return res.send({status:true,data:req.user});
    })
  })
  
module.exports = router;
