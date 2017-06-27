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
var files = ["jquery.js","URI.js","jquery-ui-1.12.1.custom/jquery-ui.css","font-awesome-4.7.0/css/font-awesome.min.css","preview.js","gzip.js","revisions.js","overlay.js","ghost.js","plugins.js","custom_events2.js","notes.js","drawSpace.js","translate.js","ingest.js","contextmenu.js","slider4.js","cssText.js","persist.js","extensions2.js","stylesTabs2.js","stylesAutoComplete.js","save.js","saveJs.js","enableTextAreaTabs.js","saveBreakpoints.js","jquery-ui-1.12.1.custom/jquery-ui.min.js","idella.css","logic2.js"]
var version = 1;
//var $ = require('jquery')
function writeRevision(revisionDirectory,currentRevision,revDate,callback){

	ok = true;

	console.log("Revision Directory is " + revisionDirectory)

	$ = cheerio.load(currentRevision.html.trim());
	$('body').find('#misc-controls').remove();
	$('body').find("[role=dialog]").remove()
	$('body').find('ul.custom-menu').remove();
	$('body').find('.responsive-design-tab').remove();

	try {

		revDate = new Date(revDate)
		console.log("Date is converted revision [" + revDate.toString() + "]")
		if(revDate == "Invalid Date"){
			revDate = new Date();
		}
	}catch(except){
		console.log("Exception was " + except);
		console.log("Converting to today " + new Date())
		revDate = new Date();
	}

	fname = dateformat(revDate, 'mmddyyyyhhMM');

	fname = path.join(revisionDirectory,fname)

	fs.writeFile(fname,$.html(),function(err){

		if(err){
			callback(!ok,err);
		} else {

			//Do Revision Anchors
			for(i=0; currentRevision.anchors && i < currentRevision.anchors.length; i++){
				require('./site').addPage(currentRevision.siteName,currentRevision.anchors[i],function(ok,err){
					if(!ok){
						console.log(err)
						//callback(!ok,err);
					}
				})
			}

			callback(ok);
		}
	})
	
}


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




function getRevisionFileName(fpath,dateGMTString,callback){

	ok = true;
		
	today = new Date(dateGMTString)

	//todayAsNumber = parseFloat(today.getMonth()+""+today.getDate()+""+today.getFullYear()+today.getHours()+""+today.getMinutes())
	//todayAsNumber = parseFloat(dateformat(today, 'mmddyyyyhhMM'));
	todayAsNumber = (dateformat(today, 'mmddyyyyhhMM'));

	console.log("Today " + today.toString() + " as number " + todayAsNumber )

	//console.log("Today " + today.toString() + " as number " + todayAsNumber )

	console.log("Fpath is " + fpath)

	fs.readdir(fpath,function(err,list){

		list = list.sort()

		//list = list.reverse();

		console.log("List is  " + list )

		if(err){
			console.log("Error. Could not retrieve revision")
			callback(!ok,"");
		}

		list.reverse();

		fileName = "";

		//console.log("List is  " + list )

		for(i=0; i < list.length; i++){
			fileName = list[i];
			console.log("comparing todayAsNumber > list[i] : " + todayAsNumber + " > " + (list[i]))
			if(todayAsNumber >= parseFloat(list[i])){
			//if(todayAsNumber >= list[i]){

				break;
			} 
		}
		
		callback(ok,fileName);	

	});

	

	
}




function getRevision(req,res,next){

	console.log("Dooyah")

	revDate = req.query.xcurrentdate

	console.log("Revison Date is " + revDate + " if null. will default to new Date()");

	try {

		revDate = new Date(revDate).toString();
		console.log("Date is converted revision [" + revDate + "]")
		if(revDate == "Invalid Date"){
			revDate = new Date();
		}
	}catch(except){
		console.log("Exception was " + except);
		console.log(new Date())
		revDate = new Date().toString();
	}

	console.log("New Revison Date is " + revDate);
	
	var file = url.parse(req.url).pathname;

	file += file.endsWith("/") ? "index.html" : ""

	
	if(!file.endsWith(".html") && !file.endsWith(".htm")) {

		next();
		
	} else if(file.endsWith("edit-body.html") || file.endsWith("settings.html")){ 

		next();

	}else {

	console.log("SEO Friendly name was passed is " + res.get("x-orig-site"))

	if(file.startsWith("/")){

		file = file.substring(1);
	}


	computedSite = file.substring(0,file.indexOf("/"));

	computedFile = file.replace(computedSite,"");

	//strip extension from page name and later concat -revisons to help find directory where revisions kept
	computedFile = computedFile.lastIndexOf(".") != -1 ? computedFile.substring(0,computedFile.lastIndexOf(".")) : computedFile;

	var site = res.get('x-site-name') != undefined ? res.get('x-site-name') : computedSite;

	console.log("THE PATH IS [" + site + "] and computedFile is " + computedFile)

	if(site.length == 0){
		console.log("User needs default revision")
		revDir =process.env.HOMEDIR;
		var template = "template.html";
		console.log("Default Revision dir is " + revDir + " and template is " + template);
		//Show the default workspace html
		getRevisionFileContents("default",new Date().toString(),revDir,template,req.url,function(ok,htmlOrError){
			if(!ok){
				res.sendStatus(404);
				console.log(htmlOrError);
			} else {
				res.setHeader('Content-type','text/html');
				res.set('x-site-name',site)
				res.end(htmlOrError);
				
			}
		});

	} else {

			console.log("req.url.query is ")
			console.log(url.parse(req.url).query)

			res.set('x-query',url.parse(req.url).query);

				

			var revDir = path.join(process.env.SITEDIR,site,computedFile + "-revisions");

			if(res.get("x-orig-page") && fs.existsSync(path.join(process.env.SITEDIR,site,res.get("x-orig-page") + "-revisions"))){
				revDir = path.join(process.env.SITEDIR,site,res.get("x-orig-page") + "-revisions")
				console.log("Really Looking for " + revDir)
			}

			console.log("Looking for " + revDir)
			//if revisions?
			if(fs.existsSync(revDir)){
								 	
				 	getRevisionFileName(revDir,revDate,function(ok,revision){

				 		console.log("Got revision " + revision)

				 		parseU = url.parse(req.url);

				 		parseU.params = {};

				 		if(!ok ){
				 			console.log("Unable to retrieve revision for " + revDir)
					 		console.log(err)
					 		res.sendStatus(404);
							

				 		} else {
				 			getRevisionFileContents(site,revDate,revDir,revision,req.url,function(ok, htmlOrError){
				 				if(!ok){
				 					res.sendStatus(404);
				 					console.log(htmlOrError);
				 				} else {
				 					res.setHeader('Content-type','text/html');
				 					res.set('x-site-name',site)
				 					res.end(htmlOrError);
				 					
				 				}
				 			})
				 		}
				 	});					
			} else {
				console.log("Revison directory not found at --> " + revDir)
				res.sendStatus(404);
				
			}

		}
	}

}

function loadFiles($){

	var total = files.length;

	var ok = true;

	$("head").find('style').not(".generated").remove();
	$("head").find('script').not(".generated").remove();

	files.forEach(function(file){

  		///file = file.endsWith(".css") ? "/css/" + file : file;
  		//file = file.endsWith(".js") ? "/js/" + file : file;

  		var ext = ".js";
  		var selectAttrValue = null;
  		var selectorTag = null;
  		var selectAttrName = null;
  		var srcLocation = null;
  		var linkRel = null;
  		var async = null;
  		var tag = null;
  		if(file.endsWith(".js")){
  			ext = ".js";
  			selectAttrValue = "[src='/js/"+file +"']";
  			selectorTag = "<script>";
  			selectAttrName = "src";
  			srcLocation = "/js/" + file;
  			async = "false";

  		} else {
  			ext = ".css";
  			selectAttrValue = "[href='/css/"+file +"']";
  			selectorTag = "<link>";
  			selectAttrName = "href";
  			srcLocation = "/css/" + file;
  			linkRel = "stylesheet";
  		}


  		if(file.endsWith(ext)){

  			$('head').find(selectAttrValue).remove();

	  		tag = $(selectorTag);
	  		tag.attr(selectAttrName,srcLocation);
	  		
	  		if(linkRel != null){
	  			tag.attr("rel",linkRel)
	  		}
	  		tag.attr("version",version);
	  		//console.log("Wrote file")
	  		tag.appendTo($('head'));
	  		
  		} 
  	})

	if($("style.generated").length == 0){
		
		$("head").append("<style class='generated'></style>");
	}

	if($("script.generated").length == 0){
		
		$("head").append("<script class='generated'></script>");
	}

	//make sure these are always last
	$("style.generated").appendTo($('head'))
	$("script.generated").appendTo($('head'))

	

}


function getRevisionFileContents(site,dateGMTString,revDir,revisionFileName,originalUrl,callback){
	ok = true;

	var simplePageName = revDir.replace(path.join(process.env.SITEDIR,site,"/"),"").replace("-revisions",".html")

	if(site == "default"){
		simplePageName = "index.html"
	}

//Now that we have correct revision file location, read and send to front end
	fs.readFile(path.join(revDir,revisionFileName.toString()),function(err,contents){
		if(err){
			console.log("ERROR")
			console.log(err)
			callback(!ok,err);
		} else {
		$ = cheerio.load(contents);




		parseU = url.parse(originalUrl);
		parseU.pageName = simplePageName;
		params = {}

		$('html').attr('x-site-name',site)
		$('html').attr('x-current-date',dateGMTString)
		$('html').attr('x-current-page-name',simplePageName);

		q = (url.parse(originalUrl).query)

		if(q){
			console.log("Q is ")
			console.log(q);
			qArr = q.split("?")
			console.log(qArr)

			qArr.forEach(function(qStr){
				console.log("Splitting " + qStr)
				args= qStr.split("&");
				args.forEach(function(arg){
					argV = arg.split("=")
					params[argV[0]] = argV[1];
	 			})	
			})
			parseU.params = params;
		}

		loadFiles($)

		console.log("Length of scripts is " + $('head').find('script').length);

		$("<script id='pstate'>var pageState = "+JSON.stringify(parseU)  + "</script>").insertBefore($('head'))
		
		callback(ok,$.html())

		}
	})
}


module.exports = router;
module.exports.getRevision = getRevision;
module.exports.writeRevision = writeRevision;
module.exports.getRevisionFileContents = getRevisionFileContents;

