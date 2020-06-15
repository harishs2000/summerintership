var express = require("express");
var app = express();
var bp = require("body-parser");
var mongoose = require("mongoose");
var methodoverride = require("method-override");
const { render } = require("ejs");
var passport = require("passport");
var localstrategy = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost:27017/projectdb1",{useNewUrlParser:true ,useUnifiedTopology: true });
var book = require("./models/book");
var user = require("./models/user");
const { request } = require("express");

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

app.use(methodoverride("_method"));
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin")
}



app.get("/",function(req,res){ res.redirect("/books");})

app.get("/books",isloggedin,function(req,res)
{
    user.findById(req.user._id).populate('books').exec(function(err, user){
        if (!err) {
        res.render("index",{books:user.books});
        }
    });
});

app.get("/books/new",isloggedin,function(req,res)
{
    res.render("new");
});

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

app.get("/books/:id",isloggedin,function(req,res)
{   
    book.findById(req.params.id,function(err,book){
        if(!err){
        res.render("show",{book:book});}
    });
});

app.get("/books/:id/edit",isloggedin,function(req,res)
{
    book.findById(req.params.id,function(err,book){
        if(!err){
        res.render("edit",{book:book});}
    });
});

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

app.delete("/books/:id",isloggedin,function(req,res)
{
    book.findByIdAndRemove(req.params.id,function(err){
        if(!err){
        res.redirect("/books/");}
    });
});




app.get("/register",function(req,res){
 res.render("register");
});
 
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

app.get("/signin",function(req,res){
    res.render("signin");
   });
    
app.post("/signin",passport.authenticate("local",{successRedirect:"/books",failureRedirect:"/signin"}),function(req,res){});

app.get("/logout",function(req,res){ req.logOut(); res.redirect("/signin");})


app.listen(3000,()=>
{
    console.log("success");
});