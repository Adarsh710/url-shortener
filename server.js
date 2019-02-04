var express = require('express');
var bodyparse = require('body-parser');
var app = express();

app.use(express.static('main_files'));

app.use(bodyparse.urlencoded({extended: false}));
app.use(bodyparse.json());

app.get('/',function(req,res){
    res.sendFile("index.html");
});

app.post('/login',function(req,res){
    var lgurl = req.body.url;
    console.log("the long url is: "+lgurl);
    res.end(lgurl);
});

app.listen(8080,function(){
    console.log("Started on port 8080");
});