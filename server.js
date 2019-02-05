var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyparse = require('body-parser');
var app = express();
var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

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
    //var data = {}; //with insertMany() method, many entries can be inserted in an array form eg: data = [{a,b},{a,b},{a,b},{a,b},{a,b}];.

    //To connect the MongoDB database 
    mongo.connect(url,{useNewUrlParser: true}, function(err, mongo) {
        if (err) throw err;
        var dbo = mongo.db("MainDB");
        var data = {url: lgurl};
        //To find the url in the DB
        dbo.collection("URLs").find({url: lgurl}).toArray(function(err, result) {
            if (err){
                return err;
            }
            else if(result){
                console.log("URL is already present at id "+result[0]._id);
            }
            else{
                //To insert url into the DB
                dbo.collection("URLs").insertOne(data, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });
            }
            mongo.close();
        });
    });

});

app.listen(8080,function(){
    console.log("Started on port 8080");
});