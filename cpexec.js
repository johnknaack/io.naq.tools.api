"use strict";

const cp = require("child_process");

module.exports = function (command, callback) {
    var error = void 0;
    var log = '';

    var proc = cp.exec(command, {
        cwd: process.cwd()
    });

    proc.stdout.setEncoding("utf8");

    proc.stdout.on("data", function (data) {
        log += data;//.replace(/\n$/g, '');
    });

    proc.stderr.on("data", function (data) {
        error = data;//.replace(/\n$/g, '');
    });

    proc.on("exit", function () {
        callback(error, log);
    });
};
