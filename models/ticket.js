const e = require("connect-flash");
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
    entrydate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                // Compare only the date part
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: 'Entry date must be today or in the future.'
        }
    },
    exitdate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                // Compare only the date part
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: 'Exit date must be today or in the future.'
        }
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