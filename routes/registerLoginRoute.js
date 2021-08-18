const router = require("express").Router();

const {
  register,
  login,
  logout,
} = require("../controllers/registerLoginController");

router.post("/register", register);

router.post("/login", login);

router.delete("/logout", logout);

module.exports = router;
