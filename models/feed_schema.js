
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
		// to ttrack who is liking
	},
	location : {
		name: String,
		lat: Number,
		long: Number
	},
	comments:[{text:String,date:Date,userId:String}],
	share : {
		count : {Number,"default" : 0},
		activity : [{userId:String,feedId :String,date :Date}]
		// to track who is sharing
		// feedId will be the new feedId which will be given to other users feed

	}

});

module.exports = mongoose.model('feed',feedSchema);



