registerCommand('syn', {
    'src' : 'src/commands/syn.js',
    'limit' : 20
});

registerCommands({
    'config' : {
        'src' : 'src/commands/config.js'
    },
    'shutdown' : {
        'src' : 'src/commands/shutdown.js'
    },
    'grantpermission' : {
        'src' : 'src/commands/grantpermission.js',
        'limit' : 20
    },
    'revokepermission' : {
        'src' : 'src/commands/revokepermission.js',
        'limit' : 20
    },
    'showpermissions' : {
        'src' : 'src/commands/showpermissions.js',
        'limit' : 20
    }
});

module.exports = true;
