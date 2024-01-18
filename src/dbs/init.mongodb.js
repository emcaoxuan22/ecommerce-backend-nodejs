"use strict";
const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
require("dotenv").config()

const {
  db
} = require("../configs/config.mongodb");
console.log(db.host, db.port, db.name)
console.log('day la env', process.env.NODE_ENV )
// const connectString = `mongodb://${host}:${port}/${name}`;
// const connectString = `mongodb+srv://emcaoxuan22:HDfqPaLNlnY8Bxcr@cluster0.xtsyfdn.mongodb.net/`
let connectString;
if (process.env.NODE_ENV === 'pro') {
  connectString = `mongodb+srv://emcaoxuan22:HDfqPaLNlnY8Bxcr@cluster0.xtsyfdn.mongodb.net/`
}else{
  connectString = `mongodb://${db.host}:${db.port}/${db.name}`
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
        console.log(`connect mogoose Success`);
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
