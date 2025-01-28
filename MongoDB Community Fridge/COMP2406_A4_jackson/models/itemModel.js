const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let item=Schema({
    id: {
      required:true,
      type: String ,maxLength: 4, minLength:1
    },
    name: {
      required:true,
      type: String,maxLength: 20, minLength:3
    },
    type: {
      required:true,
      type: String
    },
    img: {
      required:true,
      type: String,maxLength: 50, minLength:3
    }
  });
// TODO: create the schema for an Item
module.exports = mongoose.model("item", item);
