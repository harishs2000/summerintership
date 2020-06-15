var express = require("express");
var app = express();
var bp= require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelpcampapp2",{useNewUrlParser:true ,useUnifiedTopology: true });
var comment = require("./models/comment");
var campground = require("./models/campground");
var user = require("./models/user");
var passport = require("passport");
var localstrategy = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var seeddb = require("./seed");


app.use(require("express-session")({
    secret:"this is a secret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

//seeddb();
app.use(function(req,res,next){
    res.locals.currentuser = req.user;
    next();
});
app.get("/",function(req,res)
{
    res.render("landingpage");
});

app.get("/campgrounds",function(req,res)
{
    campground.find({},function(err,campgrounds)
    {
        if(!err)
        {
            res.render("campgrounds/Index",{cgs:campgrounds});
        }
    });

});

app.get("/campgrounds/new",function(req,res)
{
    res.render("campgrounds/new");
});

app.post("/campgrounds/new",function(req,res)
{
    campground.create(
        {
            name : req.body.newcgname,
            img : req.body.newcgimg,
            description : req.body.newcgdescription
        },
        function(err , campground)
        {
            if(!err)
            {
                console.log("campground added");
                res.redirect("/campgrounds");
            }
        }
    )
    
});

app.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,campground)
    {
        if(!err)
        {
            res.render("campgrounds/show",{cg:campground});
        }
    });

});

function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin")
}

app.get("/campgrounds/:id/comments/new",isloggedin,function(req,res)
{
    campground.findById(req.params.id,function(err,campground){
        res.render("comments/new",{cg:campground});
    });
   
});
app.post("/campgrounds/:id/comments/new",function(req,res){
    comment.create({author:req.body.author,text:req.body.text},function(err,comment){
        campground.findById(req.params.id,function(error,campground)
        {
            campground.comments.push(comment);
            campground.save(function(error,campground){
                res.redirect("/campgrounds/"+req.params.id);
            });
        });
    });
});

app.get("/signin",(req,res)=>{
    res.render("signin");
});
app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
          if(!err)
          {
              passport.authenticate("local")(req,res, function(){
                  res.redirect("/campgrounds");
              });
  
          }
  
      });
  });
app.post("/signin",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/signin"}),function(req,res){});
app.get("/logout",function(req,res){ req.logOut(); res.redirect("/campgrounds");})

app.listen(8000,()=>{console.log("success");});
