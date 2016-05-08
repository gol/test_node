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
	share : {
		count : {Number,"default" : 0},	
		activity : [{userId:String,feedId :String,date :Date}]
		// to track who is sharing
		// feedId will be the new feedId which will be given to other users feed

	},
	sponsored:{Boolean,"default":false},
	comments:{
		count:{Number,"default":0},
		activity :[{text:String,date:Date,userId:String}]
	},
	privacy:{
		public : {Boolean,"deafult":true},
		privte : {Boolean,"deafult":false}
	},
	feedScore: {Number,"default":0},
	tagged:[{name:String,userId:String}],
	metadata: [{String}]

	// metadata : description hastag [ defined hashtag ]
	// with people feature 

});

module.exports = mongoose.model('feed',feedSchema);



