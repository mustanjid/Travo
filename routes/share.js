var express = require('express');
var router = express.Router({ mergeParams: true });
var Place = require('../models/place');
var User = require('../models/user');
var Share = require('../models/share')
var Rating = require('../models/rating');
var middleware = require("../middleware/index");

router.get("/share", middleware.isLoggedIn, function (req, res) {
    var userId = req.user._id;
    var ids = [];
    Share.find({author:userId}, function (err, shares) {
        if (err) {
            console.log(err);
        } else {
            shares.map((share) => {
                ids.push(share.place);
            });
            Place.find({_id: {$in: ids}}, (error, places) => {
                if(error){
                    console.log(error);
                }else{
                    res.render('user/timeline', {
                        places: places
                    });
                } 
            });
        }
    })
})

module.exports = router;