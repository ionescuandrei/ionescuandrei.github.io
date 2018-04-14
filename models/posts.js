var mongoose=require("mongoose"); 
var postsSchema= new mongoose.Schema({
    title:String,
    category:String,
    image:[{
        type:String
    }],
    shortDescription:String,
    description:[{
        type:String
    }],
    created:{type: Date, default: Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
     comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
module.exports=mongoose.model("Posts", postsSchema);