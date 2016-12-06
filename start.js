const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

const port = process.env.PORT || 3000;
const botID = process.env.BOT_ID;
const url = "https://api.groupme.com/v3/bots/";
const groupID = process.env.GROUP_ID;

const isTrump = process.env.TRUMP;
let heightOfWall = 0;

const trumpChinaQuotes = ["We can’t continue to allow China to rape our country",
    "Listen, you motherfuckers, we’re going to tax you 25 percent!",
    "They are taking our jobs. China is taking our jobs. It is not going to happen anymore, folks!",
    "We’ve gone from a tremendous power that is respected all over the world to somewhat of a laughing stock and all of a sudden, people are talking about China and India and other places. That was the beginning of China.",
    "You have to bring in jobs, you have to take the jobs back from China, you have to take the jobs back from Mexico."];

const dict = new Map();
dict.set("who do we have", "We got some BAD HOMBRES. OUT, OUT, OUT!");
dict.set("global warming", "Believe me, the concept of global warming was created by and for the Chinese in order to make U.S. manufacturing non-competitive.");
dict.set("daughter", "https://i.redd.it/y0mscagubhdx.jpg");
dict.set("china", trumpChinaQuotes);

app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post("/", (req, res) => {
    postText = "";
    const toSearchFor = "@giphy ";
    const index = req.body.text.toLowerCase().indexOf(toSearchFor);
    
    //If we found the string we're looking for get results and send them
    if (index != -1) {
        //Get the string we are searching for.
        const toSearch = req.body.text.substring(index + toSearchFor.length);
        
        //Get the total, encoded URL we're going to pass to Giphy to search
        const giphyurl = `http://api.giphy.com/v1/gifs/search?limit=5&q=${encodeURIComponent(toSearch)}&api_key=dc6zaTOxFJmzC`;
        
        request.get(giphyurl, (error, response, body) => {
            const results = JSON.parse(body)["data"];
            //Get up to the top five
            const numTopResults = (results.length < 5) ? results.length : 5;
            if (error || numTopResults === 0) {
                sendMessage(botID, "Nothing found 😥");
            } else {
                const indexSelected = Math.floor(Math.random() * (numTopResults));
                const selected = results[indexSelected].images.original.url;
                console.log(`${toSearch}=>${selected}`);
                sendMessage(botID, selected);
            }
        });
    }
    if (isTrump && req.body.sender_type !== "bot") {
        const buildTheWall = "the wall";
        const wallIndex = req.body.text.toLowerCase().indexOf(buildTheWall);
        if (wallIndex != -1) {
            heightOfWall += 10;
            sendMessage(botID, `The wall just got 10ft higher. It's now ${heightOfWall}ft high.`);
        }
        for (const [key, value] of dict) {
            const index = req.body.text.toLowerCase().indexOf(key);
            if (index != -1) {
                if (typeof(value) === "string") {
                    sendMessage(botID, value);
                } else if (typeof(value) === "object") {
                    sendMessage(botID, value[Math.floor(Math.random() * (value.length))]);
                } else {
                    console.log("Type error.");
                }
            }
        }
    }
    res.end();
});

function sendMessage(botID, text) {
    const toSend = `${url}post?bot_id=${botID}&text=${encodeURIComponent(text)}`;
    request.post(toSend, (error, response, body) => {
        if (error) {
            console.log(error);
        }
    });
}

