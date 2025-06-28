const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  jwt.verify(token, "nelsoniseru", (err, user) => {
    if (err) {
      res.clearCookie('token', { path: '/' });
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
