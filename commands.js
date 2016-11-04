module.exports = {
    'Syn' : function(channel, params) {
        channel.sendMessage("Ack!");
    },
    'call' : function(channel, params) {
        channel.sendMessage(params[0]);
    }
};
