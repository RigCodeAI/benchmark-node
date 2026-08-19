"use strict";

const path = require("node:path");
const selected = process.env.BENCHMARK_NODE_INSTALLER_MODULE;
if (selected) require(path.resolve(selected));
