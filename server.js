const app = require("./src/app");
const { app: {port}} = require("./src/configs/config.mongodb")
require("dotenv").config()


const PORT= port
const server = app.listen(PORT, () => {
    console.log(`WSV eCommercer start with ${PORT}`)
})

process.on("SIGINT", () => {
    server.close(() => console.log(`Exit Server Express`))
})