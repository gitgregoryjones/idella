var express = require('express');
var router = express.Router();
var fs = require('fs')
var cheerio = require('cheerio')
var fx = require('mkdir-recursive');
url = require('url');
const path = require('path')

//var $ = require('jquery')

/* GET home page. */
router.post('/', function(req, res, next) {

		
	console.log(" I am in revisions " + req.headers['content-type']);

	console.log("Home Dir is " + process.env.HOMEDIR)

	console.log("Site name is " + req.body.name)
	
	var dir =process.env.HOMEDIR + '/public/' + req.body.name  + req.body.currentPage.name + ".revisions";

	console.log("dir is " + dir);

	write(dir,req.body.currentPage,req.body.currentRevision);
	
	res.sendStatus(200);
});


function write(revisionDirectory,currentPage, currentRevision){

	console.log("Revision Directory is " + revisionDirectory)

	fx.mkdir(revisionDirectory,function(err){

		if(err){
			console.log("Mkdir Error is ")
			console.log(err)
			return false;
		} 
		$ = cheerio.load('<body>\n' + currentRevision.html.trim() + '\n</body');

		$('head').append($('<style class="generated">').append(currentRevision.css))
		fs.readFile(process.env.HOMEDIR + "/public/index.html",function(err,template){

	 		if(err){
	 			console.log("ERROR")
	 			console.log(err)
	 			return false;
	 		}

	 		$ = cheerio.load(template);
	 		$('body').find('.dropped-object').remove();

	 		$('head').append($('<style class="generated">').append(currentRevision.css))
	 		$('body').append(currentRevision.html);
	 		//Delete Controls
	 		$('body').find('#misc-controls').remove();
	 		$('body').find("[role=dialog]").remove()
	 		$('body').find('ul.custom-menu').remove();
			$('body').find('.responsive-design-tab').remove();



			for(i=0; i < currentRevision.bps.length; i++){
					//$('body').append($('<style>',{class:"generated"}).append(currentRevision.css))
					console.log(currentRevision.bps[i])
			}

			d = new Date(currentRevision.date);


			fs.writeFileSync(revisionDirectory+ "/"+d.getMonth()+""+d.getDate()+""+d.getFullYear()+d.getHours()+""+d.getMinutes(),$.html())


			return true;
		});

	});
}

function getCorrectRevision(fpath,dateGMTString,callback){

	ok = true;
		
	today = new Date(dateGMTString)

	todayAsNumber = parseFloat(today.getMonth()+""+today.getDate()+""+today.getFullYear()+today.getHours()+""+today.getMinutes())

	console.log("Today " + today.toString() + " as number " + todayAsNumber )

	console.log("Today " + today.toString() + " as number " + todayAsNumber )

	console.log("Fpath is " + fpath)

	fs.readdir(fpath,function(err,list){

		console.log("List is  " + list )

		if(err){
			console.log("Error. Could not retrieve revision")
			callback(!ok,"");
		}

		//list.sort().reverse();

		fileName = "";

		//console.log("List is  " + list )

		for(i=0; i < list.length; i++){
			fileName = list[i];
			console.log("comparing todayAsNumber > list[i] : " + todayAsNumber + " > " + parseFloat(list[i]))
			if(todayAsNumber >= parseFloat(list[i])){

				break;
			} 
		}
		
		callback(ok,fileName);	

	});

	

	
}

function getRevision(req,res,next){

	var file = url.parse(req.url).pathname;

	file += file.endsWith("/") ? "index.html" : "";

	console.log("THE PATH IS " + url.parse(req.url).pathname)		
	if(!file.endsWith(".html") && !file.endsWith(".htm")) {

		next();
		
	} else {

		filepart = file.substring(file.lastIndexOf("/")+1)
		
		//filepart =filepart.substring(0,filepart.lastIndexOf("."));

		console.log("File part is " + filepart)
		
		var revDir = path.join(process.env.HOMEDIR ,"public",file + ".revisions");
		console.log("Looking for " + revDir)
		//if revisions?
		if(fs.existsSync(revDir)){
			
			 	console.log("File Found " + revDir);
			 	
			 	getCorrectRevision(revDir,new Date(),function(ok,revision){

			 		console.log("Got revision " + revision)
			 		if(!ok){
			 			console.log("Unable to retrieve revision")
				 		console.log(err)
				 		next();
			 		}

			 		fs.readFile(path.join(revDir,revision.toString()),function(err,contents){
				 		if(err){
				 			console.log("ERROR")
				 			console.log(err)
				 			next();
				 		} else {
				 		//$ = cheerio.load(contents);
				 		//$('body').remove();
				 		res.set('Content-Type','text/html')
				 		res.end(contents);
				 		}
			 		})
			 	});

			 	
					
		} else {
			console.log("revision " + filepart + " not found...continuing");
			next();
		}
	}

}


module.exports = router;
module.exports.getRevision = getRevision;
