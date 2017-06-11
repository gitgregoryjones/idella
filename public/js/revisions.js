//.*(BEGIN\sELEM_1482071966106)(.+)(END\sELEM_1482071966106).*
//Get All Revisions > date

function revisionSort(a,b){

	return new Date(a.date).getTime() - new Date(b.date).getTime()

}

var Revision = class {
	constructor(name,date,html,css,js){
		this.name = name;
		this.date = date;
		this.html = html;
		this.css = css;
		this.js = js;
		this.bps = []
	}

	getHtml(html){
		return this.html;
	}

	setHtml(html){

		this.html = html;
	}


	getJs(){
		return this.js;
	}


	setJs(js){

		this.js = js;
	}

	getCss(){
		return this.css;
	}

	setCss(css){
		this.css = css;
	}

	getBps(){
		return this.bps;
	}

	addBp(bps){
		this.bps[this.bps.length] = bps;
	}

}
//Override This Class to Make other revision types.  Ie GitHub Revisions
//Currently Memory Repo
var Repo = class {

	constructor(theSiteObj){

		
		
		this.website = {};
		this.page = {};
		this.userSite = theSiteObj;
	}

	//Get All Revision >= date sorted by Date Ascending
 	getRevisions (date){

 		list = [];
 		//w = repo.getItem(website)
 		if(this.revisions){
 			list = this.revisions.sort(revisionSort)
 		}

 		return list;
	}

	writeRevision (website,date,revisionName){
		
		revision = new Revision(revisionName,date);

		revision.setHtml(website.html);
		revision.setCss(website.style);
		revision.setBps(website.bps);

		for(idx in bps){
			//mediaQueryCSS = getBreakpoint(bp[idx])

			breakpointWidth = bps[idx]

			revision.setBpCss("@media-"+breakpointWidth,website["@media-"+breakpointWidth])
		}

		this.revisions.push(revision)
	}
	
}

var LocalStorageRepo = class extends Repo {
	

	constructor(theSiteObj){

		super(theSiteObj)

		var title = theSiteObj.name;

		var currentPage = theSiteObj.currentPage;

		var page = {};

		console.log("Loading " + title)

		this.website = localStorage.getItem("repo_"+title);

		if(!this.website){
			this.website = {name:theSiteObj.name,pages:{}}
		} else {
			this.website = JSON.parse(this.website)
		}

		if(!this.website.pages[currentPage]){

			page = {name:currentPage,revisions:[]}

			this.website.pages[page.name] = page;

			this.website.pages[page.name].revisions = [];

		}

		this.page = this.website.pages[currentPage]; 

	}


 	getRevisions (theSiteObj,date){

 		//initWebsite(theSiteObj);

 		var list = [];

 		if(this.page.revisions){
 			list = this.page.revisions.sort(revisionSort)
 		}

 		return list;
	}


	writeRevision (theSiteObj, date,revisionName){

		//initWebsite(theSiteObj);
		
		var revision = new Revision(revisionName,date);

		revision.setHtml(theSiteObj.html);
		revision.setCss(theSiteObj.style);
		
		for(var x = 0; x <  theSiteObj.bp.length; x++){
			//mediaQueryCSS = getBreakpoint(bp[idx])
			console.log("BP is " + x )
			console.log(theSiteObj.bp[x])

			var bp = theSiteObj.bp[x];

			console.log({bp:bp, query:theSiteObj["@media-"+bp]});

			revision.addBp({bp:bp, query:theSiteObj["@media-"+bp]})

			


		}

		this.website.pages[theSiteObj.currentPage].revisions.push(revision)

		this.website.currentPage = this.website.pages[theSiteObj.currentPage];

		this.website.currentRevision = revision;

		console.log(this.website)
		//this.website.pages[theSiteObj.currentPage].revisions.push(revision)
		localStorage.setItem("repo_"+ theSiteObj.currentPage,JSON.stringify(this.website))

		return (this.website);

	}
}


function REVISION_createNewSite(settings,callback) {

	console.log(settings)

	site = {};

	params = settings.split("&")

	for(i=0; i < params.length; i++){
		argAndVal = params[i].split("=");
		site[argAndVal[0]] = argAndVal[1];
	}

	console.log(settings);
	console.log(site)
	console.log("oops")
	console.log(JSON.stringify(site))

	str = JSON.stringify(site);


	$.ajax({
	    type: "POST",
	    url: "/site",
	    // The key needs to match your method's input parameter (case-sensitive).
	    data: str,
	    contentType: "application/json; charset=utf-8"
	   
	
	}).done(function(){
		callback(true)
	}).fail(function(x,t,e){
		alert("Error creating site. Encountered error : " + t)
		alert(e);
		console.log("Error creating site :" + t)
		console.log(e);
	});


	

}


$(document).on("REVISION_NEEDED_EVENT",function(evt){

	alert("revision needed")

	repo = new LocalStorageRepo(theSiteObj);

	object = repo.writeRevision(theSiteObj,new Date(),"Tuesday")
	/*
	$.post(location.protocol   + "/revisions", object, function(response) {
    	
	}, 'json');*/


	$.ajax({
	    type: "POST",
	    url: location.protocol   + "/revisions",
	    // The key needs to match your method's input parameter (case-sensitive).
	    data: JSON.stringify(object),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json"
    
	}).done(function(){
		callback(true)
	}).fail(function(x,t,e){
		
		alert(e);
		console.log("Error revising site :" + t)
		console.log(e);
	});


})


