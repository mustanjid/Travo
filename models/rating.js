var mongoose = require('mongoose');

var ratingSchema = new mongoose.Schema({
    storyId: {
        type: String
    },
    like: {
        type: String
    },
    username: {
        type: String
    }
});

module.exports = mongoose.model("Rating",ratingSchema);