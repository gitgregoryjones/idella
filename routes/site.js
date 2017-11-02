var express = require('express');
var router = express.Router();
var fs = require('fs')
var fx = require('mkdir-recursive');
var cheerio = require('cheerio')
var link = require('fs-symlink')
var link = require('fs-symlink')
const path = require('path')
var  url = require('url');
var writeRevision = require("./revisions").writeRevision;
var getRevisionFileContents = require("./revisions").getRevisionFileContents;
//var $ = require('jquery')

/* Create direectory and home page. */
router.get('/lookup/:sitename', function(req, res, next) {

		
	if(siteExist(path.join(process.env.SITEDIR,req.params.sitename))){
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});

function getDirectories (srcpath) {
	  return fs.readdirSync(srcpath)
	    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

function getFiles (srcpath) {
	  return fs.readdirSync(srcpath)
	    .filter(file => fs.lstatSync(path.join(srcpath, file)).isFile())
}

function getAllSitePageNames(startingDir){

	var dirs = getDirectories(startingDir)

	console.log("getAllSitePageNames Reading Dirs is " + dirs);

	var dirList = []

	for(i=0;i<dirs.length; i++){

		dirList.push({name:dirs[i],files:[]})

	}

	dirsList = dirList.filter(function(directory){
		console.log("Testing ["+directory.name + "]")
		console.log("Looking for files in directory " + startingDir)
		directory.files = (getDirectories(path.join(startingDir,directory.name)));

		clean = [];
		directory.files.forEach(function(f){
			if(f.endsWith("-revisions")){
				clean.push(f.substring(0,f.indexOf("-revisions"))+".html");
			}
		})
		directory.files = clean;
		return true;

	})

	return dirsList;
}

/* Create direectory and home page. */
router.get('/all', function(req, res, next) {

	var theFiles = getAllSitePageNames(process.env.SITEDIR)

	res.send(JSON.stringify(theFiles));
});

/* Create direectory and home page. */
router.post('/page/:pagename', function(req, res, next) {


	createSite(req.get("x-site-name"),function(ok){
			if(ok){
				res.sendStatus(200)
				/*addPage(req.body.name,req.params.pagename,function(ok,err){

					res.sendStatus(200);
				})*/
				
			} else {
				res.sendStatus(404);
			}
	})

});


/* Create direectory and home page. */
router.post('/', function(req, res, next) {
	
	console.log(req.headers['content-type']);
	
	console.log(" Site Log " + req.get('x-site-name'));

	createSite(req.get('x-site-name'),function(ok){
		if(ok){
			res.sendStatus(200);
			res.end();
		} else {
			res.sendStatus(404);
			res.end();
		}
	})
	
});


function addPage(site,page,callback){



	var ok = true;

	if(page.startsWith("http:") || page.startsWith("https:")){
		console.log("User linking to external page.  Nothing to do.")
		callback(ok)
	}

	console.log("Attempting to create a new page ["+page + "] for site ["+site+"]")

	var fullPath = path.join(process.env.SITEDIR,site,page);

	var revisionDir = page.lastIndexOf(".") != -1 ? page.substring(0,page.lastIndexOf(".")) : page;

	var dirPath = path.join(process.env.SITEDIR,site,revisionDir+ "-revisions");

	if(!fs.existsSync(dirPath)){

		fx.mkdir(dirPath, function(err){

			if(err){
				console.log("Encoutered Error " + err)
				callback(false,err);
			}

			console.log("Error from mkdir is " + err)

			writeDefaultSiteContents(site,page,dirPath,function(ok,err){

					console.log("Back from writing contents " + ok)
					console.log(err)

					callback(ok,err);

			});

		})
	} else {
		callback(ok)
	}

	


}



function siteExist(directoryAndName){

	return fs.existsSync(directoryAndName);
}

function writeDefaultSiteContents(site,page,revisionDir,callback){

	var ok = true;

	currentTimePlus5Seconds = new Date();

	currentTimePlus5Seconds.setTime(currentTimePlus5Seconds.getSeconds() + 5);


	getRevisionFileContents(site,new Date().toString(),process.env.HOMEDIR,"template2.html","/",function(ok,contents){
		var version = {html:contents,css:"",currentPage:page, date:new Date().toString(),bps:[]}
		writeRevision(revisionDir,version,currentTimePlus5Seconds.toString(),callback,site);
	});

	//writeRevision(revisionDir,version,new Date().toString(),callback);

}

function createSite(name,callback){


	console.log("Site Dir is " + process.env.SITEDIR);	

	console.log("Name is " + name)

	var createDir = path.join(process.env.SITEDIR,name);

	console.log("Creating new site at location " + createDir)

	fx.mkdirSync(createDir);


	addPage(name,"index.html",function(ok,err){

		console.log("Linking " + createDir+'js' + " to " + __dirname + '/../public/js' + " ok is " + ok)

		link(path.join(process.env.HOMEDIR,'/public/js'), path.join(createDir,'/js'), 'junction')
			.then(function () {})
		link(path.join(process.env.HOMEDIR,'/public/css'),  path.join(createDir,'/css'), 'junction')
			.then(function () {})
		link(path.join(process.env.HOMEDIR,'/public/napkin'), path.join(createDir,'/napkin'), 'junction')
			.then(function () {})
		link(path.join(process.env.HOMEDIR,'/public/settings.html'), path.join(createDir,'/settings.html'), 'junction')
			.then(function () {})
		link(path.join(process.env.HOMEDIR,'/public/edit-body.html'), path.join(createDir,'/edit-body.html'), 'junction')
			.then(function () {})

		callback(ok);
	});

	
}

module.exports = router;
module.exports.addPage = addPage;
module.exports.getAllSitePageNames = getAllSitePageNames;

