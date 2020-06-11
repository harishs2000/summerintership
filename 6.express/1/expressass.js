var express = require("express");
var app = express();

app.get("/",function(req,res){res.send("wwelcome");});
app.get("/speak/cow",function(req,res){res.send("moooo moooo");});
app.get("/speak/pig",function(req,res){res.send("oink oink ");});
app.get("/speak/dog",function(req,res){res.send("woff woff");});
app.get("/repeat/:word/:times",function(req,res)
{  str=" ";
    for (i=0;i<req.params.times;i++)
    {
        str+=" "+req.params.word;
    }
    res.send(str);
});
app.get("*",function(req,res){res.send("get a life dude");});
app.listen(8000,()=>{console.log("success");});