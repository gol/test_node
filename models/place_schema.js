
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var placeSchema = mongoose.Schema({

    restaurant         : {
        name           : String,
        link           : String,
        location       :{
            lat: Number,
            long:Number
        },
        usersCheckedIn:[{
            userId:String,
            name:String,
            fbId:String
        }]
    },
    feeds : [{feedId : String, date: Date}]
   
});

module.exports = mongoose.model('Place',placeSchema) ;