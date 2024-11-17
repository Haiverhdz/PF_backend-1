import { Router } from "express";
import  CartManager from "../manager/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res)=>{
    const cart = await cartManager.createOne();
    try {
        res.status(201).json({status: "success", cart})
    } catch (error) {
        res.status(error.code || 500).json({status: "error", message: "error al consultar los productos"});
    }
});

router.get("/:cid", async (req, res)=>{
    const cart = await cartManager.getOneById(req.params?.cid);
    try {
        res.status(201).json({status: "success", cart})
    } catch (error) {
        res.status(error.code || 500).json({status: "error", message: "error al consultar el carrito"});
    }
});

router.post("/:cid/product/:pid", async (req, res)=>{
    const product = req.params?.pid;
    const cart = req.params?.cid;
    const response = await cartManager.addProductOneById(product, cart);
    try {
        res.status(200).json({status: "success", response})
    } catch (error) {
        res.status(error.code || 500).json({status: "error", message: "error al agregar al carrito"});
    }
});

export default router;