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
import bCrypt from "bcrypt";
import minimist from "minimist";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/user.js";

dotenv.config();
const app = express();
const MONGO_DB_URI = process.env.MONGO_URI;

app.use(compression());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_DB_URI,
      ttl: 600,
    }),
    secret: "sh",
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      maxAge: 600000,
    },
  })
);

app.engine(
  "hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

//app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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
            /* ---------------------- Rutas ----------------------*/
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

let createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
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

const PORT = argv.p || process.env.PORT;
const CLUSTER = argv.c;

//    ----------------------cluster------------------

if (CLUSTER) {
  if (cluster.isPrimary) {
    for (let i = 0; i < CPU_CORES; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(`Finalizó el worker: ${process.pid}`);
      cluster.fork();
    });
  } else {
    const srv = app.listen(PORT, async () => {
      console.log(
        `Servidor http escuchando en el puerto ${srv.address().port}`
      );
      try {
        const mongo = await mongoose.connect(MONGO_DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected DB");
      } catch (error) {
        console.log(`Error en conexión de Base de datos: ${error}`);
      }
    });
    srv.on("error", (error) => console.log(`Error en servidor ${error}`));
  }
} else {
  const srv = app.listen(PORT, async () => {
    console.log(`Servidor http escuchando en el puerto ${srv.address().port}`);
    try {
      const mongo = await mongoose.connect(MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected DB");
    } catch (error) {
      console.log(`Error en conexión de Base de datos: ${error}`);
    }
  });
  srv.on("error", (error) => console.log(`Error en servidor ${error}`));
}
