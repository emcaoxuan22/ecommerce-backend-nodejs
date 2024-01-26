"use strict";
const RESOURCE = require("../models/resource.model");
const ROLE = require("../models/role.model");

const createResource = async ({
  name = "profile",
  slug = "p000001",
  description = "",
}) => {
  try {
    // check name or slug exists
    // new resource
    const resource = await RESOURCE.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });
    return resource;
  } catch (error) {}
};

const resourceList = async ({
  userId = 0,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    //check admin (middleware function)
    // get list of resource
    const resources = await RESOURCE.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createAt: 1,
        },
      },
    ]);
    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s00001",
  description = "extend from shop or user",
  grants = [],
}) => {
  try {
    // check role exists
    //new role
    const role = await ROLE.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });
    return role;
  } catch (error) {
    return error;
  }
};

const roleList = async () => {
  try {
    // const role = await ROLE.find();
    const role = await ROLE.aggregate([
      {
        $unwind: "$rol_grants",
      },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          action: "$rol_grants.actions",
          attributes: "$rol_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: 1,
          attributes: 1,
        },
      },
    ]);
    return role;
  } catch (error) {}
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
