var express=require("express");
var bodyParser= require("body-parser");
var mongoose=require("mongoose");
var app =express();
var Posts=require("./models/posts");
var Comment=require("./models/comments");
var User=require("./models/user");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var postsRoutes=require("./routes/posts"),
    commentRoutes=require("./routes/comments"),
    authRoutes=require("./routes/auth"),
    methodOverride=require("method-override"),
    flash=require("connect-flash");

mongoose.connect("mongodb://localhost/kids_posts");
app.set("view engine", "ejs");
var seedDB=require("./seeds");
//seedDB();
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
//Passport config
app.use(require("express-session")({
    secret:"whta is your secret",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use(postsRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
     console.log(" The App2kidss server has started");
});