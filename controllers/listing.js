const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const User=require("../models/user.js");
const Ticket=require("../models/ticket.js");
//github mapbox sdk
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index=async(req,res)=>{
    const tog=1;
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{tog,allListings});
};

//search route
module.exports.searchdestination=async(req,res)=>{
    const tog=1;
    const newListing=req.query.destination;
    const newListingname=newListing.name;
    const allListings= await Listing.find({});
    //console.log(newListing.name);
    res.render("./listings/search.ejs",{tog,newListingname,allListings});
};

//New Route
module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
};

//bookings
module.exports.renderbookingdetails=async(req,res)=>{
    const allListings= await Listing.find({});
    const allbookings= await Ticket.find({});
    res.render("./listings/booking.ejs",{allbookings});
};

//Delete Bookings
module.exports.destroyTicket = async (req, res) => {
    try {
        const { ticketid } = req.params;
        const ticket = await Ticket.findById(ticketid); // Corrected findById usage
        if (!ticket) {
            req.flash("error", "Booking info not found");
            return res.redirect("/casarentals/bookings");
        }

        const id = ticket.hotelinfo;
        await Listing.findByIdAndUpdate(id, { $pull: { tickets: ticketid } });
        await Ticket.findByIdAndDelete(ticketid);
        
        req.flash("success", "Booking Information Deleted!");
        res.redirect("/casarentals/bookings");
    } catch (err) {
        console.error("Error deleting ticket:", err);
        req.flash("error", "Failed to delete your booking");
        res.redirect("/casarentals/bookings");
    }
};


//ticket get
module.exports.getticket=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/fillticket.ejs",{listing});
};

//category
module.exports.category=async(req,res)=>{
    const tog=1;
    let {newListingname,category}=req.params;
    const allListings= await Listing.find({});
    //console.log(newListingname);
    res.render("listings/category.ejs",{tog,category,newListingname,allListings});
};

//ticket post
module.exports.postticket=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    let newticket= new Ticket(req.body.ticket);
    newticket.hotelinfo=listing._id;
    newticket.villaname=listing.title;
    newticket.userdetails=req.user._id;
    listing.tickets.push(newticket);
    await listing.save();
    await newticket.save();
    req.flash("success","Booking id Generated Successfully!")
    res.redirect(`/casarentals/${listing._id}`);
};



//Show Route
module.exports.showListing=async(req,res)=>{
    const tog=1;
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner").populate({
        path:"tickets",
        populate:{
            path:"userdetails",
        },
    });
    if(!listing)
    {
        req.flash("error","Hotel information you searched does not exist!");
        res.redirect("/listings");
    }
    res.render("../views/listings/show.ejs",{tog,listing});
};

//Create Route 
module.exports.createlisting=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();  
    let url=req.file.path;
    let filename= req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedList=await newListing.save();
    //console.log(savedList);
    req.flash("success","Your Hotel Information added!")
    res.redirect(`/casarentals/${savedList._id}`);
};

//Edit Route
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Hotel you searched does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_300");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

//Update Route
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body.listing); 
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename= req.file.filename;
    listing.image={url,filename};
    await listing.save();  
    }
    req.flash("success","Hotel Information Updated!")
    res.redirect(`/casarentals/${id}`);
};

//Delete Route
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedItem =await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    req.flash("success","Hotel Information Deleted!")
    res.redirect("/casarentals");
};