var express = require('express');
var router = express.Router();
var fs = require('fs')
const path = require('path')
var cheerio = require('cheerio')
var _extend = require('../trigger-catch-event')._extend;
var fx = require('mkdir-recursive');
url = require('url');
var getJSON = require('get-json')
var cacheManager = require('cache-manager');
//var latestDemoSiteNumber = require('./site').latestDemoSiteNumber
var persist = require('../public/js/persist');
var moment = require('moment');
var link = require('fs-symlink')
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 60 * 30/*seconds*/});
var http = require('http');
//var addPage = require('./site').addPage;

const dateformat = require('dateformat');
var mappings = require("./mappings");

var googleFonts = "https://fonts.googleapis.com/css?family=Dancing+Script|Roboto|Lato|Broadway|Open+Sans|Pacifico:n,b,i,bi|Lora:n,b,i,bi|Anton:n,b,i,bi|Basic:n,b,i,bi|Caudex:n,b,i,bi|Chelsea+Market:n,b,i,bi|Corben:n,b,i,bi|EB+Garamond:n,b,i,bi|Enriqueta:n,b,i,bi|Forum:n,b,i,bi|Fredericka+the+Great:n,b,i,bi|Jockey+One:n,b,i,bi|Josefin+Slab:n,b,i,bi|Jura:n,b,i,bi|Kelly+Slab:n,b,i,bi|Marck+Script:n,b,i,bi|Lobster:n,b,i,bi|Mr+De+Haviland:n,b,i,bi|Cinzel:n,b,i,bi|Niconne:n,b,i,bi|Noticia+Text:n,b,i,bi|Overlock:n,b,i,bi|Patrick+Hand:n,b,i,bi|Play:n,b,i,bi|Sarina:n,b,i,bi|Signika:n,b,i,bi|Spinnaker:n,b,i,bi|Monoton:n,b,i,bi|Sacramento:n,b,i,bi|Cookie:n,b,i,bi|Raleway:n,b,i,bi|Open+Sans+Condensed:300:n,b,i,bi|Amatic+SC:n,b,i,bi|Cinzel:n,b,i,bi|Sail:n,b,i,bi|Playfair+Display:n,b,i,bi|Libre+Franklin:n,b,i,bi|Libre+Baskerville:n,b,i,bi|&subset=latin-ext,cyrillic,japanese,korean,arabic,hebrew,latin&display=swap";
//var googleFonts = "nothing.js";

//var files = [googleFonts,"jquery-ui-1.12.1.custom/jquery-ui.css","fontawesome5.css","jquery.timepicker.css","idella.css","jquery.js","jonthornton-timepicker/jquery.timepicker.min.js","jonthornton-datepair/dist/datepair.min.js","jonthornton-datepair/dist/jquery.datepair.min.js","www.movies.com.js","URI.js","preview.js","gzip.js","revisions.js","overlay.js","ghost.js","plugins.js","custom_events2.js","notes.js","drawSpace.js","tinymce.js","translate.js","ingest.js","contextmenu.js","slider4.js","cssText.js","persist.js","extensions2.js","stylesTabs2.js","stylesAutoComplete.js","save.js","saveJs.js","enableTextAreaTabs.js","saveBreakpoints.js","jquery-ui-1.12.1.custom/jquery-ui.min.js","getEditableContent.js","slideIn.js","popup.js","controls.js","makeJavascriptBox.js",,"makePromptForInputBox.js","makeMsgBox.js","greybox.js","textArea.js","processLines.js","layers-menu.js","logic2.js"]
var files = [googleFonts,"https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap","jquery-ui-1.12.1.custom/jquery-ui.css","theme/vendor/fontawesome-free/css/all.min.css","theme/css/sb-admin-2.css","font-awesome-4.7.0/css/font-awesome.min.css","jquery.timepicker.css","idella.css","colors/green.css",	"theme/vendor/jquery/jquery.js","ready.js","component/ListComponent.js","component/Equalizer.js","component/TextComponent.js","component/CustomShape.js","component/Gallery.js","component/Card.js","carWithAudio.js","tool-color-picker/tool-color-picker.js","jonthornton-timepicker/jquery.timepicker.min.js","jonthornton-datepair/dist/datepair.min.js","jonthornton-datepair/dist/jquery.datepair.min.js","playground-43.js","URI.js","preview.js","gzip.js","revisions.js","overlay.js","ghost.js","plugins.js","custom_events2.js","notes.js","drawSpace.js","translate.js","ingest.js","contextmenu.js","slider5.js","cssText.js","persist.js","extensions2.js","stylesTabs2.js","stylesAutoComplete.js","save.js","saveJs.js","enableTextAreaTabs.js","saveBreakpoints.js","jquery-ui-1.12.1.custom/jquery-ui.min.js"
	,"getEditableContent.js","slideIn.js","popup.js","controls.js","makeJavascriptBox.js",
	,"makePromptForInputBox.js","makeMsgBox.js","greybox.js","textArea.js","processLines.js","layers-menu.js","logic2.js",
	/*"https://code.jquery.com/jquery-3.6.0.js","https://code.jquery.com/ui/1.13.2/jquery-ui.js","https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css","https://jqueryui.com/resources/demos/style.css"*/]
var version = 1;

var $ = null;


function latestDemoSiteNumber(siteDir){



	var dirExists = true;

	var number  = 0;

	

	do {

		++number;

		var realPath = path.join(process.env.SITEDIR,`${siteDir}-${number}`)

		console.log(`Does ${realPath} exist?`)
		dirExists = fs.existsSync(realPath);
		console.log(`${siteDir}-${number} exists = ${dirExists}`)

	} while(dirExists);

	return `${siteDir}-${number}`;
}

process.on('uncaughtException', function (err) {

	if($ != null && $.callback){
		console.log("jQuery is alive")
		$.numberRegistered = 0;
		
		var msg = "<ol><li>Encountered error executing javascript you entered in file " + $.dataPath + "<li>" + err.toString();
				msg += "<li>To find the source of the error go to your file [" + $.dataPath + "] and look for the line that would cause the error below:";
				msg += "<li><font color='red'>"+ err.toString() + "</font>";
				msg += "<li>Full Error stack is: " + err.stack + "</ol>";

		$("[alias=notification]").html(msg).css({"height":"200px","padding":"30px"});
		$("html").attr("was-error","true");

		$.callback(true,$.html())
		
	}
  	console.log("Caught an exception....continuing")
  	console.log(err);
})

function getStyleSheetForElement(elementStyleSheetId,Query,currentBreakPoint){

	var myCSSLookupKey = "\\." + elementStyleSheetId

	var theExp = new RegExp(myCSSLookupKey+'\\s+(\\{[^}]+\\})','im')

	var thescript = "";

	if(currentBreakPoint && currentBreakPoint > 0){
		thescript = Query("#pageStyles.max-width-"+currentBreakPoint)
	} else {
		thescript = Query("#pageStyles");
	}
	groups = thescript.html().match(theExp)

	if(groups && groups[1]){

		var obj = {};

		str = groups[1];

		str = str.substring(1);

		str = str.substring(0,str.length-1);

		lines = str.split("\n");

		lines.forEach(function(line){
			key = line.substring(0,line.indexOf(":")).trim();
			value = line.substring(line.indexOf(":")+1, line.lastIndexOf(";"));
			if(key.length > 0){
				obj[key] = value;
			}
		})

		return obj;

	} else {

		return {};
	}

}

/** DELETE THIS ONCE WE USE THE WRITE STYLE SHEET FROM CSSTEXT.js . THis is duplicate code
because of scope of JS.  Can fix but requires much refactoring **/
function writeStyleSheetForElement(styleObject,Query,documentWidth,currentBreakPoint){

	var myCSSLookupKey = "\\." + styleObject.id

	var theExp = new RegExp(myCSSLookupKey+'\\s+(\\{[^}]+\\})','im')

	var thescript = "";

	if(currentBreakPoint && currentBreakPoint > 0){
		thescript = Query("#pageStyles.max-width-"+currentBreakPoint)
	} else {
		thescript = Query("#pageStyles");
	}
	groups = thescript.html().match(theExp)

	var cssTextConstants = fs.readFileSync(path.join(process.env.HOMEDIR,"public","js","cssText.js")).toString();

	var extConstants = fs.readFileSync(path.join(process.env.HOMEDIR,"public","js","extensions2.js")).toString();

	var log = {}
	log.debug = console.log;

	//After evaluating this line, we can use any functions in that file
	eval(cssTextConstants)

	eval(extConstants)


	if(groups && groups[1]){

		//from the included file
		styleObject = computeDimensions(styleObject,Query,documentWidth)

		thescript.html(thescript.html().replace(theExp,styleObject.cssRule))

		console.log("Wrote rule and new background-image  as " + styleObject["background-image"])

		Query("#"+styleObject.id).attr("style","");
	} 

	return Query;

}

//var $ = require('jquery')
function writeRevision(revisionDirectory,currentRevision,revDate,siteName){


	 new Promise((resolve,reject)=>{

		ok = true;

		console.log("Revision Directory is " + revisionDirectory)
		
		console.log("passed Site Name is "+ siteName)

		if(siteName.trim() == ""){
			console.log(`Empty siteName passed...Defaulting to default site name [default]`)
			siteName = "default";
		}

		console.log(`Loading Cheerio Revision`)

		$ = cheerio.load(currentRevision.html.trim());
		$('body').find('#misc-controls,.css-js-menu').remove();
		$('body').find("[role=dialog]").remove()
		$('body').find('ul.custom-menu').remove();
		$('body').find('.responsive-design-tab').remove();
		$('body').find('#myp').remove();
		$('body').find('[type=anchor]').css('border','none')
		$("body").find('.ui-helper-hidden-accessible,.ui-autocomplete,#ghostery-purple-box').remove();
		$("body").find('#layer-menu').remove();
		$("body").find('.navbar-nav,#idella-search').remove();
		$("body").find(".toolhotspot,.ui-resizable-handle, .ui-resizable-e").remove();
		$("body").addClass("hover");

		console.log(`Loaded Cheerio Done`)

		$(".generated").each(function(it,scr){
			scr = $(scr);
			console.log("replacing some script "+it)
			scr.html(scr.html().replace(/\n{2,}/g,"\n"));
		})
		
		$('html').attr("BREAKPOINTS",JSON.stringify(currentRevision.BREAKPOINTS))

		//Get RevDate into a Date Object
		try {

			var formattedDate = dateformat(revDate,"mm-dd-yyyy HH:MM")

			revDate = new Date(formattedDate).toString()
			console.log("Date is converted revision [" + revDate + "]")
			if(revDate == "Invalid Date"){
				revDate = new Date();
			}

		}catch(except){
			console.log("Exception was " + except);
			console.log(new Date())
			revDate = new Date().toString();
		}



		//Convert the date Object into a suitable File Name
		

		fname = dateformat(revDate, 'mmddyyyyHHMM');

		fname = path.join(revisionDirectory,fname+".html")

		console.log("The siteName is " + siteName);

		console.log("The site is " + process.env.SITEDIR);

		var theImgPathDir = path.join(path.join(process.env.SITEDIR,siteName,"images"))

		var theAudioPathDir = path.join(path.join(process.env.SITEDIR,siteName,"sounds"))

		console.log("Writing images to " + theImgPathDir)

		console.log("Writing audio to " + theAudioPathDir)

		fx.mkdirSync(theImgPathDir);

		fx.mkdirSync(theAudioPathDir);

		var base64Img = require('base64-img');

		console.log(`I see this many images for conversoin ${$(".convertImage").length}`)

		$(".convertImage").each(function(it,div){

			div = $(div);

			obj = getStyleSheetForElement(div.attr("id"),$)

			if(obj["background-image"] == "none"){
				delete obj["background-image"];
			}

			if(obj["background-image"]){

				var raw = obj["background-image"].substring(obj["background-image"].indexOf("data"),obj["background-image"].lastIndexOf("\""));


				rawExtensionArray = obj["background-image"].split("/");

				var rawExtension = (rawExtensionArray[1].split(";"))[0].replace("jpeg","jpg");

				console.log("Raw extension is  " + rawExtension)
				console.log(`Bunch of raw bytes ${(raw.substr(raw.length-40,10))}`)

				//function hashTwo() {
				//Create a quick hash to use as file name and keep from writing the same image over and over again when dups are detected
				var hash = raw.substr(raw.length-40,10)
				//.concat(raw.substr(40,4)).concat(raw.substr(80,4)).concat(raw.substr(160,4))
				    hash = hash.replaceAll("/","G");
				//console.log(`First x number of bytes is ${raw.substr(2000,4)}`)
				console.log(`Writing hash as image name as ${hash}`);

				//var newName = obj.alias ? obj.alias +"-image" : obj.id + "-image";
				newName = hash;

				var filepath = null;

				if(raw.startsWith("data:")){
					try {
						console.log("Searching for old instance of " + path.join(theImgPathDir.trim(),newName +"."+rawExtension));
						if(!fs.existsSync(path.join(theImgPathDir.trim(),newName+"."+rawExtension))){
							filepath = base64Img.imgSync(raw, theImgPathDir.trim(), newName);
							console.log("Wrote image to " + filepath);

						} else {
							filepath = path.join(theImgPathDir.trim(),newName+"."+rawExtension);
							console.log("Skipping file write because image already exists in this project at path " + filepath);
						}
						
					}catch(e){
						console.log("Base64 error")
						console.log(e);
						div.removeClass("convertImage");
					}


					if(filepath){

						

						div.css("background-image","url("+ filepath.substring(filepath.indexOf("/images")+1) + ")");

						obj["background-image"] = div.css("background-image");

						//now set CSS file correctly

						$ = writeStyleSheetForElement(obj,$,currentRevision.documentWidth);

						div.removeClass("convertImage");
						
					}
				} else {
					$ = writeStyleSheetForElement(obj,$,currentRevision.documentWidth);
					div.removeClass("convertImage");
				}

				delete newName;
				delete hash;
			}
			

		})



		$(".convertAudio").each(function(it,div){

			div = $(div)

			console.log(`Looking at Audio element ${div.attr("src")}`)



			audio64 = div.attr("src");

			if(audio64){

				var raw = audio64.split(';base64,').pop()

				console.log("Audio 64 is " + raw.substring(0,30))

				console.log("Audio Raw is " + raw.substring(0,30))

				var newName = div.parent().alias ? div.parent().alias +"-sound" : div.parent().attr('id') + "-sound";

				console.log("New Name is " + newName)
				
				var filepath = path.join(theAudioPathDir,newName);

				console.log("New filepath is " + filepath);


				fs.writeFileSync(filepath, raw, {encoding: 'base64'});

				
				console.log("Wrote audio to " + filepath);

				div.attr("src",filepath.substring(filepath.indexOf("/sounds")+1));

				console.log(`div src is now ${div.attr("src")}`)

				$ = writeStyleSheetForElement(div,$,currentRevision.documentWidth);
				console.log(`Convert Audio Length is now ${$("audio").length}`)
				
				div.removeClass("convertAudio");	
				
			}
			

		})


		fs.writeFile(fname,$.html().replace(/><{a-Z}/g,"><br><"),function(err){

			if(err){
				return reject(err);
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

				return resolve(ok);
			}
		})

	})

}


router.post('/audio',(req,res,next)=>{

	console.log("GOT A POST")

	if(req.get('x-site-name') == undefined){

		res.error({error:`Invalid request. Please refer to documentation..Line 328 /audio`})
	}

	var audio64 = req.body.raw;

	if(!audio64.startsWith("data:audio")){

		res.error({error:`User sent an invalid audio type`});

	} else {

		console.log("Entering Audio Save");

		console.log("Site Dir is " + process.env.SITEDIR)

		console.log("x-site-name" + req.get('x-site-name'))

		var theAudioPathDir = path.join(process.env.SITEDIR,req.get('x-site-name'),"sounds");

		fs.mkdirSync(theAudioPathDir, {recursive:true});

		theAudioPathDir = path.join(theAudioPathDir,req.body.filename);

		console.log("Computed Audio Revision dir is " + theAudioPathDir);

		var raw = audio64.split(';base64,').pop()

		console.log("Audio Raw is " + raw.substring(0,30))

		console.log(raw);

		console.log(fs.writeFileSync(theAudioPathDir, raw, {encoding: 'base64'}));

		res.send({sound:theAudioPathDir.substring(theAudioPathDir.indexOf("/sounds")+1)});

	}

	

});

/* GET home page. */
router.post('/', async function(req, res, next) {

		
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

	
	console.log("site name is still " + req.body.siteName)

	var err = await writeRevision(dir,req.body,req.get('x-current-date'),req.body.siteName)

	if(err){
		res.sendStatus(404)
		console.log(err);
	}else {
		res.sendStatus(200);
	}
	
});




function getRevisionFileName(fpath,dateGMTString,callback){

	ok = true;
		
	today = new Date(dateGMTString)

	

	//todayAsNumber = parseFloat(today.getMonth()+""+today.getDate()+""+today.getFullYear()+today.getHours()+""+today.getMinutes())
	//todayAsNumber = parseFloat(dateformat(today, 'mmddyyyyhhMM'));
//	var todayAsNumber = (dateformat(today, 'mmddyyyyHHMM'));

//	var tmpConvertedDateString = todayAsNumber.format();

	var searchForTodayAsMilliseconds = today.getTime();

	console.log("Dateformater Today " + today.toString() + " as number " +  searchForTodayAsMilliseconds)

	//console.log("Today " + today.toString() + " as number " + todayAsNumber )

	console.log("Fpath is " + fpath)

	fs.readdir(fpath,function(err,list){

		list = list.sort()

		//list = list.reverse();

		console.log(`File List is    ${JSON.stringify(list)}` )

		if(err){
			console.log("Error. Could not retrieve revision")
			callback(!ok,"");
		}
		/*
		for(i=0; i < list.length; i++){

			var d = list[i].num;

			var sDate = new Date(d.substr(4,4),parseInt(d.substr(0,2))-1,d.substr(2,2),d.substr(8,2),d.substr(10,2),0);

			

			list[i].asDate = d;

		}*/

		list = list.map(function(item){ 
			var num = item.indexOf(".") > -1 ? item.substr(0,item.indexOf(".")) : item.substr(0,item.length-1);
			console.log(`Yuck Number ${num}`)
			return {
					item:item,
					num:num,
					asDate: new Date(num.substr(4,4),parseInt(num.substr(0,2))-1,num.substr(2,2),num.substr(8,2),num.substr(10,2),0)   }}).sort(function(a,b){return (a.asDate)-(b.asDate)});

		var fileName = "";

		//console.log("List is  " + list )

		results = [];

	
	

		for(i=0; i < list.length; i++){


			fileName = list[i].item;

			
			//console.log("comparing todayAsNumber <= list[i] : " + todayAsNumber + " > " + (list[i]))
			console.log(`I hoaded todayAsNumber: ${today.toString()}(${searchForTodayAsMilliseconds})  >=  list[${i}]: ${list[i].num} `)
			//console.log("comparing todayAsNumber > list[i] : " + todayAsMs + " > " + (fileAsMs))
			//Ex. 021920231517
			//	  0123456789011 parsed to Date Format
			//new Date(year value, IndexOfMonth, day value, hours, minutes, seconds)
			//var tmpLocalFileAsDateFormat = dateformat(list[i].num,"mmddyyyyHHMM");

			var d = list[i].asDate;
		
			console.log(`new Date(year value, IndexOfMonth, day value, hours, minutes, seconds) = ${d.toString()}`)

			
		
			var tmpLocalFileAsDate = d;

			console.log(`My Date Format is ${tmpLocalFileAsDate.toString()}`)

			
			var localFileDateAsMilliseconds = tmpLocalFileAsDate.getTime()

			console.log(`I am NOW comparing todayAsNumber: ${today.toString()}  <=  list[${i}]: ${d.toString()} `)

			/* Search for page where date is less than today */
			if(today >= d ){
				//if(fileAsMs !=0)
				console.log(`Picked day ${list[i].item} because ${today.toString()} is <= ${d.toString()}`);
				//fileName was set at the top of this loop. It will be sent to callback a few lines below here
				results.push(fileName);
			} 

		}
		console.log(`The final result return is ${results[0]} from ${JSON.stringify(results)}`)

		if(results.length > 0)
		{
			fileName = results[results.length -1]

		} else {
			fileName = list[0].item
		}

		//fileName = results.reverse()[0]
		
		callback(ok,fileName);	

	});

	

	
}



async function getRevision(req,res,next){

	console.log("Dooyah")

	revDate = req.query.xcurrentdate

	console.log("Revison Date is " + revDate + " if null. will default to new Date()");

	try {

		var formattedDate = dateformat(revDate,"mm-dd-yyyy HH:MM")

		revDate = new Date(formattedDate).toString()
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

	if(file.indexOf("keys.txt") > -1){
		res.sendStatus(404);
		return;
	}

	file += file.endsWith("/") ? "index.html" : ""

	console.log("File is " + file + " and endsWith .json is " + file.endsWith(".json"))

	
	if(!file.endsWith(".html") && !file.endsWith(".htm") && !file.endsWith(".json")) {

		next();
		
	} else if(file.endsWith("top-nav.html") || file.endsWith("edit-body.html") || file.endsWith("settings.html") || file.endsWith("sidebar.html")){ 

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
		
		revDir =process.env.SITEDIR;
		
		var template = req.query.template ? req.query.template : "public/adminbootstrap/index.html";

		console.log("Default Revision dir is " + revDir + " and template is " + template);

		//AWAIT
		//Read Default Format
		var contents = fs.readFileSync(path.join(process.env.HOMEDIR,"public","adminbootstrap","index.html")).toString();

		console.log(`Read Default site of length ${contents.length}`)

		//Save to New Site Dir
		var sDir = `${await latestDemoSiteNumber("playground")}`;

		var theBody = {html:contents,css:"",currentPage:"index.html", date:new Date().toString(),bps:[]}

		//console.log("Linking " + revDir+'js' + " to " + __dirname + '/../public/js')

		fs.mkdirSync(path.join(revDir,sDir,"index-revisions"),{recursive:true});


		await link(path.join(process.env.HOMEDIR,'/public/js'), path.join(revDir,sDir,'/js'), 'junction')
			
		await link(path.join(process.env.HOMEDIR,'/public/css'),  path.join(revDir,sDir,'/css'), 'junction')
			

		await link(path.join(process.env.HOMEDIR,'/public/adminbootstrap'), path.join(revDir,sDir,'/theme'), 'junction')
			

		await link(path.join(process.env.HOMEDIR,'/public/napkin'), path.join(revDir,sDir,'/napkin'), 'junction')
			
		await link(path.join(process.env.HOMEDIR,'/public/settings.html'), path.join(revDir,sDir,'/settings.html'), 'junction')

		await link(path.join(process.env.HOMEDIR,'/public/sidebar.html'), path.join(revDir,sDir,'/sidebar.html'), 'junction')

		await link(path.join(process.env.HOMEDIR,'/public/top-nav.html'), path.join(revDir,sDir,'/top-nav.html'), 'junction')
			
		await link(path.join(process.env.HOMEDIR,'/public/edit-body.html'), path.join(revDir,sDir,'/edit-body.html'), 'junction')
			

		

			var err = writeRevision(path.join(revDir,sDir,"index-revisions"),theBody,req.get('x-current-date'),sDir)
		
			console.log(`Created site is ${err}`)
			if(err){
				res.sendStatus(404)
				console.log(err);
			}else {
				console.log(`REDIRECTING TO ${sDir}/index.html`)
				 res.redirect(`/${sDir}/index.html`);
			}
	

		
	
		/*

		//Show the default workspace html
		getRevisionFileContents("default",new Date().toString(),revDir,template,req.url+"?x-template="+template,function(ok,htmlOrError){
			if(!ok){
				res.sendStatus(404);
				console.log(htmlOrError);
			} else {
				res.setHeader('Content-type','text/html');
				res.set('x-site-name',site)
				
				$ = cheerio.load(htmlOrError);

				var fonts = googleFonts.split("|")

				console.log(`Yo mama length is ${fonts.length}`)

				var cleanFont = [];

				fonts.forEach(function(font){
					console.log(`Yo mama reading font ${font}`)
					var tmp = font;

					if(tmp.indexOf("=") > -1){
						tmp.substr(tmp.indexOf("=")+1) 
					}

					tmp = tmp.substr(0, tmp.indexOf(":"));

					console.log(`clean font is ${tmp}`)
					if(tmp.trim().length > 0 && tmp.indexOf("http") == -1 ){
						cleanFont.push(tmp)
					}
					

				})

				console.log(`Zoo Final cleanFont is ${cleanFont}`);

				var yomama = cleanFont.sort().toString().replace(/\+/g," ").replace(/"/g,"");

				yomama = yomama.indexOf("=") > -1 ? yomama.substr(yomama.indexOf("=")+1) : yomama;

				console.log(`Yo mama is ${yomama}`)
				$("html").attr("fonts",yomama);
				res.end($.html());
				
			}
		});*/

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
				 					$ = cheerio.load(htmlOrError);
				 					console.log("THE FILE IS " + file)
				 					if(!file.endsWith(".json")){
					 					res.setHeader('Content-type','text/html');
					 					res.set('x-site-name',site)
					 					
					 					$("[alias=notification]").css({"height":0})
					 					$("[alias=header]").css({"top":0})
					 					$(".dropped-object").addClass("noborder");

					 					var fonts = googleFonts.split("|")

					 					console.log(`Yo mama length is ${fonts.length}`)

					 					var cleanFont = [];

										fonts.forEach(function(font){
											console.log(`Yo mama reading font ${font}`)
											var tmp = font;

											if(tmp.indexOf("=") > -1){
												tmp.substr(tmp.indexOf("=")+1) 
											}

											tmp = tmp.substr(0, tmp.indexOf(":"));

											console.log(`clean font is ${tmp}`)
											if(tmp.trim().length > 0 && tmp.indexOf("http") == -1 ){
												cleanFont.push(tmp)
											}
											

										})

										console.log(`Final cleanFont is ${cleanFont}`);

										var yomama = cleanFont.sort().toString().replace(/\+/g," ").replace(/"/g,"");

										

										yomama = yomama.indexOf("=") > -1 ? yomama.substr(yomama.indexOf("=")+1) : yomama;

										console.log(`Yo mama is ${yomama}`)
										$("html").attr("fonts",yomama);

					 					res.end($.html());
				 					} else {
				 						res.setHeader('Content-type','application/json');
				 						console.log(`Text is ${$("#ELEM_1599052458134")}`);
										str = persist.getSectionFromSheet($,$("#content"))
										console.log("My JSON " + JSON.stringify(str))
										//str = {};
										
				 						
				 						res.end(JSON.stringify(str))
				 						

				 					}
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

	$("html").find('style').not(".generated").remove();
	$("html").find('script').not(".generated").remove();
	$("html").find("link").not(".generate").remove();
	console.log("Monkey")
	console.log(files)
	files.forEach(function(file){

  		///file = file.endsWith(".css") ? "/css/" + file : file;
  		//file = file.endsWith(".js") ? "/js/" + file : file;

  		var ext = ".js";
  		var selectAttrValue = null;
  		var selectorTag = null;
  		var selectAttrName = null;
  		var srcLocation = null;
  		var linkRel = null;
  		var async = '';
  		var tag = null;
  		var myKey = file;
  		if(file.endsWith(".js")){
  			ext = ".js";
  			selectAttrValue = "[src='/js/"+file +"']";
  			selectorTag = `<script ${async}>`;
  			selectAttrName = "src";
  			srcLocation = (file.startsWith("theme") ? "" : "/js/") + file;
  			async = "false";

  		} else if(file.endsWith(".css")) {
  			ext = ".css";
  			selectAttrValue = "[href='/css/"+file +"']";
  			selectorTag = `<link rel="preload" as="style">`;
  			selectAttrName = "href";
  			srcLocation = (file.startsWith("theme") ? "" : "/css/") + file;
  			linkRel = "stylesheet";
  			myKey = "/css/" + file;
  		} else {
  			
  			myKey =  url.parse(file).pathname;
  			ext = file
  			selectAttrValue = "[href='" + myKey +"'']";

  			selectorTag = `<link rel="preconnect">`;
  			selectAttrName = "href";
  			srcLocation =  file;
  			linkRel = "stylesheet";

  		} 
 
  		//ok
  		if(file.endsWith(ext)){

  			$('html').find(selectAttrValue).remove();

	  		tag = $(selectorTag);
	  		tag.attr(selectAttrName,srcLocation);
	  		tag.attr("vname",myKey.replace(/\//g,"_"))

	  		
	  		if(linkRel != null){
	  			tag.attr("rel",linkRel)
	  		}
	  		tag.attr("version",version);
	  		//console.log("Wrote file")
	  		tag.appendTo($('body'));
	  		
  		} 
  	})

	
	



	if($("#pageStyles").length == 0){
		
		$("head").append("<style class='default generated' id='pageStyles'></style>");
		$("head").append("<style class='default generated' id='pageStylesCopy'></style>");
	} 

	if($("#pageJavascript").length == 0){
		
		$("head").append("<script class='default generated' id='pageJavascript'></script>");
		$("head").append("<script class='default generated' id='pageJavascriptCopy'></script>");
	}

	//always put at the end
	$("#pageStyles,#pageStylesCopy").insertAfter($("[href=\\/css\\/idella\\.css]"))

}


function getRevisionFileContents(site,dateGMTString,revDir,revisionFileName,originalUrl,callback){

	console.log("MEntered Revision File Contents and site is " + site);

	var cssTextConstants = fs.readFileSync(path.join(process.env.HOMEDIR,"public","js","cssText.js")).toString();

	eval(cssTextConstants)

	var injestLogic = fs.readFileSync(path.join(process.env.HOMEDIR,"public","js","ingest.js")).toString();

	eval(injestLogic)

	//console.log(injestLogic)


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

		$ = _extend($);

		$.callback = callback;

		console.log(" The dataPath is " + path.join(process.env.SITEDIR,site,"data.js"))

		console.log(`Prepping to Read Backend Data from ${path.join(process.env.SITEDIR,site,"data.js")} does it exist ${fs.existsSync(path.join(process.env.SITEDIR,site,"data.js") )}`)
		
		if(fs.existsSync(path.join(process.env.SITEDIR,site,"data.js") ) ){

			var dataPath = path.join(process.env.SITEDIR,site,"data.js");

			$.dataPath = dataPath;

			console.log("Data Path is " + dataPath);

			var data = fs.readFileSync(dataPath).toString();

			console.log(data)

			try {

				eval(data);

			}catch(e){
				var msg = "<ol><li>Encountered error executing javascript you entered in file " + dataPath + "<li>" + e.stack;
				msg += "<li>To find the source of the error go to your file [" + dataPath + "] and look for the line that would cause the error below:";
				msg += "<li><font color='red'>"+ e.toString() + "</font></ol>";
				//$("[alias=notification]").html(msg).css({"height":"200px","padding":"30px"})
				$("html").attr("was-error",true);
				$("#content").prepend($("<div id=`1alias` alias=`notification`></div>").html(msg).css({"height":"200px","padding":"30px",width:"100%",color:"black","background-color":"yellow"}))
				console.log("Encountered error executing external functions for " + dataPath)
				console.log(e);
			}
		}
	

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

		var numberReported = 0;

		$('[alias]').each(function(it,div){
			//console.log(div)
			
			div = $(div);
			
			/* Loop through any aliased objects and see if backend content available. If so, update view */	
			$.trigger(div.attr("alias"),parseU,function(serverContent){
				++numberReported;
				console.log("Number Reported == " + $.numberRegistered)
				console.log("ServerContent is " + serverContent)
				if(serverContent){
					console.log("ServerContent is below for alias " + div.attr("alias"))
					console.log(serverContent)

					for(idx in serverContent){

						console.log(`Looping with idx ${idx}`)

						var response = serverContent[idx];

						console.log(`ServerContent Looking for alias with key ${idx}`)
						/*
						if(div.is("[type=LIST]")) {
							$(div).children("[type=IMG]").not(":first").remove();
						}*/
					
						INGEST_populateObject(response, $(`[alias=${idx}]`))
						/*
						if(div.is("[type=LIST]")) {
							$(div).children("[type=IMG]").first().remove();
						}*/

					}
				} else {
					console.log("No content found for list " + div.attr("alias"))
				}
				if($.numberRegistered == numberReported){
						$.clearEvents();
						callback(ok,$.html())
				}
			})	
		})
		
		if($.numberRegistered == 0){
			$.clearEvents();
			callback(ok,$.html());
		}

		}
	})
}


module.exports = router;
module.exports.getRevision = getRevision;
module.exports.writeRevision = writeRevision;
module.exports.getRevisionFileContents = getRevisionFileContents;
module.exports.getRevisionFileName = getRevisionFileName;

