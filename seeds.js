var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "New Jersey Pizza", 
        image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2011/11/4/0/CCGEA311_Pizza-Pizzas_s4x3.jpg.rend.hgtvcom.826.620.suffix/1382540656778.jpeg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Jeff's Blueberry Muffins", 
        image: "https://www.simplyrecipes.com/wp-content/uploads/2019/06/Blueberry-Muffins-LEAD-2-1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jeff"
        }
    },
    {
        name: "Aunt Jill's chicken noodle soup", 
        image: "https://kristineskitchenblog.com/wp-content/uploads/2018/01/instant-pot-chicken-noodle-soup-700-877-500x500.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jill"
        }
    }
]
 
function seedDB(){
   //Remove all recipes
   Recipe.deleteMany({}, function(err){
        if (err){
            console.log(err);
        }
        console.log("removed recipes!");
        Comment.deleteMany({}, function(err) {
            if (err){
                console.log(err);
            }
            console.log("removed comments!");
            //add recipes
            data.forEach(function(seed){
                Recipe.create(seed, function(err, recipe){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a recipe");
                        //create a comment
                        Comment.create(
                            {
                                text: "Great recipe, I really enjoyed cooking it",
                                author:{
                                    id : "588c2e092403d111454fff76",
                                    username: "Max"
                                }
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    recipe.comments.push(comment);
                                    recipe.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        })
    }); 
    //add a few comments
}
 
module.exports = seedDB;