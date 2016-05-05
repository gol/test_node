
var mongoose =require('mongoose')


var feedSchema = mongoose.Schema({
	userId: String,
	userName: String,
	body:String,
	files:{
		count : {Number,"default":0},
		destination : String,
		fileName : String,
		path: String
	},
	createdon: Date,
	updatedon: Date,
	likes: {
		count:{Number,'default':0},
		activity : [{userId : String,date : Date}]
		// to track who is liking
	},
	location : {
		locationID:String,
		name: String,
		lat: Number,
		long: Number,
		checkedIn : Boolean
	},
	comments:[{text:String,date:Date,userId:String}],
	share : {
		count : {Number,"default" : 0},
		activity : [{userId:String,feedId :String,date :Date}]
		// to track who is sharing
		// feedId will be the new feedId which will be given to other users feed

	},
	sponsored:{Boolean,"default":false}
	// metadata : description hastag [ defined hashtag ]
	// with people feature 

});

module.exports = mongoose.model('feed',feedSchema);



