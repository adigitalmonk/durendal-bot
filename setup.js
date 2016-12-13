require('./global.js');

const prompt = require('prompt');
const Settings = grab('src/configuration.js');

let finish = function(msg) {
    console.log("> " + msg);
    process.exit();
}

// Check if the file exists, ask if we want to create it?
try {
    Settings.load(true); // force a bypass load
} catch (e) {
    if (e instanceof SyntaxError) {
        console.log(`
!! It looks like something is wrong with your config file.
!! We don't want to destroy it so we'll stop here.
!! Please double check the syntax in your file!
`);
        finish("Quitting...");
    }

    console.log("Couldn't find the config file so we're generating a blank one!");
    Settings.create();
}

console.log("We're only going to set up the needed params for this script.");

prompt.message = '->';

prompt.start();


// Based on E,
// Prompt user for the input to send as keys over to the configuration manager
let props = {'properties' : { }};
let count = 0;
Settings.options().forEach(function(option) {
    if (Settings.getSetting(option) === undefined) {
        props.properties[option] = Settings.getSchema(option);
        count++;
    }
});

if (count < 1) {
    finish('Nothing to do! All defined settings configured.');
}

prompt.get(props, function(err, result) {
    for (let opt in result) {
        Settings.setSetting(opt, result[opt]);
    }

    Settings.save();
    finish("Saved! Set " + count + " options!");
});
