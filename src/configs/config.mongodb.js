require("dotenv").config()
const dev  = {
    app: {
        port: process.env.DEV_APP_PORT || 3055
    },
    db: {
        host: process.env.DEV_DB_HOST || "localhost" , 
        port: process.env.DEV_DB_PORT || '27017',
        name: process.env.DEV_DB_NAME || 'test'
    }

}

const production  = {
    app: {
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || "localhost" , 
        port: process.env.PRO_DB_PORT || '27017',
        name: process.env.PRO_DB_NAME || 'dbProduct'
    }

}
console.log('log ra day', process.env.PRO_DB_NAME)
const config = {dev, production}
const env = process.env.NODE_ENV || 'dev'
console.log('congif env',config[env])

module.exports = config[env]