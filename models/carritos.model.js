import { Schema, model } from "mongoose";

const carritoSchema = new Schema(
  {
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "productos",
          },
          quantity: {
            type: Number,
          },
        },
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    direccion: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Carrito = new model("carritos", carritoSchema);

export default Carrito;
