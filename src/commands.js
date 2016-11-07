module.exports = {
    'Syn' : function(params, channel) {
        channel.sendMessage("Ack!");
    },
    'call' : function(params, channel) {
        channel.sendMessage(params[0]);
    },
    'restart' : function() {
        let bootstrap = require('./bootstrap');
        bootstrap.emit('restart');
    },
    'shutdown' : function() {
        let bootstrap = require('./bootstrap');
        bootstrap.emit('stop');
    }
};
