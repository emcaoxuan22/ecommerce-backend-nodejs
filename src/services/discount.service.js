"use Strict";

const createHttpError = require("http-errors");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodeUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");

const { discount } = require("../models/discount.model");
const { Schema } = require("mongoose");
/*
    Discount service
    1 - Generator discount code[Shop, Admin]
    2 - Get discount amount [User],
    3 - Get all discount codes [User, shop]
    4 - Verify discount doce [user],
    5 - Delete discount code [Admin, shop]
    6 - Cancel discount code [user]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;
    // kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw createHttpError.BadRequest("Discount code has expired");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw createHttpError.BadRequest("Start date must de defore end_date");
    }
    // create index for discout code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw createHttpError.BadRequest("discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_descreption: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /*
  Get all discount code available with ptoducts
   */

  static async getAllProductsCodesWithDiscount({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create inde for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();
    
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw createHttpError.NotFound("discount not exists!");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let product;
    if (discount_applies_to === "all") {
      //get all product
      product = await findAllProducts({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      //get all product
      product = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return product;
  }
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    console.log(shopId)
    const discounts = findAllDiscountCodeUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  /*
    apply discount code
    products = [
      {
        productId,
        shopId,
        quantity,
        name, 
        price
      },
      {
        productId,
        shopId,
        quantity,
        name, 
        price
      }
    ]
  */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
    });
    if (!foundDiscount)
      throw createHttpError.NotFound(`discount doesn't exists`);

    const {
      discount_is_active,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw createHttpError(`discount expried`);
    if (!discount_max_uses_per_user) throw createHttpError(`discount are out!`);

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw createHttpError.NotFound(`discount code has expried`);
    }

    let totalOrder = 0;

    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw createHttpError(
          `discount require a minium order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const useUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (useUserDiscount) {
        // ....
      }
    }

    // check xem discount nay la fixed_amount

    const amount =
      discount_type === "fixed_amount"
        ? +discount_value
        : totalOrder * (discount_value / 100);
    console.log(amount)
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) {
      throw createHttpError.NotFound(`discount  doesn't exists`);
    }
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
