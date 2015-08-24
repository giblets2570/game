// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define our user model
// module.exports allows us to pass this to other files when it is called

var userSchema = mongoose.Schema({
    name : {type : String, default: ''},
    password: {type : String, default: ''},
    email: {type : String, default: ''}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);