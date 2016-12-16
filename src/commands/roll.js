const Command = grab('src/command.js');
const Dice = require('node-dice-js');

class roll extends Command {
    constructor(msg) {
        super(msg);
    }

    logic() {
        // Only attempt to roll if we have at least one argument and it isn't "help"
        if(this.args.length!==0 && this.args[0].toLowerCase()!=='help'){
            let dice = new Dice();
            Logger.send(this.channel,dice.execute(this.args.join("")).text);
        } else {
            return Logger.send(this.channel,this.usage());
        }
    }

    usage() {
        return this.commandName+' (AdX(kY)-LxCM)xR\n'+
        '\tA - the number of dice to be rolled (default: 1)\n'+
        '\td - separator that stands for die or dice\n'+
        '\tX - the number of face of each die\n'+
        '\t(kY) - number of dice to keep from roll (optional)\n'+
        '\t-L - take the lowest dice from all the rolls (optional)\n'+
        '\t-H - take the highest dice from all the rolls (optional)\n'+
        '\tC - the multiplier, must be a natural number (optional, default: 1)\n'+
        '\tB - the modifier, must be an integer (optional, default: 0)\n'+
        '\tR - the number of times to repeat the entire command (optional, default: 1)\n';
    }
}

module.exports = roll;
