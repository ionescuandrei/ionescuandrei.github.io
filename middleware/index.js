var Posts=require("../models/posts");
var Comment=require("../models/comments");
var middleware={};
middleware.checkPostOwnership=function (req,res,next){
     if(req.isAuthenticated()){
        Posts.findById(req.params.id, function(err, foundPost){
            if(err){
                req.flash("error", "Post not found!");
                res.redirect("back");
            }else{
                //does user own the post
                 if(foundPost.author.id.equals(req.user._id)){
                 next();
                }else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
                }
            }
    });
     }else{
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
}
middleware.checkCommentsOwnership=function (req,res,next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.com_id, function(err, commentPost){
            if(err){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            }else{
                //does user own the post
                 if(commentPost.author.id.equals(req.user._id)){
                 next();
                }else{
                 req.flash("error", "You need to be logged in to do that!");
                 res.redirect("back");
                }
            }
    });
     }else{
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
}
middleware.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
         }
}
module.exports=middleware;