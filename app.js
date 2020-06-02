var express =require("express");

var bodyparser =require("body-parser");
var mongoose =require("mongoose");
var app=express();
var methodoverride=require("method-override");


mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("_method"));
mongoose.set('useFindAndModify', false);
  mongoose.Types.ObjectId.isValid('your id here');

//mongopse model config



var blogschema= new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type: Date, default: Date.now}
	
	
})
var blog =mongoose.model("blog",blogschema);






//RESTful ROUTING

app.get("/",function(req,res){

 	res.redirect("/blogs");
 });



//INDEXROUTE



 app.get("/blogs",function(req,res){
	
 	blog.find({},function(err,blogs)
 			 {
		if(err)
 			{
 				console.log(err);
 			}
 		else
 			{
 				res.render("index.ejs",{blogs : blogs });
 }
 	});
			  
	
 });

//NEWROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
}
);

//CREATEROUTE
app.post("/blogs",function(req,res)
		{
		blog.create(req.body.blog,function(err,newblog)
				   {
			if(err)
				{
					res.render("new");
				}
			else
				res.redirect("/blogs");
		});
	
});

//SHOWPAGE

	
app.get("/blogs/:id", function(req, res){
   blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
		 
       } else {
		   
           res.render("show", {blog:foundBlog});
       }
   })
});


//EDIT ROUTE 
app.get("/blogs/:id/edit",function(req,res)
	   {
	blog.findById(req.params.id,function(err,foundblog)
				 {
		if(err)
			{
				res.redirect("/blogs");
			}
		else{
			res.render("edit",{blog :foundblog});
		}
	});
})


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    
   blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DESTROY
app.delete("/blogs/:id",function(req,res)
	   {
	blog.findByIdAndRemove(req.params.id,function(err)
						  {
		if(err)
			{
				console.log("error");
			}
		else
			{
				res.redirect("/blogs");
			}
	})
});

app.listen(3000,function(){
	console.log("app started")
})

