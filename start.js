const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;


const token = process.env.TOKEN;
const botID = process.env.BOT_ID;
const url = "https://api.groupme.com/v3/bots/";
const groupID = process.env.GROUP_ID;
let admin = process.env.ADMIN_ID;
let richard = process.env.RICHARD;


app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.post("/", (req, res) => {
    postText = "";
    const toSearchFor = "@giphy ";
    const index = req.body.text.toLowerCase().indexOf(toSearchFor);
    
    //If we found the string we're looknig for, and they're not richard, get results and send them
    if (index != -1 && req.body.user_id !== richard) {
        //Get the string we are searching for.
        const toSearch = req.body.text.substring(index + toSearchFor.length);
        
        //Get the total, encoded URL we're going to pass to Giphy to search
        const giphyurl = `http://api.giphy.com/v1/gifs/search?limit=1&q=${encodeURIComponent(toSearch)}&api_key=dc6zaTOxFJmzC`;
        
        request.get(giphyurl, (error, response, body) => {
            if (error || !JSON.parse(body)["data"][0]) {
                sendMessage(botID, "Nothing found :(");
            } else if (body) {
                const res = JSON.parse(body)["data"][0].images.original.url;
                console.log(`${toSearch}=>${res}`);
                sendMessage(botID, res);
            }
        });
    }
    //If the user is the admin
    if (req.body.user_id === `${admin}`) {
        const commandText = req.body.text.split("=");
        //If they had an '=' in their message, it must be a command
        if (commandText.length > 1) {
            //If the text before = is 'richard', reassign richard to what comes after the '='
            if (commandText[0] === "richard")
                richard = commandText[1];
        }
    }
    //If the user is richard, just make the text "No, Richard."
    if (req.body.user_id === richard)
        postText = "No, Richard.";
    //If we have any text to send, send it.
    if (postText)
        sendMessage(botID, postText);
    res.end();
});

function sendMessage(botID, text) {
    const toSend = `${url}post?bot_id=${botID}&text=${encodeURIComponenent(text)}`;
    request.post(toSend, (error, response, body) => {
        if (error) {
            console.log(error);
        }
    });
}