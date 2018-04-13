var mongoose = require('mongoose');

// Place Schema
var placeSchema = new mongoose.Schema({
    title: String,
    name:String,
    image: String,
    description: String,
    created: {type: Date, default:Date.now},
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
     
   },
    comments:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
      }
    ],
   likes:{
     type: mongoose.Schema.Types.ObjectId,
     ref:"Rating"
   }
  });

module.exports = mongoose.model("Places",placeSchema);