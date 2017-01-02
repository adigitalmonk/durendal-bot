registerCommand('syn', {
    'src' : 'src/commands/syn.js'
});

registerCommands({
    'shutdown' : {
        'src' : 'src/commands/shutdown.js'
    },
    'grantpermission' : {
        'src' : 'src/commands/grantpermission.js'
    },
    'revokepermission' : {
        'src' : 'src/commands/revokepermission.js'
    },
    'roll' : {
        'src' : 'src/commands/roll.js'
    },
    'showpermissions' : {
        'src' : 'src/commands/showpermissions.js'
    }
});

module.exports = true;
