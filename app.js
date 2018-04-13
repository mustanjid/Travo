  //setting the express server
  var express     = require('express'),
      app         = express(),
      mongoose    = require('mongoose'),
      passport    = require('passport'),
      passportLocalMongoose = require('passport-local-mongoose'),
      localStrategy = require('passport-local'),
      bodyParser  = require('body-parser'),
      methodOverride = require('method-override'),
      flash       = require('connect-flash'),
      Place = require("./models/place"),
      Comment = require("./models/comment"),
      User = require('./models/user'),
      Rating = require('./models/rating'),
      Share = require('./models/share')
      cookieParser = require("cookie-parser"),
      seedDB = require('./seeds');


      // var fileUpload = require('express-fileupload');
//requiring routes
var commentRoutes = require('./routes/comments'),
    placeRoutes   = require('./routes/places'),
    indexRoutes   = require('./routes/index');
    ratingRoutes = require('./routes/rating');
    shareRoutes = require('./routes/share');
    

  mongoose.connect('mongodb://localhost/Travellers_DB_V3');
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(__dirname + "/public"));
  app.use(methodOverride("_method"));
  app.use(require("express-session")({
    secret: "Travellers User",
    resave : false,
    saveUninitialized : false

  }));

  //Flash SETUP
  app.use(flash());

  //PASSPORT CONFIG
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use(cookieParser('secret'));

  app.use(function(req,res, next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
  });

  // app.use(fileUpload());
  //MERGING & INITIALIZING ROUTES
  app.use("/",indexRoutes);
  app.use("/places",placeRoutes);
  app.use("/places/:id/comments",commentRoutes);
  app.use('/post/like', ratingRoutes);
  app.use('/post', shareRoutes);

  // app.use("/places/:id",ratingRoutes);

  app.set("view engine","ejs");
  // seedDB();

 
  //initialize server port. now its default
  app.listen(3000, () => console.log(" Travellers Server is running"));
