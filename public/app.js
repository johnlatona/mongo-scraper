$(document).ready(function() {
    $(".post-notes").hide();
    var isNoteShown = false;

    $("#scrape-button").click(function() {
        $.ajax("/scrape", {
            method: "GET"
        }).then(function(data) {
            console.log("articles scraped!");
            location.reload("/"); 
        })
    })

    $(".expand-note-button").click(function() {
        var thisId = $(this).attr("data-expand-id");
        var articleIds = [];
        $(".article").each(function() {
            articleIds.push($(this).attr("data-article-id"))
        })
        for(var i = 0; i < articleIds.length; i++) {
            if(thisId === articleIds[i]) {
                var divId = articleIds[i];
            }
        }
        console.log(divId);
        if(isNoteShown === false) {
            $("#" + divId).show();
            isNoteShown = true;
        }
        else {
            $("#" + divId).hide();
            isNoteShown = false;
        }
    });

    $(".post-note-button").click(function(event) {
        event.preventDefault();
        var id = $(this).attr("id");
        var note = $("#note-input-" + id).val().trim();
        var post = {
            noteBody: note
        }

        $.ajax("/articles/" + id, {
            method: "POST",
            data: post
        }).then(function(data) {
            console.log(data);
        })
        location.reload("/");
    })
});