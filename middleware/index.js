/*==============================
    ALL THE MIDDLEWARE GOES HERE
===============================*/
var Place = require("../models/place");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkStoryOwnership = function(req,res,next){
    //is user logged in?
    if(req.isAuthenticated()){
      Place.findById(req.params.id, function(err,foundPlace){
        if(err){
          req.flash("error","Something went wrong");
          res.redirect("back");
        }else{
           //does the user own the story?
           if(foundPlace.author.id.equals(req.user._id)){
            next();
           }else{
            req.flash("error","You dont have permission");
              res.redirect("back");
           }
         
        }
      })
    }
    else{
      req.flash("error","You need to be logged in");
      res.redirect("back");
    }
  
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    //checking user own comments or not
        //is user logged in?
        if(req.isAuthenticated()){
          Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
              req.flash("error","Story not found");
              res.redirect("back");
            }else{
               //does the user own the story?
               if(foundComment.author.id.equals(req.user._id)){
                next();
               }else{
                req.flash("error","You dont have permission");
                  res.redirect("back");
               }
             
            }
          })
        }
        else{
          req.flash("error","You need to be logged in");
          res.redirect("back");
        }
      
};

middlewareObj.isLoggedIn = function(req,res,next){
        if(req.isAuthenticated()){
        return next();
        }
        req.flash("error", "Please Login First!");
        res.redirect("/login");

};

module.exports = middlewareObj;