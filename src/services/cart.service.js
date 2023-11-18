"use strict";

const createHttpError = require("http-errors");
const { cart } = require("../models/cart.model");
const {
  updateProductById,
  getProductById,
} = require("../models/repositories/product.repo");

/*  
 ket fetures cart service
 - add product to cart [user]
 -reduce product quantity by one [user]
 - increate product quantity by ont [user]
 - get cart [user]
 - deleta cart [user]
 - delete cart item [user]
*/

class CartService {
  // Start repo cart
  static async createUserCart({ userId, product }) {
    const validProduct = await getProductById(product.productId);
    if (!validProduct) throw createHttpError("product invalid");
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    const result = await cart
      .findOneAndUpdate(query, updateSet, options)
      .catch(async (data) => {
        return await CartService.createUserCart({ userId, product });
      });
    return result;
  }
  static async addTocart({ userId, product = {} }) {
    // check cart to tai hay khong
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }
    // neu co giohang roi nhung chua co san pham?
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    //gia hang ton tai , va co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  /*
    shop_opder_ids: [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        }
    ]
  */
  static async addTocartV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw createHttpError("");

    // comppare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw createHttpError("Product do not belong to the shop");
    if (quantity === 0) {
      // deleted
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }
  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
