"use strict";

class Collection { find(value) { return value; } }
class Database { collection() { return new Collection(); } }
class MongoClient { db() { return new Database(); } }
module.exports = { Collection, MongoClient };
