"use strict";

const Repositories = require("./repositories.js");

process.on("message", (params, body) => {
    const Requests = {
        repositories: () => Repositories(void(0), (repositories) => process.send({ repositories: repositories }))
    };

    const badRequest = !params || !params.request || !Requests[ params.request ];
     badRequest && process.send({ error: "params are not valid" });
    !badRequest && Requests[params.request]();
});
