var express = require('express');
var router = express.Router();
var fs = require('fs')
var cheerio = require('cheerio')
var fx = require('mkdir-recursive');
url = require('url');
//var addPage = require('./site').addPage;
const path = require('path')
const dateformat = require('dateformat');
var mappings = require("./mappings");
var axios = require("axios");
//var CONVERT_STYLE_TO_CLASS_OBJECT = require('../public/js/extensions2')


var baseUrl = "http://localhost:3001/transform/json?service=";

console.log(`Home dir is ${__dirname}`);

var injestLogic = fs.readFileSync(path.join(__dirname,"../public","js","ingest.js")).toString();

var cssText = fs.readFileSync(path.join(__dirname,"../public","js","cssText.js")).toString();

try {


	eval(cssText)

	eval(injestLogic)

}catch(err){
	console.log(`proxy.js Error reading injest.js file.. all alias backend population will not populate.`)
}


/* GET home page. */
router.post('/', async function(req, res, next) {



		
	console.log("Entering Revisions");

	var api = req.query.service;

	$ = cheerio.load(req.body.alias);

	var transformations = req.body.transformations;



	console.log(`Client sent body ${JSON.stringify(req.body)}`)

	console.log(`Calling Url ${baseUrl}${api}`)


	axios.post(`${baseUrl}${api}`,{json:req.body.json})
	.then((payload)=>{
		//console.log(`Data is ${JSON.stringify(data)}`)
		console.log("TODAY")
		console.log(payload.data)

		//var clean = CONVERT_STYLE_TO_CLASS_OBJECT(payload.data.BGM)

		var alias = $("[alias]").first();

		console.log(`Found HTML alias as ${alias.attr("alias")} and data is ${JSON.stringify(payload.data[`${alias.attr("alias")}`])}`)
		

		var skinny = true;

		INGEST_populateObject(payload.data[`${alias.attr("alias")}`][0], alias,skinny)

		var empty  = $("<div>")

		empty.append(alias);

		res.send({html:empty.html()});
	}).catch((err)=>{
		console.log(err)
		//res.sendStatus(err.status);
		res.send(err);

	})

	
	
});







module.exports = router;

