var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function checkRecipeOwnership(req, res, next) {
	if(req.isAuthenticated()){
		Recipe.findById(req.params.id, function(err, foundRecipe){
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("back");
			} else {
				if(foundRecipe.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// does user own the comment
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;


