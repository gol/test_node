// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    name : {type:String,"default":''},
    checkIn          :{
        status:{type:Boolean,"default":false},
        type:{type:String,"default":''},
        whereId:{type:String,"default":''}
    },
    location        :{
        lat: {type:Number,"default":0},
        long: {type:Number,"default":0}
    },
    feeds :[{feedId: String,date: Date}]
    }
});



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);