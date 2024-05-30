"use strict";

const { PORT } = process.env;
const app = require("./app");

app.listen(PORT, () => {
    console.log(`Started on http://localhost:${PORT}`);
});

