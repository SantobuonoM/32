import axios from "axios";

axios
  .delete("http://localhost:8081/productos/639b88c7295467e6123cb203")
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
