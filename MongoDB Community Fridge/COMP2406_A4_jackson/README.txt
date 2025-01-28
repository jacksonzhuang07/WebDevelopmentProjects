code by JACKSON ZHUANG
Student Number 100997755


Run server using command : node server.js

Uses mongoDB html, javascript, and css to create an interactive 
community fridge platform which 
can add/ remove/ parse through fridge contents in various locations

uses json schema and validation with css/html/javascript front end 


server.js
initializes mongodb
creates cloud data based on local JSON if remote is empty
if remote represent parses to command line for viewing

config.js
Contains credentials to access mongodb
set up with dotenv so credentials are not exposed 

fridge-router.js
parses any request beginning with /fridges postman style restful inputs to their respective functions
uses get, put, delete requests to add new items, find items, sort and delete items


