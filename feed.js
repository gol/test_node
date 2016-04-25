var feed = require('feed_schema');
var user = require('user_schema');
var place = requie('place_schema');


// feed : user metedata,location,body,comments,likes  






app.post('/feed/post',userUtils.verifyRuderToken,function(req,res)){

	var user_name = req.decode.name;
	var user_id = req.decode.user_id ;
	var date = Date.now() ;
	console.log(' User :',user_name, 'with id :', user_id , 'wants to post');

	user.findById(user_id,function(err,curr_user){
		if(err) {
			console.log('Error in searching srror',err);
			res.send(err) ;
		        }
		else if (!curr_user){
			console.log('user not found in db');
			res.json({success:false, message:'GTFO'});

		}
		else {
			console.log(" Adding feed to  db") ;
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
					//else if (!place){ console.log(" Empty place even though id exist") ;  }

					else {
						locationName = place.restaurant.name ;
						locationLat = place.resturnat.location.lat ;
						locationLong = place.resturnat.location.long ;
						console.log("User is vibrating from :",locationName) ;
						}
				});

				}
			else{
				// user not cheked in
				// handle function to assign him place 
			    }

			    var newFeed = new feed({
			    		userId : user_id,
						username : user_name,
						body: req.body.feedText,
						createdOn: Date.now(),
						like : 0,
						location : {
							name : locationName,
							lat :  locationLat,
							long : LocationLong
						       }     
  					});

			    newFeed.save(function(err){
			    	if(err) throw err ;

			    	console.log(" feed added to data base successfully") ;
			    });

			}

});




//like count 
//post deletion
//post updation



// displatying feed :
// get feeds of fof in thet specific location
// location :- feed mapping 
// get list of feeds of  nearby location desc time
// get friend list and get their locations ,filter the locations based on distance between location, based on locations filter[ wchich locations] 


app.get('/feed/get',function(request,response){
        
        //logic to find user feeds
});