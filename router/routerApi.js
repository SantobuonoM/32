import { Router } from "express";
import { authLog, authReg } from "../utils/auth.js";
import {
  session,
  login,
  failLogin,
  register,
  registerPost,
  failregister,
  logout,
  loginGet,
  get,
  randoms,
  datos,
  noDir,
  infor,
  obtenerProductos,
  guardarProducto,
  deleteProduct,
  updateProduct
} from "../controller/controllerApi.js";

const routerApi = Router();

routerApi.get("/ses", session);

routerApi.delete("/productos/:id", deleteProduct);

routerApi.post("/login", authLog, login);

routerApi.get("/productos", obtenerProductos);
routerApi.put("/:id", updateProduct);

routerApi.post("/productos", guardarProducto);

routerApi.get("/faillogin", failLogin);

routerApi.get("/register", register);

routerApi.post("/register", authReg, registerPost);

routerApi.get("/failregister", failregister);

routerApi.get("/logout", logout);

routerApi.get("/login", loginGet);

routerApi.get("/", get);

/*---------------- RUTAS NUMEROS RANDOM E INFO -------------- */

routerApi.get("/api/randoms", randoms);

routerApi.get("/datos", datos);

routerApi.get("/info", infor);

routerApi.get("*", noDir);

export default routerApi;
