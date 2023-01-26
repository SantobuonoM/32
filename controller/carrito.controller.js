import log4js from "log4js";
import daoCarritoMongo from "../dao/daoCarritoMong.js";
import { FactoryDaoCarrito } from "../dao/daoIndex.js";
const daoCarrito = FactoryDaoCarrito.get();
const DAO = new daoCarritoMongo();
const loggerWarn = log4js.getLogger("archivo");

export class carritoController {
  //
  /** ------ CREAR CARRITO ------ **/
  crearCarrito = async (req, res) => {
    try {
      const { uid } = req.params;

      //Service:
      const resService = await DAO.crearCarrito(uid);

      //Return:
      if (resService === "USUARIO_NO_ENCONTRADO")
        return res
          .status(404)
          .json({ status: 404, msg: "Usuario no encontrado" });
      else if (resService === "CARRITO_YA_EXISTE")
        return res
          .status(400)
          .json({ status: 400, msg: "El usuario ya tiene un carrito" });
      else if (resService === "CARRITO_CREADO")
        return res
          .status(201)
          .json({ status: 201, msg: "Carrito creado con éxito" });
    } catch (error) {
      loggerWarn(e.message);
      return res.render("pages/error", { msg: e.message });
    }
  };

  /** ------ OBTENER TODOS LOS CARRITOS ------ **/
  ObtenerLosCarritos = async (req, res) => {
    try {
      //Service:
      const lista = await DAO.obtenerLosCarritos();

      //Return:
      return res.json({ status: 200, msg: "ok", data: lista });
    } catch (e) {
      loggerWarn(e.message);
      return res.render("pages/error", { msg: e.message });
    }
  };

  /** ------ ELIMINAR CARRITO ------ **/
  eliminarCarrito = async (req, res) => {
    const { uid } = req.params;
    try {
      //Service:
      const resService = await DAO.eliminarCarrito(uid);

      //Return:
      if (resService) {
        return res.redirect("/productos");
      } else {
        return res.render("pages/error", { msg: "Error al eliminar carrito." });
      }
    } catch (e) {
      loggerWarn(e.message);
      return res.render("pages/error", { msg: e.message });
    }
  };

  /** ------ AGREGAR PRODUCTO AL CARRITO ------ **/
  agregarProducto = async (req, res) => {
    try {
      //Data:
      const { uid } = req.params;
      const { product, quantity } = req.body;
      const parseNumber = parseInt(quantity);

      //Service:
      const resService = await DAO.agregarProducto(uid, {
        product,
        quantity: parseNumber,
      });

      //Return:
      if (resService === "USUARIO_NO_ENCONTRADO") {
        return res.render("pages/error", { msg: "Usuario no encontrado" });
      } else if (resService === "PRODUCTO_AGREGADO") {
        return res.render("pages/carrito/carritoAgregado", { user: req.user });
      }
    } catch (e) {
      loggerWarn(e.message);
      return res.render("pages/error", { msg: e.message });
    }
  };

  /** ------ OBTENER CARRITO ------ **/
  ObtenerCarrito = async (req, res) => {
    const { uid } = req.params;
    try {
      const cart = await daoCarrito.obtenerPorUsuario(uid);
      return res.render("pages/carrito/carrito", {
        user: req.user,
        carrito: cart,
      });
    } catch (e) {
      loggerWarn(e.message);
      return res.render("pages/error", { msg: e.message });
    }
  };

  /** ------ ELIMINAR PRODUCTO DEL CARRITO ------ **/
  EliminarProducto = async (req, res) => {
    try {
      //Data:
      const { uid, product } = req.params;

      //Service:
      const resService = await DAO.eliminarProducto(uid, product);

      //Return:
      if (resService === "USUARIO_NO_ENCONTRADO") {
        return res.render("pages/error", { msg: "Usuario no encontrado" });
      } else if (resService === "PRODUCTO_ELIMINADO") {
        return res.render("pages/carrito/carritoEliminado", { user: req.user });
      }
    } catch (e) {
      loggerWarn(e.message);
      return res.render("pages/error", { msg: e.message });
    }
  };
}
