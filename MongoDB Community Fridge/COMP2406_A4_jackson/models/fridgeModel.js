const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let fridge=new Schema({
    id: {
      unique:true,
      required: true,
      type: String, maxLength: 6, minLength:4
    },
    name: {
      required: true,
      type: String, maxLength: 20, minLength:3
    },
    numItemsAccepted: {
      required: true,
      type: Number, default:0
    },
    canAcceptItems: {
      required: true,
      type: Number, min:1, max:100
    },
    acceptedTypes: [
      
       {required: true,type:
        String,unique:true
       }
    ],
    contactInfo: {
      contactPerson: {
        required: true,
        type: String
      },
      contactPhone: {
        required: true,
        type: String
      }
    },
    address: {
      street: {
        required: true,
        type: String
      },
      postalCode: {
        required: true,
        type: String
      },
      city: {
        required: true,
        type: String
      },
      province: {
        required: true,
        type: String
      },
      country: {
        required: true,
        type: String
      }
    },
    items: [
      {  id: { unique: true, required: true,type:String/*,enum: ["1","2","3","4","5","6","7","8","9","10","11"]*/},
         quantity: { required: true,type:Number}}
      ]
    
  });
  module.exports = mongoose.model("fridge", fridge);
