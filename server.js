const app = require("./src/app");
// const { app: {port}} = require("./src/configs/config.mongodb")
require("dotenv").config()


// const PORT= port
const server = app.listen(3000, () => {
    console.log(`WSV eCommerce start with success`)
})

process.on("SIGINT", () => {
    server.close(() => console.log(`Exit Server Express`))
})