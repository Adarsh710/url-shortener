var express = require('express'),
bodyparse = require('body-parser'),
mongoose = require('mongoose'),
btoa = require('btoa'),
atob = require('atob'),
promise,
connectionString = "mongodb://localhost:27017/newDB",
port = process.env.PORT || 8080,
app = express();

app.use(express.static('main_files'));

app.use(bodyparse.urlencoded({extended: false}));
app.use(bodyparse.json());

app.get('/',function(req,res){
    res.sendFile("index.html");
});

// Counter Collection Schema
var countersSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    count: { type: Number, default: 10000 }
});

var Counter = mongoose.model('Counter', countersSchema);

// URL Collection Schema
var urlSchema = new mongoose.Schema({
    _id: {type: Number},
    url: '',
    created_at: ''
});

// URL Schema pre-save step
//
// This is run BEFORE a new document is persisted in the URL collection. All
// we are doing here is incrementing the counter in the Counter collection which
// then becomes the unique ID for the new document to be inserted in the URL
// collection
urlSchema.pre('save', function(next) {
    console.log('APP: Running pre-save');
    var that = this;
    Counter.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { count: 1 } }, function(err, counter) {
        if(err) {
            console.error('APP: Error while finding and updating counter value');
            return next(err)
        };
        that._id = counter.count;
        that.created_at = new Date();
        next();
    });
});

var URL = mongoose.model('URL', urlSchema);

// Connect to the MongoDB instance
promise = mongoose.connect(connectionString);

// promise.then(function(db) {
//     console.log('APP: Connected to MongoDB');
//     URL.remove({}, function() {
//         console.log('APP: URL collection emptied');
//     })
//     Counter.remove({}, function() {
//         console.log('APP: Counter collection emptied');
//         console.log('APP: Initializing Counter collection with a default value');
//         var counter = new Counter({_id: 'url_count', count: 10000});
//         counter.save(function(err) {
//             if(err) {
//                 console.error('APP: Error while initializing counter');
//                 return console.error(err);
//             }
//             console.log('APP: Counter has been initialized');
//         });
//     });
// });

// API for shortening
app.post('/shorten', function(req, res, next) {
    var urlData = req.body.url;
    URL.findOne({url: urlData}, function(err, doc) {
        if(doc) {
            console.log('APP: URL found in DB');
            res.send({
                url: urlData,
                hash: btoa(doc._id),
            });
        } else {
            console.log('APP: URL not found in DB, creating new document');
            var url = new URL({
                url: urlData
            });
            url.save(function(err) {
                if(err) {
                    return console.error(err);
                }
                res.send({
                    url: urlData,
                    hash: btoa(url._id),
                });
            });
        }
    });
});

// API for redirection
app.get('/:hash', function(req, res) {
    var baseid = req.params.hash;
    if(baseid) {
        console.log('APP: Hash received: ' + baseid);
        var id = atob(baseid);
        console.log('APP: Decoding Hash: ' + baseid);
        URL.findOne({ _id: id }, function(err, doc) {
            if(doc) {
                console.log('APP: Found ID in DB, redirecting to URL');
                res.redirect(doc.url);
            } else {
                console.log('APP: Could not find ID in DB, redirecting to home');
                res.redirect('/');
            }
        });
    }
});

app.listen(port,function(){
    console.log("Started on port 8080");
});