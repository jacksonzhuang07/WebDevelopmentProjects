// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
app.use(express.json()); // body-parser middleware
let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");
const { json, redirect } = require('express/lib/response');

const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "can_accept_items": {
        "type": "number"
      },
      "accepted_types": {
        "type": "array",
        "items": [
          {
            "type": "string"
          },
          {
            "type": "string"
          }
        ]
      },
      "contact_person": {
        "type": "string"
      },
      "contact_phone": {
        "type": "string"
      },
      "address": {
        "type": "object",
        "properties": {
          "street": {
            "type": "string"
          },
          "postal_code": {
            "type": "string"
          },
          "city": {
            "type": "string"
          },
          "province": {
            "type": "string"
          }
        },
        "required": [
          "street",
          "postal_code",
          "city",
          "province"
        ]
      }
    },
    "required": [
      "name",
      "can_accept_items",
      "accepted_types",
      "contact_person",
      "contact_phone",
      "address"
    ]
  };

// Get /fridges and return the all of the fridges based on requested format
router.get('/', (req,res)=> {
    res.format({
		'text/html': ()=> {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname,'public','view_pickup.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
		'application/json': ()=> {
			Fridge.find({}, function (err, result){
				res.set('Content-Type', 'application/json');
           	    res.json(result);
			});

        },
        'default' : ()=> {
            res.status(406).send('Not acceptable');
        }
    })
});
// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page
router.get("/types", function(req, res, next){
	let types = [];
  Object.entries(req.app.locals.items).forEach(([key, value]) => {
    if(!types.includes(value["type"])){
      types.push(value["type"]);
    }
  });
	res.status(200).set("Content-Type", "application/json").json(types);
});

// Middleware function: this function validates the contents of the request body associated with adding a new fridge into the application. At the minimimum, it currently validates that all the required fields for a new fridge are provided.
function validateFridgeBody(req,res,next){
    let properties = ['name','canAcceptItems','acceptedTypes','contact_person','contact_phone','address'];

    for(property of properties){
      // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
        if (!req.body.hasOwnProperty(property)){
            return res.status(400).send("Bad request");
        }
    }
    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}

function validateUpdateBody(req,res,next){
    let properties = ['name','canAcceptItems','acceptedTypes','contactInfo','numItemsAccepted','address','items'];

	for (const [key, value] of Object.entries(req.body)) {
		if (!properties.includes(key)){return res.status(400).send("Bad request");}
	  }

    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}
// Middleware function: this validates the contents of request body, verifies item data
function validateItemBody(req,res,next){
    let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}
// Adds a new fridge, returns newly created fridge
router.post('/', jsonParser,(req,res)=> {
	//console.log(req.body.validate());
	let contentType = req.headers['content-type'];
	if (contentType!="application/json"){return res.status(400).send("Bad request header not json");}
	//console.log(contentType);
    let p = new Fridge(req.body);

	//console.log(req.body);
	/*p.validate(function(err) {
		if (err)
			{console.log(err);
			res.status(400).send("Bad request header")}
		else
			console.log('pass validate');
	});*/
	//console.log(p.validate());
	//p.validate();
	p.save(
		function(err, result){
		if(err){
			console.log("Error saving product:");
			console.log(err.message);
			return res.status(400).send("Bad request");

		}
		else{
		console.log("Saved p:");
		console.log(result);
		res.status(200).send.json(results);}
	});

});

// Get /fridges/{fridgeID}. Returns the data associated with the requested fridge.
router.get("/:fridgeId", function(req, res, next){

	Fridge.find({id: req.params.fridgeId },function(err, results){
		if(err){console.log(err);}
		else{
			if(results.length<1){return res.status(404).send("missing");}
		else{console.log(results);
		res.status(200).send(results);}
	}
	});
});

// Updates a fridge and returns the data associated.
// Should probably also validate the item data if any is sent, oh well :)
router.put("/:fridgeId",[jsonParser], (req, res) =>{
	/*var Validator = require('jsonschema').Validator;
    var v = new Validator();
    let validity=v.validate(req.body, schema).valid;
	console.log(validity);*/

	//console.log(req.body);\
    //it checks when field is correct and value is wrong but not when field is incorrect
	let properties = ['name','canAcceptItems','acceptedTypes','contactInfo','numItemsAccepted','address','items'];

	for (const [key, value] of Object.entries(req.body)) {
		if (!properties.includes(key)){return res.status(400).send("Bad request");}
	  }

	let p={};
    Fridge.findOne({ id: req.params.fridgeId },(err, doc1) => {
		if (err){
			console.log(err);
			return res.status(400).send("incompatible update");
		}
		if (doc1){
			//console.log(req.body);
			let doc=doc1.toJSON();
			for (const [key, value] of Object.entries(req.body)) {
					doc[key]=value;
					console.log(doc);
				}
			p = new Fridge(doc);
			console.log(p);
			p.validate(function(err) {
				if (err)
					{console.log(err);
					return res.status(400).send("Bad request body");}
				else
					{console.log('pass validate'+doc1);
					Fridge.findOneAndUpdate({ id: req.params.fridgeId }, req.body, {runValidators: true, context: 'query' ,new: true},(err, doc) => {
						if (err)
						{res.status(400).send("incompatible update");
						console.log(err);}


						if (doc)	{
							console.log("updatE"+doc);
							console.log('pass validate');
							res.status(200).send();}

							else{res.status(400).send();}
					});

				}

			});
		}
		else{return res.status(404).send("fridge not found");}
		});
});

// Adds an item to specified fridge
router.post("/:fridgeId/items", /*validateItemBody,*/ (req,res)=>{
	let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }

	Fridge.findOne({id:req.params.fridgeId},(err, doc)=>  {
		//console.log(doc);
		if (err){
			console.log(err);}

		else{
				for(const add of doc.items){
				console.log(parseInt(add.id)+" "+req.body.id);
				if(add.id==req.body.id){return res.status(409).send("already present");}
				}

				 Fridge.updateMany({id:req.params.fridgeId},{$addToSet:{"items":req.body}},{runValidators: true, context: 'query' ,new: true},(err, doc)=> {
					if (err){
						return res.status(400).send("incompatible update");
						console.log(err);}

					else
						{
						console.log(doc);
						console.log('pass validate');
						return res.status(200).send();}


				});
			}
	});

});

// Deletes an item from specified fridge
router.delete("/:fridgeId/items/:itemId", (req,res)=>{
	console.log(req.params);
	Fridge.findOne({id:req.params.fridgeId},(err, doc)=>  {
		if (err){
			console.log(err);
			return res.status(404).send("incompatible update");
		}

		if(doc){
			console.log(doc.items);
			for( var i = 0; i < doc.items.length; i++){
				if(doc.items[i].id==req.params.itemId){
					console.log(doc.items[i]+" "+req.params.itemId);
					doc.items.splice(i, 1);
					doc.save();
					return res.status(200).send("success");
				}

			}
			return res.status(404).send("incompatible update");
		}

		else{
			res.status(404).send("fridge not found");


		}
	});

})

router.delete("/:fridgeId/items", (req,res)=>{
	console.log(req.query);
	if (Object.keys(req.query).length<1){
		Fridge.findOneAndUpdate({ id: req.params.fridgeId }, {items:[]}, {runValidators: true, context: 'query' ,new: true},(err, doc) => {
			if (err)
			{res.status(404).send("incompatible update");
			return console.log(err);}
			if(doc)
				{
				console.log(doc);
				console.log('items emptied');
				return res.status(200).send();}
			else
				{res.status(404).send("incompatible update");}
		});
	}

	// Remove specific items from fridge
	else{
			Fridge.findOne({id:req.params.fridgeId},(err, doc)=>  {
			if (err){
				console.log(err);
				return res.status(404).send("incompatible update");
			}
			if (doc){
				let ids={};
				ids.$in=[];
				for (const [key, value] of Object.entries(req.query)) {
					for(let ido of value){
							let doc1=doc.toJSON();
							let contains=doc1["items"].find(object => {
								console.log(ido+ object["id"]);
								return object["id"] === ido;
							  });
							if (contains===undefined){return res.status(404).send("not found");}
					ids.$in.push(parseInt(ido));
				  }}
				  let update ={};
				  update={"$pull": {"items":{"id":ids}}};
			  Fridge.updateOne(
					{id:req.params.fridgeId},
					update,{new: true},(err, doc) => {
						if (err){
							console.log(err);
							return res.status(404).send("incompatible update");

						}
						if(doc){console.log(doc+"updated");
							return res.status(200).send("updated");}
						else{
							return res.status(404).send("incompatible update");
						}
					});
			}
			else{res.status(404).send("fridge not found");}
		});
	}
})

router.put("/:fridgeID/items/:itemID",(req, res) =>{
	console.log("put item request");
	let contentType = req.headers['content-type'];
	if (contentType!="application/json"){return res.status(400).send("Bad request header not json");}

	Fridge.findOne({id:req.params.fridgeID},(err, doc)=>  {
		//console.log(doc);
		if (err){
			console.log(err);
			res.status(404).send("incompatible update");
		}

		else if (doc){
			console.log(doc["items"]);

			for (let item of doc["items"]){
				console.log(item);
				if  (item.id==req.params.itemID){
					console.log(req.body);
					item.quantity=req.body.quantity;
					console.log(doc);
					doc.save((err, doc)=>  {
						if (err){
							console.log(err);
							return res.status(400).send("incompatible update");
						}
						else if (doc){return res.status(200).send(item);}



					});
					return;

				}
			}
			res.status(404).send("incompatible update item id not found");


		}
		else{res.status(404).send("incompatible update fridge id not found");};
	});

});

router.post("/items",(req, res) =>{

	let contentType = req.headers['content-type'];
	if (contentType!="application/json"){
		return res.status(400).send("Bad request header not json");}
	let test= new Item(req.body);
	test.validate(function(err) {
		if (err)
			{console.log(err);
			return res.status(400).send("Bad request body");}
	});
	console.log(test);
	Item.find({}, function (err, result){
		console.log(result);
		if (result){
			let id=[]
			for (let item of result){
				id.push(item.id);
				id.push(item.quantity);
			}
			if (id.includes(test.id)||id.includes(test.name)){
				return res.status(409).send("duplicate entry");
			}
			else{Item.create(test);
				console.log(result);
				return res.status(200).send("added");}
		}
	});
});

router.get("/search/items",(req, res) =>{
	const input={
		"type": "object",
		"properties": {
		  "type": {
			"type": "string"
		  },
		  "name": {
			"type": "string"
		  }
		},
		"required": [
		  "type",
		  "name"
		],
		"additionalProperties": false
	  };
	  var Validator = require('jsonschema').Validator;
	  var v = new Validator();
	  let validity=v.validate(req.query, input).valid;
    req.query["type"]=req.query["type"].toLowerCase();
    req.query["name"]=req.query["name"].toLowerCase(); // makes the search case insensitive
	if (validity==false){return res.status(400).send("wrong query format");}
  //let name =new RegExp(req.query.type }

	Type.findOne({name: new RegExp(req.query.type, 'i')},function(err, results){

		if (results){
		console.log("results"+results);


		console.log(req.query.type);
		req.query.name=new RegExp(req.query.name, 'i');
		Item.find({name: req.query.name,type:results.id},function(err, results1){
			if(results1.length>0){
        console.log("item was found:"+results1);
				return res.status(200).send(results1);
			}
			else{
        console.log("item not found");
        return res.status(404).send("item not found");}





			});

	}

		else {console.log("type not found");
    return res.status(404).send("type not found");}


	});


	});

module.exports = router;
