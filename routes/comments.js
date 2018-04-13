var express = require('express');
var router  = express.Router({mergeParams: true});
var Place  = require('../models/place');
var Comment  = require('../models/comment');
var middleware = require("../middleware");


  /*======================
        COMMENT ROUTE
    =====================*/


    /*======================
        getting comment form
    =====================*/
    router.get("/new",middleware.isLoggedIn, function(req,res){
        Place.findById(req.params.id, function(err,foundPlace){
          if(err){
            console.log(err);
          }else{
            res.render("comments/new",{place: foundPlace});
          }
        })
       
    });
    
    /*======================
      creating a new comment
    =====================*/
    router.post("/",middleware.isLoggedIn,function(req,res){
      Place.findById(req.params.id, function(err, foundPlace){
        if(err){
          req.flash("error","Something went wrong");
          console.log(err);
          res.redirect("/places");
        }else{
         Comment.create(req.body.comment,function(err,comment){
          if(err){
            console.log(err);
          }else{
            //add username & comment to it
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;

            // save the comment 
            comment.save();
            foundPlace.comments.push(comment);
            foundPlace.save();
            // console.log(comment);
            req.flash("success","Your comment successfully added");
            res.redirect("/places/"+foundPlace._id);
          }
         
         });
        }
      })
    });

  /*=========================
     comment edit routes
    =========================*/
    router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
          Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
              req.flash("error","Something went wrong");
              res.redirect("back");
            }
            else{
              res.render("comments/edit",{place_id: req.params.id, comment: foundComment});
            }
          })
    });

    /*=========================
     comment update route
     places/:id/comments/:comment_id
    =========================*/
    router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
      Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updateComment){
        if(err){
          res.redirect("back");
        }else{
          res.redirect("/places/"+ req.params.id);
        }
      })
    });

    /*=========================
      Comment Destroy Routes 
    =========================*/
    router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
      Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
          res.redirect("back");
        }else{
          req.flash("success","Comment deleted");
          res.redirect("/places/"+req.params.id);
        }
      })
    });
    
      


module.exports = router;