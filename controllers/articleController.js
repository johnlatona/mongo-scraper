var express = require("express");
var router = express.Router();
var request = require("request");
var mongoose = require("mongoose");

router.get("/scrape", function(req, res) {
    db.Article.remove({});
    request("http://www.foxnews.com/us.html", function(error, response, html) {
        var $ = cheerio.load(html);

        $(".article").each(function(i, element) {
            var title = $(element).find("h2").find("a").text();
            var link = $(element).find("h2").attr("a");
            var blurb = $(element).find("p").find("a").text();
            if(title && img && blurb) {
                db.Article.create({
                    title: title,
                    link: `http://www.foxnews.com${link}`,
                    blurb: blurb
                })
                .then(function(dbArticles) {
                    res.render("index", dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            }
        });
    });
    res.send("Scrape Complete");
});

router.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, {new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});