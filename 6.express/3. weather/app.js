var express = require("express");
var app = express();
var bp= require("body-parser");
var request = require("request");

app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",function(req,res)
{
    res.render("home");
});
app.get("/search",function(req,res)
{
    res.render("search");
});
app.post("/search",function(req,res)
{  
    var url="http://api.openweathermap.org/data/2.5/weather?q="+req.body.city+"&appid=46f9136c79c51aaad8214c52cb5c3550";
    var data;
    request(url,function(error,response,body)
     {
         if(!error && response.statusCode==200 )
         {
             var data=JSON.parse(body);
             res.render("results",{data:data});
         }
     }); 

});

app.listen(8000,()=>{console.log("success");});