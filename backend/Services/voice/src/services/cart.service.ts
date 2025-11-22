import axios from "axios";

const CART_BASE_URL = process.env.CART_BASE_URL ?? "http://cart:3005";

export const CartService = {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    authHeader?: string
  ) {
    console.log(
      "[CartService.addToCart] user:",
      userId,
      "product:",
      productId,
      "qty:",
      quantity,
      "auth?",
      !!authHeader
    );

    // Ajusta la ruta al endpoint real de tu servicio cart
    const res = await axios.post(
      `${CART_BASE_URL}/cart/items`,
      {
        productId,
        quantity,
      },
      {
        headers: authHeader ? { Authorization: authHeader } : {},
      }
    );

    return res.data;
  },
};
