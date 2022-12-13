import bCrypt from "bcrypt";

//Función para encriptar:
export const createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
