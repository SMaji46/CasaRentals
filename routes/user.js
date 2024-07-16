const express=require("express");
const router=express.Router({});
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedRedirectUrl,specialSavedUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.rederSignupForm)
.post(savedRedirectUrl,wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(savedRedirectUrl,passport.authenticate("local",{
        failureRedirect: "/login",
        //failureFlash use for message flash
        failureFlash:true,
    }), userController.login
);

router.get("/logout",userController.logout);

module.exports=router;