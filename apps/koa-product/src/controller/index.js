"use strict";

const { registerAccessRoutes } = require("./access");
const { registerConcurrencyRoutes } = require("./concurrency");
const { registerServiceRoutes } = require("./service");
const { registerWorkflowRoutes } = require("./workflow");

function registerControllerRoutes(router) {
  registerAccessRoutes(router);
  registerWorkflowRoutes(router);
  registerConcurrencyRoutes(router);
  registerServiceRoutes(router);
}

module.exports = { registerControllerRoutes };
