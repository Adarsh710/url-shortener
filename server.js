var express = require('express'),
// var MongoClient = require('mongodb').MongoClient;
bodyparse = require('body-parser'),
app = express(),
mongo = require('mongodb').MongoClient,
address = "mongodb://localhost:27017/";

app.use(express.static('main_files'));

app.use(bodyparse.urlencoded({extended: false}));
app.use(bodyparse.json());

app.get('/',function(req,res){
    res.sendFile("index.html");
});

var dbo;

//To connect the MongoDB database 
mongo.connect(address,{useNewUrlParser: true}, function(err, mongo) {
    if (err) throw err;
    dbo = mongo.db("MainDB");
});

//To get the url from user input and store it in DB
app.post('/login',function(req,res){
    var lgurl = req.body.url;
    console.log("the long url is: "+lgurl);
    res.end(lgurl);
    
        var data = {url: lgurl};
        //To find the url in the DB
        dbo.collection("URLs").find(data).toArray(function(err, result) {
            if (err){
                return err;
            }
            if(result.length > 0){
                console.log("URL is already present at id " + result[0]._id);
            }
            else{
                //To insert url into the DB
                dbo.collection("URLs").insertOne({_id:getNextSequence("userid"), url: lgurl}, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted : " + res);
                });
            }
        });
    });


function getNextSequence(name) {
    var ret = dbo.collection("counters").findOneAndUpdate(
        
            {_id: name },
            { $inc: { seq: 1 } },
            {new: true},
            function(err, res){
                if(err) throw err;
                else{
                    return res.value.seq; //Need to return this value to the variable 'ret' then that value return to the calling function.
                }
            }
    );
    return ret;
        // function(err,doc) {
        //         if (err) { throw err; }
        //         else { console.log("Updated" + doc.seq); }
        // });  
 }

//For redirecting shorten url to main url
app.get('/:key',function(req, res){
    var keys = req.params.key;
    console.log(keys);
    res.redirect('https://www.google.com');
});

app.listen(8080,function(){
    console.log("Started on port 8080");
});