const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const{listingSchema,reviewSchema,ticketSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must have account to create listing!");
        return res.redirect("/signup");
    }
    next();
}

module.exports.specialSavedUrl=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    }
    next();
}

//after log in req.session.redirectUrl resfreshed, thats why we save it in locals.
module.exports.savedRedirectUrl=(req,res,next)=>{
    console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUser._id) && !res.locals.curUser.username==='adminsubhajit'){
        req.flash("error","You are not Owner of this listing!");
        return res.redirect(`/casarentals/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}
module.exports.validateTicket=(req,res,next)=>{
    let {error}=ticketSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)&& !res.locals.curUser.username==='adminsubhajit'){
        req.flash("error","You are not author of this review!");
        return res.redirect(`/casarentals/${id}`);
    } else{
        next();
    }
}