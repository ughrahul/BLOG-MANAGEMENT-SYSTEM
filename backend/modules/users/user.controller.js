const userModel = require("./user.model");
const { mailer } = require("../../services/mailer");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const { signJWT, generatedRandomToken } = require("../../utils/token");

/*-------FEATURES--------------
- login
- register (bcryptjs)
- get profile
- update profile
- logout
- forget password
- reset password (admin)
- change passwords
---------------------------*/

//---------------Registration-----------------------//
const register = async (payload) => {
  try {
    // Hash the password before saving it to the database
    payload.password = hashPassword(payload.password);

    // Generate JWT token
    const token = await signJWT({
      name: payload.name,
      email: payload.email,
      roles: payload.roles,
    });

    // Add the generated token to the payload
    payload.token = token;

    // Create the user with the payload
    const user = await userModel.create(payload);

    // Check if user creation was successful
    if (!user) {
      throw new Error("Failed to create user in the database");
    }

    // Send registration email
    const result = await mailer(
      user.email,
      "User Signup",
      "User registered successfully"
    );

    // Check if email was sent successfully
    if (!result) {
      console.error("Failed to send registration email");
      // Log the error and continue with registration
    }

    return "User Registration completed";
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error; // Rethrow the error for higher-level handling
  }
};

//------------------Login---------------------------//
const login = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) throw new Error("Email or password missing");

  //check if user exists or not using email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new Error("User does not exist");

  //if user exists , get the hash password
  const { password: hashPw } = user;

  //compare the password
  const result = comparePassword(password, hashPw);

  //if password doesn't match
  if (!result)
    throw new Error("Email or Password mismatched. Please try again ");

  // Extract user information from the token payload
  const signingData = {
    name: user.name,
    email: user.email,
    roles: user.roles,
  };

  //if password matches, login into the system (access_token)
  const token = await signJWT(signingData);
  return token;
};

//------------Get Specific Profile-------------------//
const getById = (_id) => {
  return userModel.findOne({ _id });
};

//----------------------Update----------------------//
const updateById = (_id, payload) => {
  return userModel.updateOne({ _id }, payload);
};

//-----------Forgot Password(Part1)--------------------//
/*
1.in req.body (Email)
2.check if user exist or not using email
3.send the email with recovery token
4.store the token in server as well
5.compare the token,
6.if token matches , ask for new password
7.hash the password
8.update the database password for that email
*/

const generatefpToken = async (payload) => {
  const { email } = payload;
  if (!email) throw new Error("Email missing");

  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User doesn't exist");

  const randomToken = generatedRandomToken();
  await userModel.updateOne({ email }, { token: randomToken });

  const isEmailSent = await mailer(
    user.email,
    "Forget Password",
    `Your token is ${randomToken}`
  );
  if (isEmailSent) return "Forget Password token sent successfully";
};

//-----------Forgot Password(Part2)------------------------//
const verifyfpToken = async (payload) => {
  const { token, password, email } = payload;
  if (!token || !password || !email)
    throw new Error("Token, Password, Email is missing");

  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User is missing");

  const { token: verifyToken } = user;
  if (token !== verifyToken) throw new Error("Token mismatch");

  await userModel.updateOne(
    { email },
    { password: hashPassword(password), token: "" }
  );

  return "Password Updated Successfully";
};

//----------Reset Password(Only Admin)--------------//
const resetPassword = (payload) => {
  const { userId, password } = payload;
  if (!userId || !password) throw new Error("User ID or Password is missing");
  return userModel.updateOne(
    { _id: userId },
    { password: hashPassword(password) }
  );
};

//--------------Change password---------------------//
const changePassword = async (payload) => {
  const { userId, oldPassword, newPassword } = payload;
  if (!userId || !oldPassword || !newPassword)
    throw new Error("Something is missing");
  const user = await userModel.findOne({ _id: userId }).select("+password");
  if (!user) throw new Error("User is missing");
  const isValidOldPassword = comparePassword(oldPassword, user.password);
  if (!isValidOldPassword) throw new Error("Password didnt match");
  await userModel.updateOne(
    { _id: userId },
    { password: hashPassword(newPassword) }
  );
  return "password Chnagd Successfully";
};
//---------------CREATED BY ADMIN---------------------------//
const create = async (payload) => {
  return userModel.create(payload);
};

//-----------------PROFILE GET BY ADMIN-------------------------//
const getProfile = async (_id) => {
  return userModel.findOne({ _id });
};
//----------------UPDATED BY ADMIN-----------------------------//
const updateProfile = async (payload) => {
  delete payload.email;
  return userModel.findOne({ _id }, payload);
};
//-----------------BLOCKED BY ADMIN---------------------------------//
const blockUser = async (_id) => {
  const user = await userModel.findOne({ _id });
  if (!user) throw new Error("User not found");
  const payload = { isActive: !user.isActive };
  return userModel.findOneAndUpdate({ _id }, payload);
};
//------------------PAGINATION, SEARCH, FILTER-------------------//
const getAll = async (search, page = 1, limit = 2) => {
  const query = [];

  if (search?.name) {
    query.push({
      $match: {
        name: new RegExp(search?.name, "gi"),
      },
    });
  }

  if (search?.email) {
    query.push({
      $match: {
        email: new RegExp(search?.email, "gi"),
      },
    });
  }

  query.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: (+page - 1) * +limit }, { $limit: +limit }],
    },
  });

  query.push({
    $addFields: {
      total: { $arrayElemAt: ["$metadata.total", 0] },
    },
  });

  query.push({
    $project: { metadata: 0 },
  });

  const result = await userModel.aggregate(query);

  return {
    data: result[0]?.data || [],
    total: result[0]?.total || 0,
    page: +page,
    limit: +limit,
  };
};

module.exports = {
  create,
  blockUser,
  updateProfile,
  getProfile,
  getAll,
  register,
  login,
  getById,
  updateById,
  generatefpToken,
  verifyfpToken,
  resetPassword,
  changePassword,
};
