// app/models/nerd.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our agent model
// module.exports allows us to pass this to other files when it is called

var levelSchema = mongoose.Schema({

   highScores: [{
        score: Number,
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
   }],

   map: [String]
});

module.exports = mongoose.model('Level', levelSchema);