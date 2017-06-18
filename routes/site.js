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
				res.sendStatus(200)
				/*addPage(req.body.name,req.params.pagename,function(ok,err){

					res.sendStatus(200);
				})*/
				
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


	var fullPath = path.join(process.env.HOMEDIR ,'/public/',site,page);

	var fullPathDirectory = fullPath.substring(0,fullPath.lastIndexOf("/"));

	fx.mkdir(fullPathDirectory, function(err){

		if(err){
			callback(false,err);
		}

		writeDefaultSiteContents(site,page,function(ok,err){

		var revDir = path.join(process.env.HOMEDIR ,'/public/',site,page+".revisions");

		if(ok){

			if(!fs.existsSync(revDir)){

				console.log("File exists is " + fs.existsSync(revDir))

				console.log("AddPage:Creating revision directory " + revDir);

				fx.mkdir(revDir,function(err){
					console.log("AddPage:Revision dir err value should be null. It is  "+err);
					if(err){
						callback(!ok,err);
					}else {
						callback(ok);
					}
				})

			} else {
				callback(ok)
			}

		}else {
			console.log("Error writing writeDefaultSiteContents ")
			console.log(err)
			callback(ok,err);
		}

		});

	})

	


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
		if(site != "default"){
			//$('body').append(img);
		}
		$('title').html(site);

		$("<script id='pstate'>var pageState = {}</script>").insertBefore($('head'))


		var createDir = path.join(process.env.HOMEDIR,'/public/',site);

		console.log("Making page " + createDir + " pagename = " + pagename)


		if(!fs.exists(path.join(createDir,pagename))){

			fs.writeFile(path.join(createDir,pagename),$.html(),function(err){
				console.log("Wrote File " + " ok is " + err)
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

	

	var createDir = path.join(process.env.HOMEDIR,'/public/',body["name"]);

	fx.mkdirSync(createDir);


	addPage(body["name"],"index.html",function(ok,err){

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

