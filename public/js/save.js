
var SAVE_okToSave = true;

dialogs = $(".adialog")

var timeoutID = null;

function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("keydown", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);

 
    startTimer();
}
setup();

function startTimer() {
    // wait 2 seconds before calling goInactive
  
    	timeoutID = window.setTimeout(SAVEJS_goInactive, 500000);
}
 
function resetTimer(e) {
    window.clearTimeout(timeoutID);
 
    goActive();
}


function saveCurrentSite(site){

	
	var allSites = LZString.decompress(localStorage.getItem("sites"))

	if(!allSites){
		allSites = "{}";
	}

	allSitesAsObj = JSON.parse(allSites);
	allSitesAsObj[website] = site;

	log.warn("Saving website... " + website)
	log.debug(site)

	var siteAsStr = JSON.stringify(allSitesAsObj);

	log.warn("Site as str length before compression " + siteAsStr.length)


	// out will be a JavaScript Array of bytes
	var out = LZString.compress(JSON.stringify(allSitesAsObj));

	log.warn("Length after compression " + out.length)

	try {
	localStorage.setItem("sites",out);
	}catch(e){
		console.log(e)
	}

}

function getCurrentSite(){

	//allSites = localStorage.getItem("sites");

// out will be a JavaScript Array of bytes
	var allSites = localStorage.getItem("sites")

	//allSites = localStorage.getItem("sites");

	if(!allSites){
		
		allSitesAsObj = {}
		allSitesAsObj["default"] = {}
		allSitesAsObj.default["html"] = "";
		allSitesAsObj.default["style"] = "";
		allSitesAsObj.default["bp"] = []
		website = "default"
		allSitesAsObj.default.name = website;
		allSitesAsObj.default.currentPage = location.pathname;

		theSiteObj = allSitesAsObj.default;

		var out = LZString.compress(JSON.stringify(allSitesAsObj));

		console.log("Length after compression " + out.length)

		localStorage.setItem("sites",out);
		theSiteObj = allSitesAsObj[website];

	} else {

		allSites = LZString.decompress(localStorage.getItem("sites"))
		allSitesAsObj = JSON.parse(allSites);
		//website = prompt("Which Site Would You Like to Load?")
		website = website != null && website.trim().length > 0 ? website : "default"

		log.debug("User want to load site " + website)
		theSiteObj = allSitesAsObj[website]
		log.debug("Site object is [" + theSiteObj + "]")
		log.debug(theSiteObj)
		if(theSiteObj == undefined){
			//create new site for user
			allSitesAsObj = {}
			allSitesAsObj[website] = {}
			allSitesAsObj[website]["html"] = "";
			allSitesAsObj[website]["style"] = "";
			allSitesAsObj[website]["bp"] = []
			

			
		}

		allSitesAsObj[website].name = website;
		allSitesAsObj[website].currentPage = location.pathname;

		theSiteObj = allSitesAsObj[website];

		theStyle = $("style.generated").html(theSiteObj.style)

	   	//get most recent version of tool and responsive tabs
	   	var tools = $("#id_toolset");
	   	var ctxmenu = $(".custom-menu")
	   	log.debug("Tools are")
	   	log.debug(tools)

	   	var rd = $(".responsive-design-tab")

	   	log.debug("Retrieving Body for site [" + website + "]")

	   	//$("body").html("")
    	//$("body").append(theSiteObj.html);
    	//get most recent tool
    	$(document).on("initializationComplete",function(){
    		dialogs = $(".adialog")
	    	
	    	$("head").append(theStyle)
    	})

    	
    

    	
	}
	
	return theSiteObj;

}
 
function SAVEJS_goInactive() {


	if(editing) {
		if($("#drawSpace").children(".dropped-object").length == 0){
			log.debug("Nothing to save")
			return;
		}
	}

	var userInPreview = false;

	console.log("SAVE_okToSave : " + SAVE_okToSave)

    // do save
   //if(autoSaveEnabled && !userHoveringOverNote && !$("#jsdialog").dialog("isOpen") && !$("#dialog").dialog("isOpen") && !$("#smalldialog").dialog("isOpen")){
   if(SAVE_okToSave){	

	var degrees = 1;

	$(".masterautosave").css("background-color","yellow")

	
	var interval = setInterval(function(){
		
		if(degrees < 360){
			degrees = degrees + 60;
		$(".masterautosave").css("transform","rotate("+ (degrees)  + "deg");
		log.debug(" degrees is "+degrees)
		} else {
			log.debug("resetting degrees")
			clearInterval(interval)
			$(".masterautosave").css("background-color","transparent")
		}
	},300)	
	

	log.debug(escape($("body").html()).replace("\n",""));

		
	var redrawTools = false;


	if($("#id_toolset").is(":visible")) {
		redrawTools = true;
	}

	if($("#drawSpace").css("background-image") == "none") {
		userInPreview=true;
	}

	
	//simulate keypress to clean up view before saving. THIS ALSO DELETES VISIBLE NOTES
	CUSTOM_pressEscapeKey();



	$("#id_toolset").hide();

	//toggle preview mode


	log.debug("website is " + website)
	
	if(website.length > 0){
		
		log.debug("Setting website html for " + website)

		//get raw body from drawSpace()
		var body = DRAW_SPACE_deleteWorkspaceFromBody();
	
		theSiteObj.html = $(body).html();

		theSiteObj.style = $("style.generated").html()

		log.debug("Seting style for website " + website)
		log.debug(theSiteObj)

		var saveImage = $("<div>",{class:"saveImage"})
		$("body").append(saveImage);
		$(saveImage).css("left",$(document).width()/2 - $(".saveImage").width());
		$(saveImage).css("top",$(document).height()/8 - $(".saveImage").height()/2);
		$(saveImage).show();

		saveCurrentSite(theSiteObj)

		$(document).trigger("REVISION_NEEDED_EVENT",[theSiteObj.redirect]);

		setTimeout(function(){$(saveImage).remove()},2500)

		//Redraw dspace
		if(editing)
			DRAW_SPACE_addWorkSpaceToBody();

	}


	if(redrawTools){
		$("#id_toolset").show();
	}
	
	if(userInPreview){
		$("#drawSpace").css("background-image","none");
		userInPreview = true;
	}


   		
   	} else {
   		log("Not saving because user is currently editing content " + $(".adialog").dialog("isOpen") +"in popup window or autoSaveEnabled " + SAVE_okToSave)	


   	}
}

function deleteElement(element, prompt){

	if(prompt == true){

		if(confirm("are you sure you want to delete :" + $(element).attr("type"))){
				if(isBreakPoint()){
					$(element).css("background-color","red")
				}
		} else {
			log.trace("User changed mind about deleting object")
			return;
		}
	}

	NOTES_delete(element);

	//delete kids first
	$(element).children(".dropped-object").each(function(it,child){
		deleteElement(child,false);
	})

	element = $(element).remove()

	var myCSSLookupKey = "." + $(element).attr("id")

	var re = new RegExp(myCSSLookupKey+'\\s+\\{[^}]+\\}','img')

	var thescript = "";

	
	//delete base style
	thescript = $("style.generated");

	//thescript.html(thescript.html().replace(re,"\n/* user deleted class [" + myCSSLookupKey + "] */\n"))
	thescript.html(thescript.html().replace(re,""))

	//Trigger anyone listening for this delete event.  ie. Context Menu
	$.event.trigger("deleteEvent",[$(element).attr("id")])

	//delete breakpoints
	//delete js

}


 
function goActive() {
    // do something
         
    startTimer();
}