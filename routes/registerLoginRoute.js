const router = require("express").Router();

const {
  register,
  login,
  logout,
} = require("../controllers/registerLoginController");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateRegisterLoginMiddleware");

router.post("/register", register);

router.post("/login", login);

router.delete("/logout", logout);

module.exports = router;
