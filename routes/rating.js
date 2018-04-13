var express = require('express');
var router = express.Router({ mergeParams: true });
var Place = require('../models/place');
var User = require('../models/user');
var Rating = require('../models/rating');
var middleware = require("../middleware/index");

router.post('/', (req, res, next) => {
  var data = req.body;
  if (data.like == 'Like') {
    var rating = new Rating({
      storyId: data.storyId,
      like: data.like,
      username: data.username
    });
    rating.save((error) => {
      if (error) {
        console.log('error saving like');
      }
      console.log('success');
    });
  } else {
    Rating.findOneAndRemove({ storyId: data.storyId, username: data.username }, (error,rate) => {
      if (error) {
        console.log('error while unlike');
        console.log(rate);
      }
    });
  }
  res.send('like done');
});

module.exports = router;