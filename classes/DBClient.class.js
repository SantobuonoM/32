import mongoose from "mongoose";
import { config } from "../config/config.js";
import CustomError from "./CustomError.class.js";
let instance = null;

class DBClient {
  constructor() {
    this.connected = false;
    this.client = mongoose;
    //console.log(config.mongodb.host);

    this.primeraConexion = new Date().toLocaleDateString();
  }
  async connect() {
    throw new CustomError(
      500,
      "Falta implementar",
      "method 'connect' en Sub Clase"
    );
  }
  static getInstance() {
    if (!instance) {
      instance = new DBClient();
    }

    return instance;
  }
}

export default DBClient;
