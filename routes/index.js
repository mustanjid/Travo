var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require("../middleware");

    /*=============================
        SHOW HOME PAGE/root route
    ==============================*/
    if(middleware.isLoggedIn)
    {
        router.get("/", middleware.isLoggedIn,function(req,res){
            res.redirect("/places");
        });
        
    }else{
        router.get("/", function(req,res){
            res.render("home");
        });
    }
   

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Getting Register FORM
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    router.get("/register", function(req,res){
        res.render("user/signup");
    });

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~
       creating a new user
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
   router.post("/register", function(req,res){
        var newUser = new User({username: req.body.username});
        if(req.body.password == req.body.confirmPassword){
        User.register(newUser, req.body.password, function(err, user){
            if(err){
                req.flash("error",err.message);
            console.log(err);
            res.redirect("/register");
            }
            passport.authenticate("local")(req,res, function(){
                req.flash("success", "Welcome to Travellers ," +user.username );
            res.redirect("/places");
            })

        })
        }else{
            req.flash("error","Password does not matched");
            res.redirect("/register"); 
        }
    });

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~
        login form & authenticate
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    router.get("/login", function(req,res){
        res.render("user/login");
    });

    router.post("/login",passport.authenticate("local", {
        successRedirect:"/places",
        failureRedirect:"/login"
    }), function(req,res){
        req.flash("error","Invalid Username or Password");
        res.redirect("/login");
    });

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~
        log out logic & route
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    router.get("/logout", function(req,res){
        req.logout();
        req.flash("success","Logged You Out!");
        res.redirect("/places");
    });

    /*making middleware for checking session 
    & user authentication for functionalities*/
    function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
        return next();
        }
        res.redirect("/login");
    }


    module.exports = router;