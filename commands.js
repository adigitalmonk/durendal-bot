module.exports = {
    'Syn' : function(params, channel) {
        channel.sendMessage("Ack!");
    },
    'call' : function(params, channel) {
        channel.sendMessage(params[0]);
    }
};
