var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Recipe = require("./models/recipe"),
	seedDB = require("./seeds"),
	User = require("./models/user"),
	Comment = require("./models/comment"),
	methodOverride = require("method-override"),
	flash = require("connect-flash");

var commentRoutes = require("./routes/comments"),
	recipeRoutes = require("./routes/recipes"),
	indexRoutes = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/recipeMe', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
/* Uncomment seed to load data into mongodb */
//seedDB();


/* Passport configuration */
app.use(require("express-session")({
	secret: "Jerry is a norfolk terrier",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/* Sets a local variable "currentUser" to all files so they can access req.user */
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("recipeMe has started");
});


