const jwt = require("jsonwebtoken");

const signJWT = (payload) => {
  return jwt.sign(
    {
      data: payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_DURATION }
  );
};

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generatedRandomToken = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports = { signJWT, verifyJWT, generatedRandomToken };
