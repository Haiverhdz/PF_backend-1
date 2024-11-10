import express from "express";
import routerProducts from "./routes/products_router.js";
import routerCart from "./routes/cart_router.js";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/api/products", routerProducts);
app.use("/api/cart", routerCart);

app.listen(PORT, ()=>{
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

