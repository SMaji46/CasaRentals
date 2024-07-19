const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    contactinfo: {
      type: String,
      required: true,
    },
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      }
    ],
    tickets:[
      {
        type:Schema.Types.ObjectId,
        ref:"Ticket",
      }
    ],
    owner:{
      type: Schema.Types.ObjectId,
      ref:"User",
    },
    category: {
      type: String,
      enum: ["Room", "Iconic City", "Mountain", "Castles", "Pools", "Camping", "Forest", "Farms", "Arctic", "Domes", "Sea Beach"],
      required: true
    },
    booking: {
      type: String,
      enum: ["On", "Off"],
      default: "On"
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      }
    },
  });

  listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id:{$in: listing.reviews}});
    }
  });

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
