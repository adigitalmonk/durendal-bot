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
Set up your `config.js` file

```
> cp config.example.js config.js
```
Currently, only the DiscordAPI Secret Token is stored in the config.
You'll need to get that from your Bot's page on
[the Discord Developer portal](http://discordapp.com/developers/applications/me/) 

### Run It!
Once you are ready, do this:
```
> node main 
```
And hopefully nothing breaks.
