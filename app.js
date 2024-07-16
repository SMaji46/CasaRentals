if(process.env.NODE_ENV!="production"){
    //module that loads environment variables from a .env file into process.env
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

// const MONGO_URL="mongod b://127.0.0.1:27017/CasaRentals";
const dburl=process.env.ATLASDB_URL;

 main().then(()=>{console.log("connected to DB");}).catch((err)=>{console.log(err);})
async function main(){
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl: dburl, 
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ (7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.curUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"s@gmail.com",
//         username:"delta-student"
//     });
//     //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
//     let registeredUser= await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/casarentals",listingRouter);
app.use("/casarentals/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/testListing",async(req,res)=>{let sampleListing=new Listing({
//     title:"My New Villa",
//     description:"By the bitch",
//     price:1200,
//     location:"Burnpur,Asansol",
//     country:"India",
// })

// await sampleListing.save();
// console.log("Sample Saved");
// res.send("Success");
// });

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong!"}=err;
res.status(status).render("error.ejs",{message});
});

app.listen(8080,()=>{console.log("server is listening to port 8080")});