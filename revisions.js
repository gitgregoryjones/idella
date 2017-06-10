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

		var title = theSiteObj.currentPage;

		var currentPage = theSiteObj.currentPage;

		var page = {};

		console.log("Loading " + title)

		this.website = localStorage.getItem("repo_"+title);

		if(!this.website){
			this.website = {name:title,pages:{}}
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

		console.log(this.website)

		//this.website.pages[theSiteObj.currentPage].revisions.push(revision)


		localStorage.setItem("repo_"+ theSiteObj.currentPage,JSON.stringify(this.website))

	}
}



