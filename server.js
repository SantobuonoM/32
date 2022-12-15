import express, { Router } from "express";
import cluster from "cluster";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import compression from "compression";
import routerApi from "./router/routerApi.js";
import passport from "passport";
import minimist from "minimist";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/user.js";
import { createHash } from "./utils/bcrypt.js";
import bCrypt from "bcrypt";
import logger from "./config/loggers.js";
import { config } from "./config/config.js";

dotenv.config();
const app = express();
const MONGO_DB_URI = process.env.MONGO_URI;

app.use(compression());
app.use(cookieParser());

//////
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

//app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          console.log("User Not Found with username " + username);
          return cb(null, false);
        }
        if (!validatePassword(user, password)) {
          console.log("Invalid Password");
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);

const validatePassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, cb) {
      const findOrCreateUser = function () {
        User.findOne({ username: username }, function (err, user) {
          if (err) {
            console.log("Error in SignUp: " + err);
            return cb(err);
          }
          if (user) {
            console.log("User already exists");
            return cb(null, false);
          } else {
            let newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.save((err) => {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              return cb(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
/* ---------------------- Rutas ----------------------*/
app.use("/", routerApi);

// -------------- MODO FORK -------------------
//pm2 start server.js --name="ServerX" --watch -- PORT
//pm2 start server.js --name="Server1" --watch -- --port 8082
//pm2 start server.js --name="Server2" --watch -- --port 8083
//pm2 start server.js --name="Server3" --watch -- --port 8084
//pm2 start server.js --name="Server4" --watch -- --port 8085

// Tuve un problema que no pude resolver que cuando levanto con fork o cluster los servidores quedan en errored, y no pude encontrar solucion para ese error

// -------------- MODO CLUSTER -------------------
//pm2 start server.js --name="ServerX" --watch -i max -- PORT
//pm2 start server.js --name="Server1" --watch -i max -- --port 8080

//pm2 list
//pm2 delete id

//----------------------------------------------------------------

const argv = minimist(process.argv.slice(2), {
  alias: { p: "port", c: "cluster" },
});

//    ----------------------cluster------------------

/*============================[Servidor]============================*/
const PORT = config.server.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Servidor [${config.server.NODE_ENV}] en puerto ${PORT}`);
  // console.log(`Servidor [${config.server.NODE_ENV}] en puerto ${PORT}`);
});
server.on("error", (error) => {
  logger.error(`Error en el servidor ${error}`);
});
