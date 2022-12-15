import CustomError from "./CustomError.class.js";

class DBClient {
  async connect() {
    throw new CustomError(
      500,
      "Falta implementar",
      "method 'connect' en Sub Clase"
    );
  }
}

export default DBClient;
