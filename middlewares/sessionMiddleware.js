import MySQLStoreFactory from "express-mysql-session";
import pool from "../config/db.js";
import session from "express-session";

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
  },
  pool,
);

const sessioMiddleware = session({
  name: "sessionId",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
});

export default sessioMiddleware;