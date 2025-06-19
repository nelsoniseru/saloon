const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerPage = (req, res) => res.render('register');
exports.loginPage = (req, res) => res.render('login');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashed });
  res.redirect('/login');
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send('No user found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send('Incorrect password');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  req.session.token = token;
  res.redirect('/dashboard');
};

exports.dashboard = (req, res) => res.render('dashboard', { user: req.user });
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
