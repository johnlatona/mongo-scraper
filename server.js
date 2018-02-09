var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

var PORT = process.env.PORT || 3000;

var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

var routes = require("./controllers/articleController.js");

app.use(routes);

app.listen(PORT, function(){
    console.log("Listening on PORT " + PORT);
});