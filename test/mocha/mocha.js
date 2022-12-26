import { strict as assert } from "assert";
import axios from "axios";

describe("probando guardar producto", function () {
  it("debería guardar un producto en la db", async function (done) {
    const body = {
      name: "regla",
      description: "regla larga roja",
      code: "12313",
      image:
        "https://img.freepik.com/vector-premium/regla-centimetrica-icono-garabato-vectorial-suministros-oficina_499739-886.jpg?w=2000",
      price: 5000,
    };
    axios.post("http://localhost:8081/productos/", body).then((res) => {
      assert.deepStrictEqual(res.data, {
        status: 201,
        msg: "Producto creado con éxito",
      });
    });
    done();
  });
});

describe("probando listar productos", function () {
  it("debería listar todos los productos", async function (done) {
    axios({
      url: "http://localhost:5000/productos",
      method: "GET",
    }).then((response) => {
      let data = response.data;
      const archivo = "productos_json.json";
      writeFile(archivo, JSON.stringify(data, null, "\t"), (error) => {
        if (error) throw new Error(`Error guardando ${archivo}`);
        console.log(`Se guardó correctamente ${archivo}`);
      });
    });
    done();
  });
});

describe("probando editar productos", function () {
  it("debería actualizar un producto", async function (done) {
    const body = {
      name: "regla blanca",
      description: "regla larga blanca",
      code: "12413",
      image:
        "https://img.freepik.com/vector-premium/regla-centimetrica-icono-garabato-vectorial-suministros-oficina_499739-886.jpg?w=2000",
      price: 5000,
      stock: 50,
    };

    axios
      .put(`http://localhost:8081/productos/63a9df526a2dd365b56d17a5`, body)
      .then((response) => {
        console.log(response.data);
      });
    done();
  });
});

describe("Probando eliminar un producto", function () {
  it("debería eliminar un producto", async function (done) {
    axios
      .delete("http://localhost:8081/productos/63a9df526a2dd365b56d17a5")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    done();
  });
});
