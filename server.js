// server.js

    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var user = require('./models/user_schema.js');
    var feed = require('./models/feed_schema.js');
    var place = require('./models/place_schema.js');
    var multer = require('multer');

    // configuration =================
 
    mongoose.connect('mongodb://localhost/vibrance_nf');     // connect to mongoDB database on modulus.io

    //app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    

    // feed_v0 : 
    // given a checke in user,location,text,likes,timestamp
    // location_id : feed_id mapping
    // user_id : feed_id mapping
    // feed _v1 :-
    // add photos, likes,share,comment[text only],update,delete api 
    // fedd _v2 :-
    // add metatags support
    // display form database




    // post API
    // input : user name 
    // assumes user is checked in
    // stores feed into database [ only text support]


    // middle ware to support image upload

     var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            var uid = req.body.uname ;
            cb(null, file.fieldname + '-' + uid + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });


    var upload = multer({ //multer settings
                    storage: storage, limits:{
                        fileSize : 20000000 // 20Mb
                    } }).single('profilepic');

    //  @input: user_id, location_lat,location_long
app.post('/feed/post',function(err,currUser){


var createDate = Date.now() ;
upload(req,res,function(err){
            if (err) throw err;
            else {
                console.log("Image uploaded successfully")
                console.log(req.body);
                console.log(req.file) ;
                var user_name = req.body.uname;

                var user_id  ;

                var feedId = req.body.feedId;
                console.log(' User :',user_name, 'wants to post');

                user.findOne({name:user_name},function(err,curr_user){
                    if(err) {
                        console.log('Error in searching srror',err);
                        res.send(err) ;
                            }
                    else if (!curr_user){
                        console.log('user not found in db');
                        res.sendfile(req.body.uname);
                        res.json({success:false, message:'GTFO'});

                    }

                    else { //else 1
                        console.log(" Adding feed to  db") ;
                        var user_id = curr_user._id ;
                        //var likes = 0 ;
                        var placeId ;
                        var locationName;
                        var locationLat;
                        var locationLong ;
                        if (curr_user.checkIn.status) {
                            console.log('User  already checked in') ;
                            placeId = curr_user.checkIn.whereId ;
                            place.findById(placeId,function(err,place){
                                if(err) throw err ;

                                else {
                                    locationId = place._id ;
                                    locationName = place.restaurant.name ;
                                    locationLat = place.restaurant.location.lat ;
                                    locationLong = place.restaurant.location.long ;
                                    console.log("User is vibrating from :",locationName) ;
                                    }
                                });
                        }
                        else { // user not checked_in 
                                    locationId = "" ;
                                    locationName = "" ;
                                    locationLat = req.body.lat ;
                                    locationLong = req.body.long ;

                        }
                                // check if we have photo attcahed or not
                                    var fileCount ;
                                    var fileDest  ;
                                    var fileName  ;
                                    var filePath  ;
                                if(req.file){
                                    fileCount = 1 ;
                                    fileDest = req.file.destination ;
                                    fileName = req.file.filename ;
                                    filePath =  req.file.path ;
                                }
                                else{
                                    fileCount = 0;
                                    fileDest = "";
                                    fileName = "";
                                    filePath = "";

                                }

                           
                                 var newFeed = new feed({
                                    userId : user_id,
                                    username : user_name,
                                    body: req.body.feedText,
                                    files:{
                                        count : fileCount,
                                        destination : fileDest,
                                        fileName : fileName,
                                        path:  filePath
                                    },
                                    createdOn: createDate,
                                    location : {
                                        locationId:locationId,
                                        name : locationName,
                                        lat :  locationLat,
                                        long : locationLong
                                           } 

                                });

                            newFeed.save(function(err){
                                if(err) throw err ;
                                //direct him to feed line    
                                res.json(newFeed);
                                // add feed to location map
                                place.feeds.push({feedId:newFeed._id,date:createDate});
                                place.save(function(err){
                                    if(err) throw err;
                                    else console.log("Feed-location map done");
                                });
                                // add user -feed ap
                                curr_user.feedActivity.push({feedId:newFeed._id,date:createDate,type:"post"});
                                curr_user.save(function(err){
                                    if(err) throw err;
                                    else console.log("user-feed maping done");
                                });
                                 console.log(" feed added to data base successfully") ;
                            });
                        // fucntion : if user is not checked in at some place 
                     }//else 1
            });
          }
        });
});





    // ? people even if theya are not checked in 
    app.post('/feed/delete',function(req,res,next){

        var createDate = Date.now() ;


        console.log(' Image enablled post ') ;
        upload(req,res,function(err){
            if (err) throw err;
            else {
                console.log("Image uploaded successfully")
                console.log(req.body);
                console.log(req.file) ;
                var user_name = req.body.uname;
                var user_id  ;
                console.log(' User :',user_name, 'wants to post');

                user.findOne({name:user_name},function(err,curr_user){
                    if(err) {
                        console.log('Error in searching srror',err);
                        res.send(err) ;
                            }
                    else if (!curr_user){
                        console.log('user not found in db');
                        
                        res.json({success:false, message:'GTFO'});

                    }
                    else { //else 1
                    feed.findOne({"__id":ObjectId(feedId)},function(err,currFeed){
                    if(err) {
                        res.json({success:false,message:"db error"});
                        throw err;}

                    else if(!currFeed){
                        console.log("feed already deleted");
                        res.json({success:false,message:"Deleted already"});
                    }   
                    else{
                    console.log(" Adding feed to  db") ;
                    var user_id = curr_user._id ;
                    var fileCount ;
                    var fileDest  ;
                    var fileName  ;
                    var filePath  ;
                    if(req.file){
                        fileCount = 1 ;
                        fileDest = req.file.destination ;
                        fileName = req.file.filename ;
                        filePath =  req.file.path ;
                    }
                    else{
                        fileCount = 0;
                        fileDest = "";
                        fileName = "";
                        filePath = "";

                    }
                    currFeed.body = req.body.feedText
                    
                    currFeed.file.count = fileCount;
                    currFeed.file.countdestination = fileDest;
                    currFeed.file.countfileName = fileName;
                    currFeed.file.countpath =  filePath;
                
                    currFeed.UpdatedOn = UpdateDate;
                                
                        currFeed.save(function(err){
                            if(err) throw err ;
                            //direct him to feed line    
                            res.json(currFeed);
                            
                            // add user -feed ap
                            curr_user.feedActivity.push({feedId:newFeed._id,date:updateDate,type:"update"});
                            curr_user.save(function(err){
                                if(err) throw err;
                                else console.log("user-feed maping done");
                            })

                             
                            console.log(" feed updated to data base successfully") ;
                        });
                             }

                            });
                        // fucntion : if user is not checked in at some place 
                        }//else 1
            });
          }
        });    
}); 

// delete the post

//like the post
app.post('/feed/like',function(req,res){

    //@input : userid, feedid

    var userId = req.body.userId ;
    var feedId = req.body.feedId;
    var date = Date.now()

    user.findOneAndUpdate({"_id":ObjectId(userId)},{$push:{"currUser.feedActivity":{feedId:feedId,date:date,type:"like"}}},function(err,currUser){
        if(err) throw err;
        else if(!currUser) res.json({success:false, message:'getTFO'}); 
        else{//user has already liked the post

        feed.update({"_id":ObjectId(feedId)},{$inc:{"likes.count" :1},$push:{"likes.activity":{userId:userID,date:date}}},function(err){
            if(err) throw err;
            res.json({status:true,message:"liked"});
        });
        
      }
    }); 

});

// unlike post
app.post('/feed/unlike',function(err,place){
    // @input : userId,feedID
    var userId = req.body.userId ;
    var feedId = req.body.feedId;
    var date = Date.now()

    user.findOneAndUpdate({"_id":ObjectId(userId)},{$pull:{feedActivity:{feedId:feedId,type:"like"}}},function(err,currUser){
        if(err) throw err;
        else if(!currUser) {res.json({success:false, message:'GTFO'}); }
        else{//user has already liked the post

        feed.update({"_id":ObjectId(feedId)},{$inc:{"likes.count" :-1},$pull:{"likes.activity":{userId:userID,date:date}}},function(err){
            if(err) throw err ;
            res.json({status:true,message:"unliked bitch"});
        });
        
      }
    }); 

});

// comments on post
// @input :- userId : userId of person who is commenting,feedId: _id of post on which the user comment:text
app.post('/feed/comment',function(req,res){
    var userId = req.body.userId;
    var feedId = req.body.feedId ;
    var comment = req.body.comment ;
    var date = Date.now() ;
    user.findOneAndUpdate({"_id":ObjectId(userId)},{$push:{feedActivity:{feedId:feedId,date:date,type:"comment"}}},function(err,currUser){
        if(err) throw err;
        else if(!currUser){
            console.log("Invade");
            res.json({success:false,message:'GTFO'});
        }
        else{
            feed.findOneAndUpdate({"_id":ObjectId(feedID)},{$inc:{"comment.count":1},$push:{"comment.activity":{text:comment,date:date,userId:userId}}},function(err){
                if(err) throw err ;
                res.json({success:true,message:'comment added'});
            });
        }
    });
    
});

// delete comment
app.post('/feed/delComment',function(req,res){

    
    var userId = req.body.userId;
    var feedId = req.body.feedId ;
    var comment = req.body.comment ;
    var date = Date.now() ;
    user.findOneAndUpdate({"_id":ObjectId(userId)},{$pull:{feedActivity:{feedId:feedId,type:"comment"}}},function(err,currUser){
        if(err) throw err;
        else if(!currUser){
            console.log("Invade");
            res.json({success:false,message:'GTFO'});
        }
        else{
            feed.findOneAndUpdate({"_id":ObjectId(feedID)},{$inc:{"comment.count":-1},$pull:{comment:{text:comment,userId:userId}}},function(err){
                if(err) throw err ;
                res.json({success:true,message:'comment deleted'});
            });
        }
    });     
    
});

// share
app.post('/feed/share',function(req,res){
// input @userId feedId
var userId = req.body.userID ;
var feedID = req.body.feedId ;
var date = Date.now() ;

});
// show feed






























app.get('/', function(req, res) {
        res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)

    });


app.get('/user', function(req, res) {
        res.sendfile('user_index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


app.post('/user/add',function(req,res){

     
     uname = req.body.uname;
     rname = req.body.rname;
     console.log("rname : ");
     console.log(rname);
     var placeId ;
     var lat;
     var long;
     


    place.findOne({'restaurant.name' : rname},function(err,Place){
            if (err) throw err;

            else if(!Place){console.log(" location not found in db") ;}


            placeId = Place._id;
            console.log("PLace id : ",placeId);
            //placeId = placeId.toString() ;
            lat = Place.restaurant.location.lat ;
            long = Place.restaurant.location.long ; 
            console.log(" lat ",lat ) ;

         
             console.log(" LONG :",long);

             var newuser = new user();

             newuser.name = uname;
             newuser.checkIn.whereId = placeId ;
             newuser.location.lat = lat;
             newuser.location.long = long ;
             newuser.checkIn.status = true ;

             console.log("New User : ftf ::",newuser) ;

             
             newuser.save(function(err){
                if(err) throw err;
                user.find(function(err,users){
                    if( err) throw err;
                    res.json(users)
                    });
                });
            });

});

app.get('/place', function(req, res) {
        res.sendfile('place_schema.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

app.post('/place/add',function(req,res){

    rname = req.body.rname;
    rlat = req.body.rlat;
    rlong = req.body.rlong ;
    var newPlace = new place({
        restaurant : {
            name : rname ,
        location : {
            lat : rlat,
            long : rlong
        }
    }

    });

    newPlace.save(function(err){
        if(err) throw err ;

        

        console.log("Place added");
        place.find(function(err,places){
            if(err) throw err;
            res.json(places) ;
            
            });

});


});

// image support





app.listen(8080);
console.log("App listening on port 8080");


// function to  fetch 