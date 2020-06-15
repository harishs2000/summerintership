var mongoose = require("mongoose");
var bookschema = new mongoose.Schema({
    title:String,
    image:String,
    author:String,
    category:String,
    price:String,
    Ratings:String,
    about:String
});

module.exports = mongoose.model("book",bookschema);