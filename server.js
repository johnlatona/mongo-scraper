var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoscraper", {
    useMongoClient: true
});

app.get("/scrape", function(req, res) {
    db.scrapedData.remove({});
    request("http://www.foxnews.com/us.html", function(error, response, html) {
        var $ = cheerio.load(html);

        $(".article").each(function(i, element) {
            var title = $(element).find("h2").find("a").text();
            var link = $(element).find("h2").attr("a");
            var blurb = $(element).find("p").find("a").text();
            if(title && img && blurb) {
                db.scrapedData.insert({
                    title: title,
                    img: img,
                    blurb: blurb
                }, function(err, inserted) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(inserted);
                    }
                });
            }
        });
    });
    res.send("Scrape Complete");
})