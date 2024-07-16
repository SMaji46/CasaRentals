const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
// const Review=require("../models/review.js");
// const User=require("../models/user.js");

const {isLoggedIn,isOwner,validateListing,specialSavedUrl}=require("../middleware.js");

const listingController=require("../controllers/listing.js");
//multer used for uploading files.
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route & Create Route 
router.route("/").get(specialSavedUrl,wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createlisting)
);

//Search Destination
router.get("/search",wrapAsync(listingController.searchdestination));

//New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

//Bookings
router.get("/bookings",isLoggedIn,wrapAsync(listingController.renderbookingdetails));

//Delete Bookings
router.delete("/bookings/:ticketid",wrapAsync(listingController.destroyTicket));

//Ticket
router.route("/:id/ticket").get(isLoggedIn,wrapAsync(listingController.getticket))
.post(isLoggedIn,wrapAsync(listingController.postticket));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//category
router.get("/category/:newListingname/:category",wrapAsync(listingController.category));

//Show Route Update Route Delete Route
router.route("/:id")
.get(specialSavedUrl,wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,
upload.single("listing[image]"),
validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));;



module.exports= router;