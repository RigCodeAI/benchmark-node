"use strict";

const fs = require("node:fs");
const path = require("node:path");
fs.writeFileSync(path.join(__dirname, "LIFECYCLE_SCRIPT_EXECUTED"), "unsafe installer executed\n");
