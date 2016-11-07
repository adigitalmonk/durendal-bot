// Had trouble with the bootstrap object when trying this
// didn't investigate, but declaring inline worked
const permissions = require('./permissions');

module.exports = {
    'Syn' : function(params, channel) {
        channel.sendMessage("Ack!");
    },
    'call' : function(params, channel) {
        channel.sendMessage(params[0]);
    },
    'restart' : function() {
        require('./bootstrap').emit('restart');
    },
    'shutdown' : function() {
        require('./bootstrap').emit('stop');
    }
};
