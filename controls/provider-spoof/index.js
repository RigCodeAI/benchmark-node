"use strict";

const { MongoClient } = require("mongodb");
new MongoClient().db("benchmark").collection("records").find({ owner: process.argv[2] });
