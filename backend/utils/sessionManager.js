const { verifyJWT } = require("./token");
const userModel = require("../modules/users/user.model");

const checkRole = (sysRole) => async (req, res, next) => {
  try {
    const token = req.headers.access_token || "";
    if (!token) throw new Error("Access token is required");

    // Provide a valid JWT secret key when verifying the token
    const data = verifyJWT(token, process.env.JWT_SECRET);
    if (!data) throw new Error("Permission Denied");

    const { data: user } = data;
    const { email } = user;

    const userData = await userModel.findOne({ email, isActive: true });
    if (!userData) throw new Error("User not found");

    console.log(userData, sysRole);

    const isValidRole = sysRole.some((role) => userData.roles.includes(role));

    if (!isValidRole) throw new Error("Permission Denied");

    req.currentUser = userData._id;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { checkRole };
