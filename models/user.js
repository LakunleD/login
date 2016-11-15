var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/nodeauth');

var db = mongoose.connection;

//User Schema

var userSchema = mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type: String
    },
    email:{
        type:String
    },
    name:{
        type:String
    }
});

var User = module.exports = mongoose.model('User', userSchema);



module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

