const dbConfig = require("./db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.sentences = require("./sentences.model.js")(mongoose);
db.tags = require("./tag.model.js")(mongoose);

module.exports = db;