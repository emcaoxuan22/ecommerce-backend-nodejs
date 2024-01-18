"use strict";
const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
require("dotenv").config()

const {
  db: { host, port, name },
} = require("../configs/config.mongodb");
// const connectString = `mongodb+srv://emcaoxuan22:HDfqPaLNlnY8Bxcr@cluster0.xtsyfdn.mongodb.net/`
let connectString;
if (process.env.NODE_ENV === 'production') {
  connectString = `mongodb+srv://emcaoxuan22:HDfqPaLNlnY8Bxcr@cluster0.xtsyfdn.mongodb.net/`
}else{
  connectString = `mongodb://${host}:${port}/${name}`
}


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
        console.log(`connect mongoose Success `);
        countConnect();
      })
      .catch((err) => console.log(`Error Connect`, err));
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
