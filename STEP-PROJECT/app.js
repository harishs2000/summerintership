// requiring the neccessary NPM packages and the other dependant files
var express = require("express"); 
var app = express();
var bp = require("body-parser");
var mongoose = require("mongoose");
var methodoverride = require("method-override");
const { render } = require("ejs");
var passport = require("passport");
var localstrategy = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost:27017/projectdbtest",{useNewUrlParser:true ,useUnifiedTopology: true });
var book = require("./models/book");
var user = require("./models/user");
const { request } = require("express");

//MIDDLEWARE AND AUTH 
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
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin")
}

//letting know the nodejs that public folder has static files and that view folder has ejs files
app.use(methodoverride("_method"));
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

//=============================================================================
//                                 ROUTES
//=============================================================================

//BOOK ROUTES
//=============

//FOR DISPLAYING ALL BOOKS OF A USER
app.get("/",function(req,res){ res.redirect("/books");})

app.get("/books",isloggedin,function(req,res)
{
    user.findById(req.user._id).populate('books').exec(function(err, user){
        if (!err) {
        res.render("books/index",{books:user.books,username:user.username});
        }
    });
});

//FORM FOR LETTING USER ADD A NEW BOOK 
app.get("/books/new",isloggedin,function(req,res)
{
    user.findById(req.user._id,function(err,user)
    {
            res.render("books/new",{username:user.username});
    });
});

//PUSH REQUEST FOR ADDING THE NEW BOOK INFO INTO THE DB 
app.post("/books/new",isloggedin,function(req,res)
{
    book.create(req.body.book,(err,book)=>
    {
        if(!err)
        {
            user.findById(req.user._id,function(err,user)
            {
                user.books.push(book);
                user.save((err,user)=>
                {
                    res.redirect("/books");
                });
            });
        }
    });
});

//SEED DATA
reviews= [ {
    title: "BEST BOOK",
    text: "One of the best books i have ever read",
    author: "Arun"
  }, {
    title: "Awesome one",
    text: "very interesting book",
    author: "teja",
  }];

//FOR DISPLAYING THE DETAILS OF A SPECIFIC BOOK
app.get("/books/:id",isloggedin,function(req,res)
{   
    user.findById(req.user._id).populate('books').exec(function(err, user){
        if (!err) {
            book.findById(req.params.id,function(err,book){
                if(!err){
                res.render("books/show",{book:book , review:reviews,username:user.username});}
            });
        }
    });
});


//FOR DISPLAYING EDIT PAGE FOR EDITING A BOOKS INFO
app.get("/books/:id/edit",isloggedin,function(req,res)
{
    book.findById(req.params.id,function(err,book){
        user.findById(req.user._id,function(err,user)
        {
                res.render("books/edit",{book:book,username:user.username});
        });
    });
});


//PUT REQUEST FOR UPDATING THE ALREADY EXISTING BOOK
app.put("/books/:id/edit",isloggedin,function(req,res)
{
    book.findByIdAndUpdate(req.params.id,req.body.book,(err)=>
{
    if(!err)
    {
        res.redirect("/books/"+req.params.id);
    }
});
});

//DELETE REQUEST FOR DELETING A BOOK FROMM DB
app.delete("/books/:id",isloggedin,function(req,res)
{
    book.findByIdAndRemove(req.params.id,function(err){
        if(!err){
        res.redirect("/books/");}
    });
});



//=======================================
//    AUTHENTICATION ROUTES
//=======================================


//FOR DISPLAYING THE REGISTER PAGE
app.get("/register",function(req,res){
    user.find(function(err,users){
        listofusernames=[];
        for(let user of users)
        {
            listofusernames.push(user.username);
        }
        res.render("register",{listofusernames:listofusernames});
    });
});
 
//FOR ADDING THE NEW USER TO THE DATA BASE
app.post("/register",function(req,res){
  user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(!err)
        {
            passport.authenticate("local")(req,res, function(){
                res.redirect("/books");
            });

        }

    });
});

//FOR DISPLAYING THE SIGNUP PAGE
app.get("/signin",function(req,res){
    user.find(function(err,users){
        listofusernames=[];
        for(let user of users)
        {
            listofusernames.push(user.username);
        }
        res.render("signin",{listofusernames:listofusernames});
    });
   });

//POST REQUEST TO THE SIGNIN PAGE FOR CHECKING IF THE USER EXISTS AND PASSWORD IS CORRECT
app.post("/signin",passport.authenticate("local",{successRedirect:"/books",failureRedirect:"/signin"}),function(req,res){});

//LOGOUT ROUTE 
app.get("/logout",function(req,res){ req.logOut(); res.redirect("/signin");})




//FOR THE PORT
app.listen(5000,()=>
{
    console.log("success");
});