//console.log(require("dotenv").config());
//require('dotenv').config({ path:
//"C:\Users\jian\Documents\GitHub\Projects\Community fridge using mongoDB\COMP2406_A4_jackson\.env.test" })
require("dotenv").config({silent: true});
const DBNAME = process.env.DBNAME;
const CONNECTIONURL = process.env.CONNECTIONURL;



console.log(DBNAME);
console.log(CONNECTIONURL);
