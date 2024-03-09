const multer = require("multer");
const router = require("express").Router();
const userController = require("./user.controller");
const { checkRole } = require("../../utils/sessionManager");

//--------------STORING FILES USING MULTER(i.e."profilePic")--------------------//
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop(); // Get the file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPG files are allowed")); // Reject the file
  }
};

const limits = {
  fileSize: 1024 * 1024 * 3, // 1MB file size limit
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});
//-------------------Registration--and--used-multer-for-profilePic----------------------//
router.post(
  "/register",
  upload.single("profilePic"),

  async (req, res, next) => {
    try {
      console.log(req.body);
      if (req.file) {
        req.body.profilePic = req.file.path.replace("public", "");
      }
      console.log(req.body);
      const result = await userController.register(req.body);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  }
);

//-------------------------------Login---------------------------------------------//
router.post("/login", async (req, res, next) => {
  try {
    const result = await userController.login(req.body);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//--------------------Get All Users (ONLY ACCESSIBLE BY ADMINS)--------------//
router.get("/", checkRole(["user"]), async (req, res, next) => {
  try {
    const result = await userController.getAll();
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//-----------------------Forget Password(Part1)---------------------------//
router.post("/generate-fp-token", async (req, res, next) => {
  try {
    const result = await userController.generatefpToken(req.body);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//-----------Forget Password(Part2)------------------------//
router.post("/verify-fp-token", async (req, res, next) => {
  try {
    const result = await userController.verifyfpToken(req.body);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//------------------Reset Password------------------------//
router.post("/reset-password", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.resetPassword(req.body);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//------------------Change Password------------------------//
router.post(
  "/change-password",
  checkRole(["admin"], "user"),
  async (req, res, next) => {
    try {
      const result = await userController.changePassword(req.body);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  }
);
//------------------Create By ADMIN------------------------//
router.post("/", checkRole(["admin"]), async (req, res, next) => {
  try {
    const result = await userController.create(req.body);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//------------------get user by admin------------------------//
router.get("/get-profile", checkRole(["user"]), async (req, res, next) => {
  try {
    const result = await userController.getProfile(req.currentUser);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

//------------------update profile by user------------------------//
router.put("/update-password", checkRole(["user"]), async (req, res, next) => {
  try {
    const result = await userController.updateProfile(
      req.currentUser,
      req.body
    );
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
