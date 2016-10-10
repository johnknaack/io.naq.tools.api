#!/usr/bin/node

"use strict";

require("colors");
const FS = require("fs");
const PATH = require("path");

const filename = process.argv[2];

const repoNames= FS.readdirSync("../");
repoNames.forEach((repoName) => {
    const hasFile = FS.existsSync(PATH.join("../", repoName, filename));
    hasFile  && console.log("YES: ", repoName.green );
    !hasFile && console.log("NO:  ", repoName.red   );
});
