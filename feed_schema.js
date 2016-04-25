
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
	likes: Number,
	location : {
		name: String,
		lat: Number,
		long: Number
	}

});

module.exports = mongoose.model('feed',feedSchema);



