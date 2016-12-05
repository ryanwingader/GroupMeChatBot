# GroupMe Giphy Bot
Add a Giphy bot to your groupme chats!
This setup requires some prior knowledge of using Github and Heroku.

## Installation
* Prerequisites - You should have:
 * A Github account
 * A Heroku account
 * A Groupme account

1. Fork the repository.
2. Create a new Heroku app, using the repository you just forked.
3. Go to https://dev.groupme.com/session/new, login, and then go to https://dev.groupme.com/bots.
4. Create a new bot
  * Select the group that you want to add the bot to.
  * Name the bot whatever you like. It doesn't need to be called 'Giphy'.
  * Use https://[your_heroku_app_name].herokuapps.com/ as the 'callback url'
  * Add a link to a picture for your bots avatar, if you'd like.
  * Submit!
5. Go to your Heroku app's settings, and 'reveal config vars'
  * Add the key 'BOT_ID' with the corresponding value found from your bot you created at https://dev.groupme.com/bots.
  * Add the key 'GROUP_ID' with the corresponding value found from your bot you created at https://dev.groupme.com/bots.
6. Go to 'Deploy' in your Heroku app, scroll to the bottom, and hit 'Deploy Branch'
7. You're done!

## Using the bot
All you need to do to use the bot is type '@giphy' or '@Giphy' anywhere in a message, and the bot will post the first Giphy link that it finds from what you type after your '@giphy'.

For example, if a user types: "Hey, @Giphy it's lit", then the bot will search giphy for "it's lit". At the time of writing this Readme, the bot will post the link "https://media.giphy.com/media/26ufcQNzm5YwuNxja/giphy.gif".

It's that simple!
