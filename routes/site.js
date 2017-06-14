var express = require('express');
var router = express.Router();
var fs = require('fs')
var fx = require('mkdir-recursive');
var cheerio = require('cheerio')
var link = require('fs-symlink')
var link = require('fs-symlink')
const path = require('path')
var  url = require('url');
//var $ = require('jquery')

/* Create direectory and home page. */
router.get('/lookup/:sitename', function(req, res, next) {

		
	if(siteExist(process.env.HOMEDIR + '/public/' + req.params.sitename)){
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

/* Create direectory and home page. */
router.get('/all', function(req, res, next) {

	dirs = getDirectories(process.env.HOMEDIR + '/public/')

	dirList = []

	for(i=0;i<dirs.length; i++){

		dirList.push({name:dirs[i],files:[]})

	}

	dirsList = dirList.filter(function(directory){
		console.log("Testing ["+directory.name + "]")
		directory.files = (getFiles(process.env.HOMEDIR + "/public/"+directory.name));
	 	return directory.name != "js" && directory.name != "css" && directory.name != "napkin" 
	 		&& directory.name != "images";
	})
 

	res.send(JSON.stringify(dirsList));
});

/* Create direectory and home page. */
router.post('/page/:pagename', function(req, res, next) {
		
	if(siteExist(process.env.HOMEDIR + '/public/' + req.body.name)){
			addPage(req.body.name,req.params.pagename,function(ok,err){

					res.sendStatus(200);
				})
		
	} else {

		createSite(req.body,function(ok){
			if(ok){
				addPage(req.body.name,req.params.pagename,function(ok,err){

					res.sendStatus(200);
				})
				
			} else {
				res.sendStatus(404);
			}
		})
	}
});


/* Create direectory and home page. */
router.post('/', function(req, res, next) {

		
	console.log(req.headers['content-type']);
	
	console.log(req.body);

	createSite(req.body,function(ok){
		if(ok){
			res.sendStatus(200);
		} else {
			res.sendStatus(404);
		}
	})
	
});


function addPage(site,page,callback){


	writeDefaultSiteContents(site,page,callback);


}



function siteExist(directoryAndName){

	return fs.existsSync(directoryAndName);
}

function writeDefaultSiteContents(site,pagename,callback){

	var ok = true;

	fs.readFile(process.env.HOMEDIR +'/public/index.html', 'utf8', function(err, template){

		if(err){
			console.log(err)
			callback(!ok,err);
		}
		
		console.log("Template is " + template)

		$ = cheerio.load(template);
		$('head').find('title').text(site);
		$('body').html($('body').html().trim())
		

		//$('body').append(req.body.currentRevision.html)
		$('body').find('ul.custom-menu').remove();
		$('body').find('.responsive-design-tab').remove();

		img = $('<div class="squarepeg dropped-object" id="begin" type="IMG" style="background-image:url(http://www.britishsarcomagroup.org.uk/wp-content/uploads/2016/09/new-website.jpg)"></div>')

		//http://www.britishsarcomagroup.org.uk/wp-content/uploads/2016/09/new-website.jpg
		$('body').append(img);

		var createDir = process.env.HOMEDIR + '/public/' + site;

		console.log("Making page " + createDir)

		if(!fs.exists(createDir+ "/"+pagename)){

			fs.writeFile(createDir+ "/"+pagename,$.html(),function(err){
				console.log("Wrote File " + " ok is " + ok)
				if(err){
					callback(!ok,err);
				} else {
			
					callback(ok);
				}
			})
		} else {
			callback(ok);
		}

		console.log($.html())

	})


}

function createSite(body,callback){

	

	var createDir = process.env.HOMEDIR + '/public/' + body["name"];

	fx.mkdirSync(createDir);

	writeDefaultSiteContents(body["name"],"index.html",function(ok,err){

		console.log("Linking " + createDir+'js' + " to " + __dirname + '/../public/js' + " ok is " + ok)

		link(process.env.HOMEDIR +'/public/js', createDir+'/js', 'junction')
			.then(function () {})
		link(process.env.HOMEDIR +'/public/css',  createDir+ '/css', 'junction')
			.then(function () {})
		link(process.env.HOMEDIR + '/public/napkin', createDir+'/napkin', 'junction')
			.then(function () {})
		link(process.env.HOMEDIR + '/public/settings.html', createDir + '/settings.html', 'junction')
			.then(function () {})
		link(process.env.HOMEDIR + '/public/edit-body.html', createDir+'/edit-body.html', 'junction')
			.then(function () {})



		callback(ok);
	});

	
}

module.exports = router;

