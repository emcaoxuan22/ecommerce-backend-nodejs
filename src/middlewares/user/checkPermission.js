const mongoose = require("mongoose");
const { roleModel, menuModel } = require("../../models/user.model");
const { ApiError } = require("../../core/ApiError");
const { StatusCodes } = require("http-status-codes");

const checkPermission = async (req, res, next) => {
  try {
    // Lấy vai trò của người dùng từ request hoặc từ nguồn xác thực khác
    const userRoles = req.user.roles; // Giả sử bạn có thông tin vai trò từ middleware xác thực
    // Lấy tài nguyên từ request
    const menuId = req.params.menuId; // Điều này phụ thuộc vào cách bạn thiết kế routes của mình

    // Kiểm tra xem có vai trò và tài nguyên không
    if (!userRoles || !menuId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Kiểm tra quyền truy cập
    const roles = await roleModel.find({ _id: { $in: userRoles } });
    const menu = await menuModel.findById(menuId);

    if (!roles || !menu) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Kiểm tra xem vai trò có quyền truy cập tài nguyên không
    const hasPermission = roles.some((role) =>
      role.Menus.includes(menu._id.toString())
    );
    if (!hasPermission) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const combinePermission = roles.reduce((acc, role) => {
      if (role.Menus.includes(menu._id.toString())) {
        acc = acc.concat(role.permissions);
      }
      return acc;
    }, []);
    // Sử dụng Set để đảm bảo tính duy nhất
    if (!combinePermission) {
      throw new ApiError(StatusCodes.FORBIDDEN, "access deny");
    }
    const uniquePermissions = [...new Set(combinePermission)];
    req.permissions = uniquePermissions;
    // Nếu tất cả đều hợp lệ, chuyển sang middleware hoặc route tiếp theo
    next();
  } catch (error) {
    console.error("Permission Middleware Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { checkPermission };
