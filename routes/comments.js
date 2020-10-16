var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req,res) {
	Recipe.findById(req.params.id, function(err, recipe) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {recipe: recipe});
		}
	})
});

router.post("/", middleware.isLoggedIn, function(req, res) {
	//Lookup campground using ID
	Recipe.findById(req.params.id, function(err, recipe){
		if(err) {
			console.log(err);
			res.redirect("/recipes");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					recipe.comments.push(comment);
					recipe.save();
					req.flash("success", "Successfully added a comment");
					res.redirect("/recipes/" + recipe._id);
				}
			})
		}
	});
});

/* Edit Comment */
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit",{recipe_id: req.params.id, comment: foundComment});	
		}
	});
});

/* Update Comment */
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

/* Remove Comment */
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	/* Find comment by id then remove */
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("Success", "Comment deleted");
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

module.exports = router;



