var express = require("express");
var app = express();
var bp = require("body-parser");

app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

var friends=["tarun","arun","varun"];

app.get("/",function(req,res)
{
    res.render("home");
});

app.get("/friends",function(req,res)
{
    res.render("friends",{friends:friends});
});

app.get("/addfriends",function(req,res)
{
    res.render("addfriends");
});

app.post("/addfriends",function(req,res)
{
    var newfriend = req.body.newname;
    friends.push(newfriend);
    res.redirect("/friends");
});

app.listen(8000,()=>{console.log("success");});