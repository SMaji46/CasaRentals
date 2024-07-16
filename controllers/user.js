const User=require("../models/user.js");

//getSign Up
module.exports.rederSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

//postSignUp
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique.
    let registeredUser= await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to CasaRentals");
        //redirect on original Url
        let redirectUrl=res.locals.redirectUrl || "/casarentals";
        res.redirect(redirectUrl);
    });
    } catch(e){
        req.flash("error", e.message || "Unknown error occurred");
        res.redirect("/signup");
    }
}

//get Log In
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

//post log In

module.exports.login=async(req,res)=>{
    req.flash("success","Welcomeback to CasaRentals, You're logged in!");
    // console.log(req.User);
    let redirectUrl=res.locals.redirectUrl || "/casarentals";
    return res.redirect(redirectUrl);
}

//log Out
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/casarentals");
    });
}