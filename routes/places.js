var express = require('express');
var router = express.Router();
var Place = require('../models/place');
var Rating = require('../models/rating');
var Share = require("../models/share")
var User = require('../models/user');

var middleware = require("../middleware");

//uplodaing image using multer & cloudinary cloud storage
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

//set up cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'duhqv5ngk',
  api_key: 537942968391159,
  api_secret: '_MKQ6KERZNDyf7yG2nl4qhuEz54'
});

/*======================
Index - show all places
========================*/

router.get("/", middleware.isLoggedIn, function (req, res) {
  Place.find({}, function (err, allPlaces) {
    if (err) {
      console.log("OOPS! Something wrong");
      console.log(err);
    } else {
      res.render("places/index", { places: allPlaces, currentUser: req.user });
    }
  })
});

/*======================
creating a new place
=========================*/

router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {

  cloudinary.uploader.upload(req.file.path, function (result) {
    // add cloudinary url for the image to the campground object under image property
    req.body.place.image = result.secure_url;
    // add author to campground
    req.body.place.author = {
      id: req.user._id,
      username: req.user.username
    };
    Place.create(req.body.place, function (err, place) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/places/' + place.id);
    });
  });

  //  cloudinary.uploader.upload(req.file.path, function(result) {
  //       // add cloudinary url for the image to the campground object under image property
  //       req.body.place.image = result.secure_url;
  //       // add author to campground
  //       req.body.place.author = {
  //         id: req.user._id,
  //         username: req.user.username
  //       }
  //       Place.create(req.body.place, function(err, place) {
  //         if (err) {
  //           req.flash('error', err.message);
  //           return res.redirect('back');
  //         }
  //         res.redirect('/places/' + place.id);
  //       });
  //     });

});

//show - form for creating a new place
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("places/new.ejs");
});

/*
    keep in mind that if the below route declare before the above then the "/places/new" does not work   
    -------------------------------------------------------------------------------------------------------- */

/*==========================
    POST SHOW ROUTE
  =========================*/

router.get("/:id", middleware.isLoggedIn, function (req, res) {
  //find the places with id
  Place.findById(req.params.id).populate("comments").exec(function (err, foundPlace) {
    if (err) {
      console.log(err);
    } else {
      // console.log(foundPlace);
      // Rating.find({username: req.user.username}, (error,) => {
      //   console.log(username.username);
      // });
      console.log(req.user.username);
      Rating.find({ storyId: req.params.id }).count((error, ratings) => {
        Rating.find({ storyId: req.params.id, username: req.user.username },(error, likes) => {
          if(likes.length>0){
            res.render("places/show", {
              checkLike: 'Unike',
              place: foundPlace,
              totalLikes: ratings
            });
          } else{
            res.render("places/show", {
              checkLike: 'Like',
              place: foundPlace,
              totalLikes: ratings
            });
          }
        });
      });
    }
  })
});

/*==============================
  SHOW EDIT FORM
  ============================*/
router.get("/:id/edit", middleware.checkStoryOwnership, function (req, res) {
  Place.findById(req.params.id, function (err, foundPlace) {
    res.render("edit", { place: foundPlace })
  })
});

router.get("/:id/edit", middleware.checkStoryOwnership, function (req, res) {
  Place.findById(req.params.id, function (err, foundPlace) {
    res.render("edit", { place: foundPlace })
  })
});


/*==============================
  update the edit form
  ============================*/
router.put("/:id", middleware.isLoggedIn, function (req, res) {
  Place.findByIdAndUpdate(req.params.id, req.body.post, function (err, findPlace) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/places/" + req.params.id);
    }
  })
});

/*==============================
  DELETE STRORY ROUTE
  ============================*/
router.delete("/:id", middleware.checkStoryOwnership, function (req, res) {
  Place.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/places");
    }
  })
});

/*======================
      share route
    =====================*/
router.post("/:id/share",function(req,res){
    var share = new Share({
      author: req.user._id,
      place: req.params.id
  })

  share.save();
  req.flash("success","Your story successfully shared");
  res.redirect("/places/"+req.params.id);
})


module.exports = router;