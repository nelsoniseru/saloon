const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.session.token;
  if (!token) return res.redirect('/login');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.redirect('/login');
    req.user = decoded;
    next();
  });
};
