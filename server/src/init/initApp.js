const db = require('../db/connection')

const initApp = async (app) => {
    const mongooseCon = new db();
    mongooseCon.connect();

    process.on('unhandledRejection', (reason) => {
        console.log("Unhandled rejection at promise: ", reason);
    }).on('uncaughtException', (error) => {
        console.log("Uncaught exception: ", error);
    })
}
module.exports = initApp;
