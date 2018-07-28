require("dotenv").config();

// Dependencies
var fs = require("fs");
var request = require("request");
var keys = require("./keys");
var twitter = require("twitter");
var spotifyAPI = require("node-spotify-api");

// Storing arguments in arrays to serve as commands
var search = process.argv[2];
var term = process.argv.slice(3).join("+");

// Creates empty strings to store user input
var userInput = "";

// Adds each word in command to the array
function storeInput() {
    for (var i = 0; i < term.length; i++) {
        userInput = userInput + term[i];
    }

    console.log("Searching for " + userInput + "\n")
}

// Function to call and return movie entered by the user
function movieThis() {
    var movieName;
    storeInput();

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

            fs.appendFile("log.txt", "\nThe movie you requested: \n" + "\nName: " + data.Title + "\nYear: " + data.Year + "\nIMDB Rating: " + data.imdbRating + "\nRotten Tomatoes Rating: " + data.Ratings[1].Value + "\nCountry: " + data.Country + "\nLanguage: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors + "\n----------------------------------------------------", function(err) {
                if (err) {
                    return err
                }
            })
        }
    })
}

// Function to call and return the last 20 tweets 
function myTweets() {
    var client = new twitter(keys.twitter);

    var param = {
        screen_name: "webdevtest123",
        count: 20
    };

    client.get("statuses/user_timeline", param, function(error, tweets) {
        if (error) {
            console.log(error);
        }

        for (var i = 0; i < tweets.length; i++) {
            var currentTweet = tweets[i].text;
            var tweetTime = tweets[i].created_at;
            console.log("\nTweet: " + currentTweet + "\nDate tweeted: " + tweetTime + "\n----------------------------------------------------");

            fs.appendFile("log.txt", "\nTweet: " + currentTweet + "\nDate tweeted: " + tweetTime + "\n----------------------------------------------------", function(err) {
                if (err) {
                    return err
                }
            })
        }
    }); 
}

// Function to call and return song entered by the user
function spotifyThisSong() {
    storeInput();

    var spotify = new spotifyAPI(keys.spotify);
	var query;

	if (userInput !== "" && userInput !== null) {
		query = userInput;
	} else {
		query = "The Sign";
	}

	spotify.search({type: "track", query: query}, function(err, data) {
  		if (err) {
    		return err;
  		}
		
        console.log("\nThe song you requested: \n" + "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong: " + query + "\nAlbum: " + data.tracks.items[0].album.name + "\nPreview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify + "\n---------------\n");
        
        fs.appendFile("log.txt", "\nThe song you requested: \n" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\nSong: " + query + "\nAlbum: " + data.tracks.items[0].album.name + "\nPreview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify + "\n----------------------------------------------------", function(err) {
            if (err) {
                return err
            }
        })

		});
    
}

// Function to perform previous actions through the use of a txt file
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error)
        }

        var dataArray = data.split(",");
        console.log(dataArray);

        search = dataArray[0];
        term = dataArray[1];

        // Determines which function to carry out by using the case as the command
        switch (search) {
            case "movie-this":
            movieThis();
            break;
        
            case "my-tweets":
            myTweets();
            break;
        
            case "spotify-this-song":
            spotifyThisSong();
            break;
        }
    })
}

// Determines which function to carry out by using the case as the command
switch (search) {
    case "movie-this":
    movieThis();
    break;

    case "my-tweets":
    myTweets();
    break;

    case "spotify-this-song":
    spotifyThisSong();
    break;

    case "do-what-it-says":
    doWhatItSays();
    break;
}