import { Router } from "express";

import { carritoController } from "../controller/carrito.controller.js";
const controller = new carritoController();

const routerCart = Router();

//~~~~~~~~~~~~~~~~~ROUTES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
routerCart.post("/:uid", controller.crearCarrito);
routerCart.get("/lista", controller.ObtenerLosCarritos);
routerCart.delete("/:uid", controller.eliminarCarrito);
routerCart.put("/agregar/:uid/", controller.agregarProducto);
routerCart.get("/:uid", controller.ObtenerCarrito);
routerCart.delete(
  "/eliminar/:uid/:product",

  controller.EliminarProducto
);
export default routerCart;
