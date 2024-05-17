let tokenBlacklist = [];

// Middleware to check if a token is blacklisted
function checkBlacklist(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json('No authorization header');
  }

  //const parts = req.headers.authorization.split(' ');
  const parts = req.headers["authorization"].split(" ")

  if (parts.length !== 2) {
    return res.status(401).json('Malformed authorization header');
  }

  const token = parts[1];

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json('This token has been blacklisted');
  }

  next();
}


module.exports = {checkBlacklist, tokenBlacklist};
