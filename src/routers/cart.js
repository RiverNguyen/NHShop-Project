import { Router } from "express";
import {
    addItemToCart,
    getCart,
    removeItemFromCart,
    updateProductQuantity,
} from "../controllers/cart";

const router = Router();

router.post("/cart/add-to-cart", addItemToCart);
router.get("/cart/:userId", getCart);
router.delete("/cart/remove-cart", removeItemFromCart);
router.put("/cart/update-product-quantity", updateProductQuantity);

export default router;
