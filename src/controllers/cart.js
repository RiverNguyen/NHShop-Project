import Cart from "../models/cart";
import Product from "../models/product";
import User from "../models/user";
import { StatusCodes } from "http-status-codes";

export const addItemToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        //* Kiểm tra giỏ hàng có tồn tại hay chưa ? dựa theo userId
        let cart = await Cart.findOne({ userId });

        //* Nếu không tồn tại => tạo mới
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const existProductIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        //* Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng không ?
        if (existProductIndex !== -1) {
            //* Nếu tồn tại => cập nhật số lượng
            cart.products[existProductIndex].quantity += quantity;
        } else {
            //* Nếu không tồn tại => thêm mới
            cart.products.push({ productId, quantity });
        }

        //* Lưu giỏ hàng
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId }).populate(
            "products.productId"
        );
        const cartData = {
            products: cart.products.map((item) => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
            })),
        };
        return res.status(StatusCodes.OK).json({ products: cartData.products });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: error.message });
    }
};

export const removeItemFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy giỏ hàng !" });
        }
        cart.products = cart.products.filter(
            (item) => item.productId && item.productId.toString() !== productId
        );
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy giỏ hàng !" });
        }
        const product = cart.products.find(
            (item) => item.productId.toString() === productId
        );

        if (!product) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng !" });
        }
        product.quantity = quantity;
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: error.message });
    }
};
