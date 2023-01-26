import log4js from "log4js";
import { User } from "../models/user.js";
import minimist from "minimist";
import os from "os";
import ProductoDAOMongoDB from "../dao/MongoDbProductsDao.js";

/*----------------------------------*/
const numCPUs = os.cpus().length;

const loggerWarn = log4js.getLogger("archivo");

const loggerError = log4js.getLogger("archivo2");

const loggerTodos = log4js.getLogger("todos");
/*----------------------------------*/

const DAO = new ProductoDAOMongoDB();

export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    await DAO.borrar(id);
    return res.json({ status: 200, msg: "Producto eliminado" });
  } catch (e) {
    logger.warn(e.message);
    return res.json({ status: 500, msg: e.message });
  }
}
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, code, image, price, stock } = req.body;
  try {
    const productUpdated = { name, description, code, image, price, stock };
    await DAO.actualizar(id, productUpdated);
    return res.json({ status: 200, msg: "Producto actualizado" });
  } catch (e) {
    logger.warn(e.message);
    return res.json({ status: 500, msg: e.message });
  }
}
export async function obtenerProductos(req, res) {
  try {
    const listaProductos = await DAO.listarAll();
    console.log("get", listaProductos);
    return res.render("vista", { listaProductos });
  } catch (error) {
    throw new Error(`Error al obtener Operaciones`);
  }
}

export async function guardarProducto(req, res) {
  try {
    console.log(req.body);
    const { nombre, descripcion, precio, imagen } = req.body;
    const item = { nombre, descripcion, precio, imagen };
    await DAO.guardar(item);

    const listaProductos = await DAO.listarAll();

    return res.render("vista", { listaProductos });
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
}
export const session = (req, res) => {
  console.log(req.session);
  res.send("anda a mirar la consola");
};

export const login = (req, res) => {
  res.redirect("/");
};

export const failLogin = (req, res) => {
  res.render("login-error", {});
};

export const register = (req, res) => {
  loggerWarn.warn(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register");
};

export const registerPost = (req, res) => {
  res.redirect("/");
};

export const failregister = (req, res) => {
  loggerError.error(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register-error", {});
};

export const logout = (req, res, next) => {
  const { username } = req.user;
  req.logout({ username }, (err) => {
    if (err) return next(err);
  });
  res.render("logout", { username });
};

export const loginGet = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("login");
  }
};
export const get = (req, res) => {
  loggerTodos.info(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  if (req.isAuthenticated()) {
    res.render("home", { username: req.user.username });
  } else {
    res.redirect("login");
  }
};
/*---------------- RUTAS NUMEROS RANDOM E INFO -------------- */

export const randoms = (req, res) => {
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
};

export const datos = async (req, res) => {
  if (req.user) {
    const datosUsuario = await User.findById(req.user._id).lean();
    res.render("datos", {
      datos: datosUsuario,
    });
  } else {
    res.redirect("/login");
  }
};
export const infor = (req, res) => {
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
};

export const noDir = (req, res) => {
  loggerTodos.warn(`metodo ${req.method} Ruta inexistente ${req.originalUrl}`);
  const html = `<div> direccion no valida </div>`;
  res.status(404).send(html);
};
