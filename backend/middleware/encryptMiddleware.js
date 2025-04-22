const bcrypt = require("bcryptjs");

const encryptData = async (req, res, next) => {
  if (req.body.name) {
    req.body.name = await bcrypt.hash(req.body.name, 10);
  }
  next();
};

module.exports = encryptData;
