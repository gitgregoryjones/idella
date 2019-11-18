//.*(BEGIN\sELEM_1482071966106)(.+)(END\sELEM_1482071966106).*
//Get All Revisions > date

var REVISION_anchors = [];

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

		var title = $('html').attr('x-site-name')
		var currentPage = $('html').attr('x-current-page-name')
		var page = {};

		console.log("Loading " + title)

		//this.website = localStorage.getItem("repo_"+title);
		this.website = {name:$('html').attr('x-site-name'),pages:{}}
		/*
		if(!this.website){
			this.website = {name:$('html').attr('x-site-name'),pages:{}}
		} else {
			this.website = JSON.parse(this.website)
		}*/

		//if(!this.website.pages[currentPage]){

			page = {name:currentPage,revisions:[]}

			this.website.pages[page.name] = page;

			this.website.pages[page.name].revisions = [];

		//}

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
		revision.siteName = theSiteObj.name;
		revision.anchors = REVISION_anchors;
		
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
		//localStorage.setItem("repo_"+ theSiteObj.currentPage,JSON.stringify(this.website))

		return (this.website);

	}
}

function REVISION_getAllSites(callback){

	$.ajax({
		    type: "GET",
		    url: "/site/all",
		    contentType: "application/json; charset=utf-8",
		    dataType:"json"
		   
		
		}).done(function(data){
		
			callback(true,data)
		}).fail(function(x,t,e){
			console.log("Error getting all sites :" + t)
			console.log(e);
			callback(false,e);
		});
}


function REVISION_createNewSite(siteName,callback) {

	console.log(siteName)
	
	$.get("/site/lookup/"+siteName).fail(function(){

		$.ajax({
		    type: "POST",
		    url: "/site",
		    // The key needs to match your method's input parameter (case-sensitive).
		    data: "{}",
		    contentType: "application/json; charset=utf-8"
		   
		
		}).done(function(){
			//window.location = "/" + settings.name + "/index.html";
			callback(true)
		}).fail(function(x,t,e){
			//alert("Error creating site. Encountered error : " + t)
			//alert(e);
			console.log("Error creating site :" + t)
			console.log(e);
			callback(false,e);
		});
	}).done(function(x,t,c){
		console.log("Not creating site " + siteName + " because it already exists");
		callback(true);
	})
}


function REVISION_createPage(pagename){

	$.ajax({
		    type: "POST",
		    url: "/site/page/" + pagename,
		    // The key needs to match your method's input parameter (case-sensitive).
		    data: JSON.stringify(theSiteObj),
		    contentType: "application/json; charset=utf-8"
		   
		
		}).done(function(){
			//callback(true)
			$(document).trigger("REVISION_NEEDED_EVENT",[]);
		}).fail(function(x,t,e){
			//alert("Error creating site. Encountered error : " + t)
			//alert(e);
			console.log("Error creating site :" + t)
			console.log(e);
			//callback(false,e);
		});

}

$(document).on("REVISION_NEEDED_EVENT",function(evt,redirect){

	repo = new LocalStorageRepo(theSiteObj);

	//true means, just give a copy for saving but don't actually change UI
	var tempHTML = DRAW_SPACE_deleteWorkspaceFromBody(true)

	tempH = $('<html>').append(tempHTML.children())

	tempH.find('.saveImage').remove();

	tempH.find("[id$=lock]").remove();

	tempH.find("#layer-menu").hide();

	object = {siteName:$('html').first().attr('x-site-name'),html:tempH.html(),css:""
		,pageName:$('html').first().attr('x-current-page-name')
		, anchors:REVISION_anchors,BREAKPOINTS:BREAKPOINTS
		,documentWidth:document.documentElement.clientWidth}

	REVISION_createNewSite(object.siteName,function(ok,err){

		if(ok){
			console.log("Sending a new revision")
			$.ajax({
			    type: "POST",
			    url:  "/revisions",
			    // The key needs to match your method's input parameter (case-sensitive).
			    data: JSON.stringify(object),
			    contentType: "application/json; charset=utf-8"
		    	
			}).done(function(){
				console.log("Revision created");
				$(".saveImage").hide();


				//Give User Visual Indicator They are in preview mode
				POPUP_greyOver({target:"window",callerType:"save-window"},function(greyBox){

					greyBox.find("[data-message-for-greybox]").text(` Saving ${object.siteName}...`).addClass("fa fa-save")
					.css({"background-color":"green","text-align":"center",transform:"rotate(-10deg)"})
					//Auto destroy greybox after 700 milliseconds by fading out and finally deleting from DOM and
					//stylesheet if added					
					setTimeout(function(){

						REVISION_anchors = [];
						if(redirect){
							
							window.location = URI.joinPaths("",object.siteName,object.pageName);
						} 

						greyBox.fadeOut(function(){
							deleteElement($(this))
						})

					},2000)					
				})
			
				
			}).fail(function(x,t,e){
				alert("Failure is here:")
				alert(e);
				console.log("Error revising site :" + t)
				console.log(e);
			});


		} 

	})


})





