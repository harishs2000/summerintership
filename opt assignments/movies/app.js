var express = require("express");
var app = express();
var bp = require("body-parser");
var mongoose = require("mongoose");
var methodoverride = require("method-override");
const { render } = require("ejs");
mongoose.connect("mongodb://localhost:27017/movies",{useNewUrlParser:true ,useUnifiedTopology: true });

var movieschema = new mongoose.Schema({
    name:String,
    year:String,
    img:String
});

var movie = mongoose.model("movie",movieschema);

app.use(methodoverride("_method"));
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",function(req,res){ res.redirect("/movies");})

app.get("/movies",function(req,res)
{
    movie.find(function(err,movies){
        if(!err)
        {
            res.render("index", {movies:movies});
        }
    });
    
});
app.get("/movies/new",function(req,res)
{
    res.render("new");
});
app.post("/movies/new",function(req,res)
{
    movie.create({name:req.body.moviename,year:req.body.movieyear,img:req.body.movieimg},function(err,movie){
        res.redirect("/movies");
    });
});
app.get("/movies/:id",function(req,res)
{
    movie.findById(req.params.id,function(err,movie){
        if(!err){
        res.render("show",{movie:movie});}
    });
});
app.get("/movies/:id/edit",function(req,res)
{
    movie.findById(req.params.id,function(err,movie){
        if(!err){
        res.render("edit",{movie:movie});}
    });
});
app.put("/movies/:id/edit",function(req,res)
{
    movie.findByIdAndUpdate(req.params.id,req.body.movie,function(err,movie){
        if(!err){
        res.redirect("/movies/"+req.params.id);}
    });
});
app.delete("/movies/:id",function(req,res)
{
    movie.findByIdAndRemove(req.params.id,function(err){
        if(!err){
        res.redirect("/movies/");}
    });
});

app.listen(3000,()=>{console.log("success");});