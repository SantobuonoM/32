//Mongo:
import ProductoDAOMongoDB from "../dao/MongoDbProductsDao.js";
import daoCarritoMongo from "../dao/daoCarritoMong.js";

/** FACTORY CARRITO  **/
export class FactoryDaoCarrito {
  static get() {
    return new daoCarritoMongo();
  }
}

/** FACTORY PRODUCTOS  **/
export class FactoryDaoProducto {
  static get() {
    return new ProductoDAOMongoDB();
  }
}
