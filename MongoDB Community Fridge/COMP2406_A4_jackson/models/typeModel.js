const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schma for a Type
let type=Schema({
    id: {
      unique:true,
      required:true,
      type: String,maxLength: 4, minLength:1
    },
    name: {
      unique:true,
      required:true,
      type: String,maxLength: 20, minLength:3
    }
  });

  
  module.exports = mongoose.model("type", type);
