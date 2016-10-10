#!/usr/bin/node

"use strict";

require("colors");
const FS = require("fs");
const PATH = require("path");
const cpExec = require("./cpexec.js");
const Async = require("async");

const COMMAND = `[ -f ./package.json ] && npm i`;

const repoNames= FS.readdirSync("../");
Async.eachSeries(repoNames, (repoName, callback) => {
    const shouldRun = repoName.indexOf("com.ree") !== -1;
    shouldRun && console.log(repoName);

    shouldRun && cpExec(`( cd ../${ repoName } ; ${ COMMAND } )`, function (error, log) {
        log && console.log(log);
        error && console.error(error);
        callback();
    });
    !shouldRun && callback();
}, (error) => {
    error && console.error(error);
});

// Examples

// Delete all node_modules directories
// [ -d ./node_modules ] && sudo rm -r ./node_modules

// Run `npm i` on all that have package.json
// [ -f ./package.json ] && npm i

// Run `./self.js` on all that have ./self.js
// [ -f ./self.js ] && ./self.js
