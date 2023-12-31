"use strict";
const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
// console.log(connectString);

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect() {
    // if (1 === 1) {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", {
    //     color: true,
    //   });
    // }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log(`connect mogoose Success ${name}`);
        countConnect();
      })
      .catch((err) => console.log(`Error Connect`));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}
const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
