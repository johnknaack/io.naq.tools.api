#!/usr/bin/node

"use strict";

require("colors");
const FS = require("fs");
const PATH = require("path");
const cpExec = require("./cpexec.js");
const Async = require("async");

const COMMAND = `[ -d ./.git ] && git status`;

// Remove all lines that are not file names
const filesOnly = (log) => {
    let lines = log.split("\n");
    let removeLinesWith = [
        "On branch",
        "Your branch is up-to-date with",
        "Changes not staged for commit:",
        "(use \"git add/rm",
        "(use \"git checkout",
        "Untracked files:",
        "(use \"git add",
        "no changes added to commit",
        "nothing to commit, working directory clean",
        "nothing to commit, working tree clea",

        // TODO Need to make this status show
        "Your branch is ahead of",
        "(use \"git push"
    ];
    return lines.filter((line) => {
        return !removeLinesWith.some((part) => {
            return !!~line.indexOf(part);
        }) && line !== "";
    });
};

const getStatus = (files) => {
    let status = "Bad Status  ";
    const blank = files.length === 0;
    const onlyMinFiles = !files.some((file) => !~file.indexOf("min.js")); // The change list only has min.js files with changes.

     blank &&                                       (status = "No Changes      ".green );
    !blank && !onlyMinFiles && files.length >= 1 && (status = "Has Self Changes".red   );
    !blank &&  onlyMinFiles && files.length >= 1 && (status = "Has Dep Changes ".blue  );

    return status;
};

const colorRepo = (repoName) => {
    let coloredRepoName = void(0);
    !!~repoName.indexOf("com.ree.nhs.thor") && (coloredRepoName = repoName.blue.underline);
    !!~repoName.indexOf("com.ree.reesearch") && (coloredRepoName = repoName.magenta.underline);
    !!~repoName.indexOf("com.ree.master") && (coloredRepoName = repoName.yellow.underline);
    return coloredRepoName || repoName.green.underline;
};

const repoNames= FS.readdirSync("../");
Async.eachSeries(repoNames, (repoName, callback) => {
    const shouldRun = repoName.indexOf("com.ree") !== -1;
    shouldRun && cpExec(`( cd ../${ repoName } ; ${ COMMAND } )`, function (error, log) {
        const files = filesOnly(log);
        const status = getStatus(files);
        console.log(`[ ${ status } ] ${ colorRepo(repoName) }`);
        log && process.argv.length > 2 && console.log(files.join("\n"));
        error && console.error(error);
        callback();
    });
    !shouldRun && callback();
}, (error) => {
    error && console.error(error);
});
