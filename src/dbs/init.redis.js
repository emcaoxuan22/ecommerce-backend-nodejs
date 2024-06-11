"use strict"
const redis = require("redis")

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error"
  }

const handleEventConnect = ({ connectionRedis }) => {
  // check if connectionRedis is null
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis connected")
  })
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Redis DISCONNECTED")
  })
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("Redis reconnecting...")
  })
  connectionRedis.on(statusConnectRedis.ERROR, () => {
    console.log("Redis ERROR")
  })
}
const initRedis = () => {
  const instanceRedis = redis.createClient({
    password: "mPKvHlG9FFTTf3EWygLcTcGIAgsqrcEg",
    socket: {
      host: "redis-10155.c83.us-east-1-2.ec2.redns.redis-cloud.com",
      port: 10155
    }
  })
  client.instanceConnect = instanceRedis
  handleEventConnect({ connectionRedis: instanceRedis })
}

const getRedis = () => client

const closeRedis = () => {}

module.exports = { initRedis, getRedis, closeRedis }
