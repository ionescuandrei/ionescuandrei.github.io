var express=require("express");
 var router=express.Router();
 var Posts=require("../models/posts");
 var Comment=require("../models/comments");
 var middleware=require("../middleware");
//===========
//COMMENTS
//===========
router.get("/posts/:id/comments/new",middleware.isLoggedIn, function(req, res) {
     Posts.findById(req.params.id, function(err,foundPost){
        if(err){
            console.log(err);
        }else{
             //render that show templete
             res.render("comments/new",{posts:foundPost});
         
        }
     });
});
router.post("/posts/:id/comments",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
  Posts.findById(req.params.id, function(err, post){
      if(err){
           console.log(err);
          res.redirect("/posts");
      } else {
          console.log(req.body.comments);
        Comment.create(req.body.comments, function(err, comment){
          if(err){
              req.flash("error", "Something went wrong!");
              console.log(err);
          } else {
              //add username and id to comment
              comment.author.id=req.user._id;
              comment.author.username=req.user.username;
              comment.save();
              post.comments.push(comment);
              post.save();
              req.flash("success", "Succesful added comment.");
              res.redirect('/posts/' + post._id);
          }
        });
      }
  });
});
//edit router
router.get("/posts/:id/comments/:com_id/edit",middleware.checkCommentsOwnership,function(req,res){
    Posts.findById(req.params.id, function(err, post) {
        Comment.findById(req.params.com_id,function(err, comment) {
            if(err){
                console.log(err);
            }else{
                res.render("comments/edit",{comment:comment, post:post});
            }
        });
    });
    
});
router.put("/posts/:id/comments/:com_id",middleware.checkCommentsOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.com_id, req.body.comments, function(err,foundComment){
       if(err){
           res.redirect("/posts");
       }else{
           res.redirect("/posts/"+req.params.id);
       }
   });
});
router.delete("/posts/:id/comments/:com_id",middleware.checkCommentsOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.com_id, function(err,foundComment){
       if(err){
           res.redirect("/posts/"+req.params.id);
       }else{
           req.flash("succes", "Comment deleted");
           res.redirect("/posts/"+req.params.id);
       }
   });
});

module.exports=router;