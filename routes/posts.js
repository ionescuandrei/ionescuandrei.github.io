 
 var express=require("express");
 var router=express.Router();
 var Posts=require("../models/posts");
 var middleware=require("../middleware");

 //============
 //POSTROUTS
 //============
router.get("/", function(req,res){
    res.render("landing");
});
router.get("/posts", function(req,res){
    //Get posts from DB
    Posts.find({}, function(err,post){
        if(err){
            console.log(err);
        }else{
            res.render("posts/index",{posts:post, currentUser:req.user});
        }
    })
        
});
router.post("/posts",middleware.isLoggedIn, function(req,res){
    //get data from form and add to post array
    var title=req.body.title;
    var image=req.body.image;
    var category=req.body.category;
    var shortDescription=req.body.shortDescription;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username: req.user.username
    };
    var newPost={title:title,category:category,image:image,shortDescription:shortDescription, description:description, author:author};
   //Create a new post and save to db
   Posts.create(newPost, function(err, post){
       if(err){
           console.log(err);
       }else{
           console.log("Post succesful created and saved to dbs",post);
           res.redirect("/posts");
       }
   })
    
});
router.get("/posts/new",middleware.isLoggedIn, function(req, res) {
    res.render("posts/newpost");
});
router.get("/posts/:id", function(req, res) {
    //find the post that provided the id
    Posts.findById(req.params.id).populate("comments").exec(function(err,foundPost){
        if(err){
            console.log(err);
        }else{
             //render that show templete
             res.render("posts/show",{post:foundPost});
        }
    });
   
});
//Edit routes
router.get("/posts/:id/edit", middleware.checkPostOwnership, function(req, res) {
        Posts.findById(req.params.id, function(err,foundPost){
                 res.render("posts/edit", {post:foundPost});
            })
       });
//update routes
router.put("/posts/:id",middleware.checkPostOwnership,function(req,res){
    Posts.findByIdAndUpdate(req.params.id, req.body.post, function(err,foundPost){
        if(err){
            res.redirect("/posts");
        }else{
            res.redirect("/posts/"+req.params.id);
        }
    });
});
//delete routes
router.delete("/posts/:id",middleware.checkPostOwnership, function(req,res){
   Posts.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/posts");
       }else{
           res.redirect("/posts");
       }
   })
})
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect("/login");
//          }
// }
// function checkPostOwnership(req,res,next){
//      if(req.isAuthenticated()){
//         Posts.findById(req.params.id, function(err, foundPost){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 //does user own the post
//                  if(foundPost.author.id.equals(req.user._id)){
//                  next();
//                 }else{
//                  res.redirect("back");
//                 }
//             }
//     });
//      }else{
//             res.redirect("back");
//         }
// }
module.exports=router;