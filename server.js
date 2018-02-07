var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper", {
    useMongoClient: true
});

var articleRoutes = require("./controllers/articleController.js")(app);
var noteRoutes = require("./controllers/noteController.js")(app);

app.use(articleRoutes);

app.listen(port, function(){
    console.log("Listening on PORT " + port);
});