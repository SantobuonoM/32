import ContenedorMongoDB from "../container/MongoDbContainer.js";

import log4js from "log4js";

const loggerWarn = log4js.getLogger("archivo");

import Carrito from "../models/carritos.model.js";

class daoCarritoMongo extends ContenedorMongoDB {
  constructor() {
    super(Carrito);
  }

  /** ------ OBTENER CARRITO POR USUARIO ------ **/
  async obtenerPorUsuario(uid) {
    try {
      return await this.model
        .findOne({ user: uid })
        .populate([{ path: "products.product" }])
        .lean();
    } catch (e) {
      loggerWarn(e.message);
      return e.message;
    }
  }

  /** ------ AGREGAR PRODUCTO ------ **/
  async agregarProducto(uid, data) {
    try {
      const carrito = await this.model.findOne({ user: uid });

      const checkProducto = carrito.products.find(
        (p) => p.product.toString() === data.product.toString()
      );

      if (checkProducto) {
        carrito.products = carrito.products.map((item) =>
          item.product.toString() === data.product.toString()
            ? { ...item, quantity: item.quantity + data.quantity }
            : item
        );
      } else {
        carrito.products.push(data);
      }

      return await carrito.save();
    } catch (e) {
      loggerWarn(e.message);
      return e.message;
    }
  }

  /** ------ ELIMINAR PRODUCTO DEL CARRITO ------ **/
  async eliminarProducto(uid, product) {
    try {
      const carrito = await this.model.findOne({ user: uid });

      carrito.products = carrito.products.filter(
        (item) => item.product.toString() !== product
      );
      await carrito.save();
      return "PRODUCTO_ELIMINADO";
    } catch (e) {
      loggerWarn(e.message);
      return e.message;
    }
  }

  /** ------ ELIMINAR CARRITO POR ID DEL USUARIO ------ **/
  async eliminarCarrito(uid) {
    try {
      return await this.model.deleteOne({ user: uid });
    } catch (e) {
      loggerWarn(e.message);
      return e.message;
    }
  }
}

export default daoCarritoMongo;
