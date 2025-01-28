let config = {};
config.db = {};

require("dotenv").config({silent: true});
//loads private env credentials to process.env via dont env
//to allow login without exposing credentials
config.db.host = process.env.CONNECTIONURL;
config.db.name = process.env.DBNAME;

module.exports = config;
