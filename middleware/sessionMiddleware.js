const session = require("express-session");
const MemoryStore = require("memorystore")(session);
require("dotenv").config();

//Session
const sess_lifetime = 1000 * 60 * 60 * 12;
exports.sessionMiddleware = session({
  name: process.env.SESS_NAME,
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESS_SECRET,
  store: new MemoryStore({
    checkPeriod: sess_lifetime,
  }),
  cookie: {
    maxAge: sess_lifetime,
    sameSite: true,
    secure: false, //should be true if deployed in production stage
  },
});
