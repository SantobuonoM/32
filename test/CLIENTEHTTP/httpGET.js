import axios from "axios";
import { writeFile } from "fs";

axios({
  url: "http://localhost:8081/productos/",
  method: "GET",
})
  .then((response) => {
    let data = response.data;
    const archivo = "productos_json.json";
    writeFile(archivo, JSON.stringify(data, null, "\t"), (error) => {
      if (error) throw new Error(`Error guardando ${archivo}`);
      console.log(`Se guardó correctamente ${archivo}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
