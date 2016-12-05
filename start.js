const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

const port = process.env.PORT || 3000;
const botID = process.env.BOT_ID;
const url = "https://api.groupme.com/v3/bots/";
const groupID = process.env.GROUP_ID;


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
        const giphyurl = `http://api.giphy.com/v1/gifs/search?limit=1&q=${encodeURIComponent(toSearch)}&api_key=dc6zaTOxFJmzC`;
        
        request.get(giphyurl, (error, response, body) => {
            //If there was an error, or no gifs were found
            if (error || !JSON.parse(body)["data"][0]) {
                sendMessage(botID, "Nothing found :(");
            } else if (body) {
                const res = JSON.parse(body)["data"][0].images.original.url;
                console.log(`${toSearch}=>${res}`);
                sendMessage(botID, res);
            }
        });
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