import ContenedorMongoDB from "../container/MongoDbContainer.js";
import ProductoModel from "../models/productos.model.js";

class ProductoDAOMongoDB extends ContenedorMongoDB {
    constructor(){
        super(ProductoModel);
    }
}

export default ProductoDAOMongoDB;