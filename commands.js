module.exports = {
    'kill' : function() {
        process.exit(10);
    },
    'Syn' : function(params, channel) {
        channel.sendMessage("Ack!");
    },
    'call' : function(params, channel) {
        channel.sendMessage(params[0]);
    }
};
