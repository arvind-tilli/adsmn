require('dotenv').config();
const mongoose = require('mongoose');
const Users = require('./models/users');
const Scores = require('./models/score');
const MONGODB_URL = process.env.MONGODB_URL;


class db {

    constructor() {
        if (!db.instance) {
            db.instance = this;
        }
        return db.instance;
    }

    connect() {
        mongoose.connect(MONGODB_URL, {});

        const { connection } = mongoose;
        connection.on('error', console.error.bind(console, 'Connection Error'));
        connection.once('open', () => {
            console.log("🎉🎉🎉MongoDB connected successfully!!!");
        })

        this.Users = Users;
        this.Score = Scores;
    }
    static getInstance() {
        return this.instance;
    }
}
module.exports = db;
