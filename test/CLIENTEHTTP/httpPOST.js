import axios from "axios";

const data = {
  nombre: "regla",
  descripcion: "regla larga roja",
  imagen:
    "https://img.freepik.com/vector-premium/regla-centimetrica-icono-garabato-vectorial-suministros-oficina_499739-886.jpg?w=2000",
  precio: 5000,
};

const config = { "Content-type": "application/json" };

axios
  .post("http://localhost:8081/productos", data, config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
