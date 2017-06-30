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


var configFile = "rewrites.json";

/*
*  Return rewrites for this site in raw (JSON) string NOT JSON Object from config file
*/
function getRewrites(site){

	rewrites = "[]";

	var dir = path.join(process.env.SITEDIR,site, configFile);

	console.log("Rewrites Lookup Dir is  " + dir);

	if(fs.existsSync(dir)){

		try {

			rewrites = fs.readFileSync(dir);
			console.log("Read " +rewrites)

		}catch(e){
			console.log("Error reading rewrites file for " + site);
			console.log(e);
		}

	} else {
		console.log("No rewrites file for site " + site)

	}
	console.log("Returning " +rewrites)
	return rewrites;
}

/* GET home page. */
router.get('/', function(req, res, next) {


	var returnAsString = ""
	
	console.log("Entering Rewrites");

	console.log("x-site-name" + req.get('x-site-name'))

	var rewriteJSONStr = getRewrites(req.get('x-site-name'))

	var rewriteRecs = null;

	try {

		rewriteRecs = JSON.parse(rewriteJSONStr)
		console.log(rewriteRecs)

	}catch(e){
		res.sendStatus(404);
		res.end("Rewrites config file for site " + req.get('x-site-name') + " is corrupt");
		console.log(e);
	}

	
	if(req.query.asPlainText && req.query.asPlainText == "true"){
		
		rewriteRecs.forEach(function(line){
			returnAsString += line.from + "," + line.to + "\n";
		})
		res.set('Content-type',"text/plain");
		res.end(returnAsString);
	} else{
		res.set('Content-type','application/json');
		res.end(rewriteJSONStr)
	}
	
});


/* GET home page. */
router.post('/', function(req, res, next) {

		
	console.log("Entering Revisions");

	console.log("Site Dir is " + process.env.SITEDIR)

	console.log("x-site-name" + req.get('x-site-name'))

	console.log("x-current-page-name" + req.get('x-current-page-name'))

//console.log("Path is " + url.parse(req.url).pathname)

	var file = req.get('x-current-page-name');

	file += file.endsWith("/") ? "index.html" : "";

	computedFile = file.lastIndexOf(".") != -1 ? file.substring(0,file.lastIndexOf(".")) : file;
	
	var dir = path.join(process.env.SITEDIR,req.get('x-site-name'), computedFile+ "-revisions");

	console.log("Computed Revision dir is " + dir);

	console.log("Revision body is ")

	console.log(req.body)

	writeRevision(dir,req.body,req.get('x-current-date'),function(ok,err){

		if(err){
			res.sendStatus(404)
			console.log(err);
		}else {
			res.sendStatus(200);
		}
	});
	
	
});






/*
* If dynamic page. Find base template and render.  Else next();
*/
function SEOUrlFilter(req,res,next){

	str = url.parse(req.url).pathname;

	console.log(str)

	console.log("Lookie " + req.query.xcurrentdate)
	//console.log("Mappings ");
	//console.log(mappings)
	
	myUrl = "not-found";

	var site = str.substring(1);

	site = site.substring(0,site.indexOf("/"))
	
		mappingsAsStr = getRewrites(site)
		
		mappings = JSON.parse(mappingsAsStr);

		console.log("Number Mappings for hostname " + site + " is " + mappings.length)




	for(x=0;x < mappings.length; x++){
	//mappings.forEach((map, idx) => {

		map = mappings[x];

		str = url.parse(req.url).pathname;
       
       console.log("Testing " + map.from + " against " + str)

       	var regex = new RegExp(map.from,"g") 

       	m = regex.exec(str);

       	console.log("Mapping for file " + str  +" is  " + m)

		if(m != null && m.length > 0 && req.url.indexOf("edit-body.html") == -1 ){

			for(i=1;i< m.length; i++){

				console.log("Testing " + m[i])

				re = new RegExp("\\$"+i,"g")

				console.log("Regex is now " + re)

				map.to = map.to.replace(re,m[i]);
			}

			//req.params["x-current-page-name"] = m[1]+".html";
			//req.params["x-dynamic-lookup"] = m[2];
			res.set("x-orig-page",str);
			console.log("Overwrote req params")
			console.log(req.params)
			myUrl = map.to;
			req.url = req.url.replace(m[0],map.to)
			console.log(req.url)
			break;
		} 

    }	
	next();
}





module.exports = router;
module.exports.SEOUrlFilter = SEOUrlFilter;
