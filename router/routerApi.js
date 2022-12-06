import { Router } from "express";
import passport from "passport";
import log4js from "log4js";
import { User } from "../models/user.js";
import minimist from "minimist";
import os from "os";

const numCPUs = os.cpus().length;
const routerApi = Router();

const loggerWarn = log4js.getLogger("archivo");

const loggerError = log4js.getLogger("archivo2");

const loggerTodos = log4js.getLogger("todos");

routerApi.get("/ses", (req, res) => {
  console.log(req.session);
  res.send("anda a mirar la consola");
});

routerApi.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  (req, res) => {
    res.redirect("/");
  }
);

routerApi.get("/faillogin", (req, res) => {
  res.render("login-error", {});
});

routerApi.get("/register", (req, res) => {
  loggerWarn.warn(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register");
});

routerApi.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),

  (req, res) => {
    res.redirect("/");
  }
);

routerApi.get("/failregister", (req, res) => {
  loggerError.error(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register-error", {});
});

routerApi.get("/logout", (req, res, next) => {
  const { username } = req.user;
  req.logout({ username }, (err) => {
    if (err) return next(err);
  });
  res.render("logout", { username });
});

routerApi.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});
routerApi.get("/", (req, res) => {
  loggerTodos.info(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  if (req.isAuthenticated()) {
    res.render("home", { username: req.user.username });
  } else {
    res.redirect("login");
  }
});
/*---------------- RUTAS NUMEROS RANDOM E INFO -------------- */

routerApi.get("/api/randoms", (req, res) => {
  const calculo = fork("randomNumbers.js");
  const num = req.query.cant;
  if (num) {
    console.log(num);
    calculo.on("message", (number) => {
      if (number == "listo") {
        calculo.send(num);
      } else {
        res.json({ number });
      }
    });
  } else {
    calculo.on("message", (number) => {
      if (number == "listo") {
        calculo.send(100000000);
      } else {
        res.json({ number });
      }
    });
  }
});

routerApi.get("/datos", async (req, res) => {
  if (req.user) {
    const datosUsuario = await User.findById(req.user._id).lean();
    res.render("datos", {
      datos: datosUsuario,
    });
  } else {
    res.redirect("/login");
  }
});
routerApi.get("/info", (req, res) => {
  let info = {
    argumentos: minimist(process.argv.slice(2)),
    plataforma: process.platform,
    versionNode: process.version,
    memoriaReservada: process.memoryUsage(),
    ejecutable: process.execPath,
    pid: process.pid,
    carpetaProyecto: process.cwd(),
    procesadores: numCPUs,
  };

  res.json({ info });
});

routerApi.get("*", (req, res) => {
  loggerTodos.warn(`metodo ${req.method} Ruta inexistente ${req.originalUrl}`);
  const html = `<div> direccion no valida </div>`;
  res.status(404).send(html);
});

export default routerApi;
