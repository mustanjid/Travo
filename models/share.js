var mongoose = require('mongoose');

var shareSchema = new mongoose.Schema({
    author: String,
    place: String
});

module.exports = mongoose.model("Share",shareSchema);