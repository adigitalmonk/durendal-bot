registerCommand('syn', {
    'src' : 'src/commands/syn.js',
    'limit' : 20
});

registerCommand('role', {
    'src' : 'src/commands/role.js',
    'rate-limit' : 1
});

registerCommands({
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
    'roll' : {
        'src' : 'src/commands/roll.js'
    },
    'showpermissions' : {
        'src' : 'src/commands/showpermissions.js',
        'limit' : 20
    }
});

module.exports = true;
