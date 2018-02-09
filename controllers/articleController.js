var express = require("express");
var router = express.Router();
var request = require("request");
var mongoose = require("mongoose");
var db = require("../models");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

router.get("/scrape", function(req, res) {
    request("http://www.foxnews.com/us.html", function(error, response, html) {
        var $ = cheerio.load(html);

        $(".article").each(function(i, element) {
            var title = $(element).find("h2").find("a").text();
            var link = $(element).find(".info").children(".info-header").children("h2").children("a").attr("href");
            var blurb = $(element).find("p").find("a").text();
            var contentNum = $(element).children("meta").attr("content");
            var dbLink;
            if(link === undefined) {
                return;
            }
            else if(link.indexOf("/") === 0) {
                dbLink = `http://www.foxnews.com${link}`;
            }
            else {
                dbLink = link;
            }
            db.Article.create({
                title: title,
                link: dbLink,
                blurb: blurb,
                contentNum: contentNum
            })
            .then(function(dbArticles) {
                var hbsScrape = {
                    articles: dbArticles
                }
            })
            .catch(function(err) {
                res.send(err);
            });
        });
    });
});

router.get("/", function(req, res) {
    db.Article.find({}).populate("note")
    .then(function(dbArticle) {
        var hbsObject = {
            articles: dbArticle
        }
        res.render("index", hbsObject);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        var hbsWithNote = {
            articles:dbArticle
        }
        res.render("index", hbsWithNote);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        var linkNum = req.params.id;
        console.log(linkNum);
        console.log("dbNote._id: " + dbNote._id);
        return db.Article.findOneAndUpdate({ _id: linkNum }, { $push: {note: dbNote._id} }, {new: true});
    })
    .then(function(dbArticle) {
        console.log(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

module.exports = router;