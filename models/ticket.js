const { string } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const ticketSchema=new Schema({
    name:{
        type:String,
    },
    Quantity:{
        type:Number,
        min:1,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    userdetails:{
        type: Schema.Types.ObjectId,
      ref:"User",
    },
    hotelinfo:{
        type: Schema.Types.ObjectId,
        ref:"Listing",
    },
    villaname:{
        type:String,
    },
});
module.exports=mongoose.model("Ticket",ticketSchema);