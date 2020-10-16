var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var middleware = require("../middleware");

router.get("/", function(req, res) {
	/* Get all recipes from db */
	Recipe.find({}, function(err, allRecipes) {
		if(err) {
			console.log(err);
		} else {
			res.render("recipes/index", {recipes:allRecipes, currentUser: req.user})
		}
	})
});

/* Create - add new recipe to DB */
router.post("/", middleware.isLoggedIn, function(req, res) {
	/* Get data from form and add to recipe array */
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRecipe = {name: name, price: price, image: image, description: desc, author: author}
	/* Create a new recipe and save to DB */
	Recipe.create(newRecipe, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			/* Redirect to recipes */
			res.redirect("/recipes");
		}
	});
});

/* New - show form to create new recipes */
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("recipes/new");
});

/* Show - recipe info */ 
router.get("/:id", function(req, res) {
	/* Find the ID of the recipe */
	Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
		if(err) {
			console.log(err)
		} else {
			/* Render show template of recipe */
			res.render("recipes/show", {recipe: foundRecipe})
		}
	});
});

/* Edit - recipe route */
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res){
	Recipe.findById(req.params.id, function(err, foundRecipe){
		res.render("recipes/edit", {recipe: foundRecipe});
	});
});

/* Update - recipe route */
router.put("/:id", middleware.checkRecipeOwnership, function(req, res){
	/* Find and update the recipe */
	Recipe.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedRecipe){
		if(err){
			res.redirect("/recipes");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

/* Destroy - remove recipe */
router.delete("/:id", middleware.checkRecipeOwnership, function(req, res){
	Recipe.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/recipes");
		} else {
			res.redirect("/recipes");
		}
	});
});

module.exports = router;


