// Dependencies

var fs = require("fs");
var request = require("request");
var keys = require("./keys");
var dotenv = require("dotenv").config();
var twitter = require("twitter");
var spotify = require("node-spotify-api");

// var spotifyKey = new Spotify(keys.spotify);


var search = process.argv[2]; 
var term = process.argv.slice(3).join("+");

var userInput = "";

function storeInput() {
    for (var i = 0; i < term.length; i++) {
        userInput = userInput + term[i];
    }

    console.log("Searching for " + userInput + "\n")
}

function movieThis() {
    var movieName;
    storeInput()

    if (userInput !== "") {
        movieName = userInput;
    } else {
        movieName = "Mr.Nobody"
    }

    var queryURL = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryURL)

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            data = JSON.parse(body)
            console.log("Name: " + data.Title)
            console.log("Year: " + data.Year)
            console.log("IMDB Rating: " + data.imdbRating)
            console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value)
            console.log("Country: " + data.Country)
            console.log("Language: " + data.Language)
            console.log("Plot: " + data.Plot)
            console.log("Actors: " + data.Actors)
        }
    })
}

function myTweets() {
    var client = new twitter(keys.twitter);

    var param = {
        screen_name: "webdevtest123"
    };

    client.get("statuses/user_timeline", param, function(error, response, tweets) {
        if (error) {
            console.log(error);
        }

        for (var i = 0; i < 20; i++) {
            console.log(tweets[i].text + "\nDate tweeted: " + tweets[i].created_at);
        }
    });

    
}

switch (search) {
    case "movie-this":
    movieThis();
    break;

    case "my-tweets":
    myTweets();
    break;
}