
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
	var allSites  = false;

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



	if($('html')[0].hasAttribute("was-error")){
			SAVE_okToSave = false;
	}



	if(editing) {
		if($("#drawSpace").find(".dropped-object").length == 0){
			log.debug("Nothing to save")
			return;
		}
	}

	var userInPreview = false;

	console.log("SAVE_okToSave : " + SAVE_okToSave)

    // do save
   //if(autoSaveEnabled && !userHoveringOverNote && !$("#jsdialog").dialog("isOpen") && !$("#dialog").dialog("isOpen") && !$("#smalldialog").dialog("isOpen")){
   if(SAVE_okToSave && editing){	

		var saveImage = $("<div>",{class:"saveImage"})
		$("body").append(saveImage);
		$(saveImage).css("left",$(document).width()/2 - $(".saveImage").width());
		$(saveImage).css("top",$(document).height()/8 - $(".saveImage").height()/2);
		$(saveImage).show();
		

		$(document).trigger("REVISION_NEEDED_EVENT",[LOGIC_redirectNeeded]);

	

   		
   	} else {
   		log("Not saving because user is currently editing content " + $(".adialog").dialog("isOpen") +"in popup window or autoSaveEnabled " + SAVE_okToSave)	
   		 window.clearTimeout(timeoutID);
   		
   	}
}

function deleteElement(element, prompt){

	if(prompt == true){

		var alias = $(element).attr("alias") == undefined ? $(element).attr("type") : $(element).attr("type") + " (" + $(element).attr("alias") + ")";

		if(confirm("Are you sure you want to delete " + alias + "?")){
				
		} else {
			log.trace("User changed mind about deleting object")
			return;
		}
	}

	if(isBreakPoint()){
			//pass TRUE as last Param to have method just tell us if found in master CSS file. If so, GHOST it.  
			//If not really found ,delete it and children
			if(writeClassToMasterCSSFile($(element),"."+$(element).attr("id"),{cssRule:""},true)){
				GHOST_setUpElement($(element));

			} else {
				writeClassToBreakPointCSSFile($(element),"."+$(element).attr("id"),{cssRule:""})
				$(element).children(".dropped-object").each(function(it,child){
					writeClassToBreakPointCSSFile($(child),"."+$(child).attr("id"),{cssRule:""})
					$.event.trigger("deleteEvent",[$(child).attr("id")])
				})
				$(element).remove()
				$.event.trigger("deleteEvent",[$(element).attr("id")])
			}
		} else {
			writeClassToMasterCSSFile($(element),"."+$(element).attr("id"),{cssRule:""})
			$(element).children(".dropped-object").each(function(it,child){
				writeClassToMasterCSSFile($(child),"."+$(child).attr("id"),{cssRule:""})
				$.event.trigger("deleteEvent",[$(child).attr("id")])
			})
			$(element).remove()
			$.event.trigger("deleteEvent",[$(element).attr("id")])

		}
	
	NOTES_delete(element);

}


 
function goActive() {
    // do something
         
    startTimer();
}