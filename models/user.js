var mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    Local = require("passport-local"),
    LocalMongo = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    username: String, 
    password: String
});

UserSchema.plugin(LocalMongo);

module.exports = mongoose.model("User", UserSchema);