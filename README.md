# README
## Requirements
* NodeJS `>= 7.0.0`
* NPM `>=4.0.0` 

(This is just based on my set up, this should work with NodeJS `>=6.0.0`)

___
## Getting Started
### Modules
In the root of the project, do this:
```
> npm install
```
This will the required node modules.

### Config
Set up your `config.json` file

```
> cd conf
> cp config.example.json config.json
```
The config file has multiple settings, including but not limited to:
- Bot's Secret key
- Rooms that the bot is allowed use
- Command prefix

You'll need to get the Bot's secret key from the Application/Bot's page on
[the Discord Developer portal](http://discordapp.com/developers/applications/me/) 

### Join bot to a server
You'll probably want to join your bot to a server, as it isn't very useful if it's not connected anywhere.

You can do this by going to this link:
- [https://discordapp.com/oauth2/authorize?client_id=XXXXXXX&scope=bot](https://discordapp.com/oauth2/authorize?client_id=XXXXXXX&scope=bot)

But you're going to want to update the client ID to be the ID of your bot (which you can also get from the developer portal).

### Run It!
Once you are ready, do this:
```
> node main 
```
And hopefully nothing breaks.

---
## Links
- [Discord Developer Portal](http://discordapp.com/developers/applications/me/) 
- [Discord Bot Connection](https://discordapp.com/oauth2/authorize?client_id=XXXXXXX&scope=bot)
