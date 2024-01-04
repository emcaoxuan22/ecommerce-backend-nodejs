"use strict";
const { NOTI } = require("../models/noitification.model");
const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === "SHOP-001") {
    noti_content = "@@@ vua moi them mot san pham : @@@";
  } else if (type === "PROMOTION-001") {
    noti_content = "@@@ vua moi them mot voucher: @@@";
  }
  const newNoti = await NOTI.create({
    noti_type: type,
    noti_content,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({
  userId = "1001",
  type = "ALL",
  isReal = 0,
}) => {
  const match = { noti_receivedId: userId };
  if (type !== "ALL") {
    match["noti_type"] = type;
  }
  return await NOTI.aggregate([
    { $match: match },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_content: 1,
        createAt: 1,
        noti_options: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
