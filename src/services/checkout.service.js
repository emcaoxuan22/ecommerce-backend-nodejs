"use strict";

const createHttpError = require("http-errors");
const { getDiscountAmount } = require("./discount.service");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { acquireLock, releaseLock } = require("./redis.service");
const order = require("../models/order.model");

class CheckoutService {
  /*
    {
        CartId,
        UserId,
        shop_order_ids[
            {
                shopId,
                shop_discount:[],
                item_products:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shop_discount:[
                    {
                        "shopId",
                        "discountId",
                        'codeId
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw createHttpError("cart does not exists");
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];
    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      console.log("so lan:: ", i);
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      //check product available
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw createHttpError("order wrong");

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      //tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };
      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        //tong cong discount giam gia
        checkout_order.totalDiscount += discount;
        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = totalPrice;
        }
      }
      //tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address,
    user_payment,
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids });
    //check lai 1 lan nua co vuot ton kho hay khong
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]::`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }
    // check if co 1 san pham het hang trong kho

    if (acquireProduct.includes(false)) {
      throw createHttpError.BadRequest("mot so san pham da duoc cap nhat , vui long quay lai gio hang...");
    }
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });
    // truong hop : neu insert thanh cong thi remove product co trong cart
    if (newOrder) {
      //remove product im my cart
    }
    return newOrder;
  }
  /*
    1> query orders[Users]
  */
  static async getOrdersByUser() {}

  /*

    1> query orders[Users]
  */
  static async cancelOrderByUser() {}

  /*
    1> query orders[Users]
  */
  static async updateOrdersStatusByShop() {}
}

module.exports = CheckoutService;
