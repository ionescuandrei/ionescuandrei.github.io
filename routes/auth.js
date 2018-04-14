var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
//============
 //AUTH ROUTS
 //============
 
 //show registre form
router.get("/register",function(req, res) {
     res.render("register");
 });
 //handle sigup logic
 router.post("/register", function(req, res) {
     var newUser=new User({username: req.body.username})
     User.register(newUser, req.body.password, function(err,user){
         if(err){
             console.log(err);
             req.flash("error", err.message);
             res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
             req.flash("success", "Welcome to App2Kids "+ user.username);
             res.redirect("/posts");
         })
     })
 })
 router.get("/login", function(req, res) {
     res.render("login");
 })
 router.post("/login",passport.authenticate("local", {successRedirect:"/posts",failureRedirect:"/login"}), function(req, res) {
     
 });
 router.get("/logout",function(req, res) {
     req.logout();
     req.flash("success", "Logged you out");
     res.redirect("/posts");
 });
 module.exports=router;