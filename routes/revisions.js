var express = require('express');
var router = express.Router();
var fs = require('fs')
var cheerio = require('cheerio')
var fx = require('mkdir-recursive');
url = require('url');
var addPage = require('./site').addPage;
const path = require('path')
const dateformat = require('dateformat');
//var $ = require('jquery')

/* GET home page. */
router.post('/', function(req, res, next) {

		
	console.log(" I am in revisions " + req.headers['content-type']);

	console.log("Home Dir is " + process.env.HOMEDIR)

	console.log("Site name is " + req.get('x-site-name'))

	console.log("Site name is " + req.get('x-current-page-name'))

	//console.log("Path is " + url.parse(req.url).pathname)

	var file = req.get('x-current-page-name');

	//remove /context from path if found
	//file = file.replace("/"+req.get('x-site-name'),"");

	file += file.endsWith("/") ? "index.html" : "";
	
	var dir =path.join(process.env.HOMEDIR,'/public/',req.get('x-site-name'), req.get('x-current-page-name')+ ".revisions");

	console.log("dir is " + dir);

	write(dir,req.body.currentPage,req.body.currentRevision,function(ok,err){

		if(err){
			res.sendStatus(404)
			console.log(err);
		}else {
			res.sendStatus(200);
		}
	});
	
	
});


function write(revisionDirectory,currentPage, currentRevision,callback){

	ok = true;

	console.log("Revision Directory is " + revisionDirectory)

	fx.mkdir(revisionDirectory,function(err){

		if(err){
			console.log("Mkdir Error is ")
			console.log(err)
			callback(!ok,err);
		} 
		$ = cheerio.load('<body>\n' + currentRevision.html.trim() + '\n</body');

		$('head').append($('<style class="generated">').append(currentRevision.css))
		fs.readFile(process.env.HOMEDIR + "/public/index.html",function(err,template){

	 		if(err){
	 			console.log("ERROR")
	 			console.log(err)
	 			callback(!ok,err);
	 		}

	 		$ = cheerio.load(template);
	 		$('body').find('.dropped-object').remove();

	 		$('head').append($('<style class="generated">').append(currentRevision.css))
	 		$('body').append(currentRevision.html);
	 		$('title').html(currentRevision.siteName)
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


			fname = dateformat(d, 'mmddyyyyhhMM');

			fname = path.join(revisionDirectory,fname)
			console.log("Revision file is " + fname);

			fs.writeFile(fname,$.html(),function(err){

				if(err){
					callback(!ok,err);
				} else {

					//Do Revision Anchors
					for(i=0; i < currentRevision.anchors.length; i++){
						addPage(currentRevision.siteName,currentRevision.anchors[i],function(ok,err){
							if(!ok){
								console.log(err)
								callback(!ok,err);
							}
						})
					}

					callback(ok);
				}
			})

		});

	});
}

function getCorrectRevision(fpath,dateGMTString,callback){

	ok = true;
		
	today = new Date(dateGMTString)

	//todayAsNumber = parseFloat(today.getMonth()+""+today.getDate()+""+today.getFullYear()+today.getHours()+""+today.getMinutes())
	//todayAsNumber = parseFloat(dateformat(today, 'mmddyyyyhhMM'));
	todayAsNumber = (dateformat(today, 'mmddyyyyhhMM'));

	console.log("Today " + today.toString() + " as number " + todayAsNumber )

	//console.log("Today " + today.toString() + " as number " + todayAsNumber )

	console.log("Fpath is " + fpath)

	fs.readdir(fpath,function(err,list){

		//console.log("List is  " + list )

		/*
		list = list.map(function(item){
			return parseFloat(item);
		})*/

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

/*
* If dynamic page. Find base template and render.  Else next();
*/
function SEOUrlFilter(req,res,next){


	mappings = [{from:"\\/(\\w+)\/+((?:\\w+)(?:-?\\w+)+).html",to:"/games.html?seriesname=$2"}];


	myUrl = "not-found";

	mappings.forEach((map, idx) => {

		str = url.parse(req.url).pathname;
       
       console.log("Testing " + map.from + " against " + str)

       	var regex = new RegExp(map.from,"g") 

       	m = regex.exec(str);


       	console.log("M is " + m)


		if(m != null && m.length > 1 && req.url.indexOf("edit-body.html") == -1){

			for(i=1;i< m.length; i++){

				console.log("Testing " + m[i])

				re = new RegExp("\\$"+i,"g")

				console.log("Regex is now " + re)

				map.to = map.to.replace(re,m[i]);
			}

			//req.params["x-current-page-name"] = m[1]+".html";
			//req.params["x-dynamic-lookup"] = m[2];

			console.log("Overwrote req params")
			console.log(req.params)
			myUrl = map.to;
			req.url = req.url.replace(m[0],map.to)
			console.log(req.url)
		} 

    })

	console.log(" New Path is " + myUrl)
	
	next();
/*
	mappings.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);

    });

	var regex = /(\w+)\/+((?:\w+)(?:-?\w+)+).html/g;
	var str = `/people/games/car-boat-sails.html`;
	let m;

	if((m = regex.exec(str)) != null){

		req.params["x-current-page-name"] = m[1]+".html";
		req.params["x-dynamic-lookup"] = m[2];

		console.log("Overwrote req params")
		console.log(req.params)
	} 

	next();

*/
}



function getRevision(req,res,next){

	var file = url.parse(req.url).pathname;

	//file = path.join(req.get('x-site-name'),req.get('x-current-page-name'))

	//remove /context from path if found
	file = file.replace("/"+req.get('x-site-name'),"");

	file += file.endsWith("/") ? "index.html" : "";

	console.log("THE PATH IS " + file)		
	if(!file.endsWith(".html") && !file.endsWith(".htm")) {

		next();
		
	} else {

		//filepart = file.substring(file.lastIndexOf("/")+1)
		
		//filepart =filepart.substring(0,filepart.lastIndexOf("."));

		//console.log("File part is " + filepart)
		
		var revDir = path.join(process.env.HOMEDIR ,"public",file + ".revisions");
		console.log("Looking for " + revDir)
		//if revisions?
		if(fs.existsSync(revDir)){
			
			 	console.log("File Found " + revDir);
			 	
			 	getCorrectRevision(revDir,new Date(),function(ok,revision){

			 		console.log("Got revision " + revision)



			 		if(!ok ){
			 			console.log("Unable to retrieve revision")
				 		console.log(err)
				 		next();
			 		} else if(revision.length == 0){

			 			next();
			 		} else {

				 		fs.readFile(path.join(revDir,revision.toString()),function(err,contents){
					 		if(err){
					 			console.log("ERROR")
					 			console.log(err)
					 			next();
					 		} else {
					 		$ = cheerio.load(contents);
					 		$('title').html(req.get('x-site-name'));
					 		//$('body').remove();
					 		res.set('Content-Type','text/html')
					 		res.end($.html());
					 		}
				 		})
			 		}
			 	});

			 	
					
		} else {
			console.log("revision " + file + " not found...continuing");
			next();
		}
	}

}


module.exports = router;
module.exports.getRevision = getRevision;
module.exports.SEOUrlFilter = SEOUrlFilter;
