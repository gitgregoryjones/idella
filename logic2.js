var _debug = false;
var lastEditedClass = "";
global_zIndex = 1000;
var files = ["overlay.js","ghost.js","plugins.js","notes.js","drawSpace.js","custom_events2.js","translate.js","ingest.js","contextmenu.js","slider4.js","cssText.js","persist.js","extensions2.js","stylesTabs2.js","stylesAutoComplete.js","save.js","saveJs.js","enableTextAreaTabs.js","saveBreakPoints.js"]
var hotObj = "";
var hotObjId = 0;
var genericClass = {};
var allSitesAsObj = null;
var website = "default";
var theSiteObj = null;
version = "1.0";

//var autoSaveEnabled = true;
var editing = false;
//var copiesModified = false;
//var groupResizeEnabled = false;
var smartId = 0;

ERROR = 4
WARN = 3
TRACE = 2
DEBUG = 1

var LOGLEVEL = WARN



var log = function(level, msg){
	if(!msg){
		msg = level;
		//console.log(msg)
	} else{
		if(level >= LOGLEVEL){
			console.log(msg);
		}
	}
}

log["debug"] = function(msg){
	log(DEBUG,msg)
}

log["trace"] = function(msg){
	log(TRACE,msg)
}

log["warn"] = function(msg){
	log(WARN,msg)
}

log["error"] = function(msg){
	log(ERROR,msg)
}



$( document ).ready(function() {


	if(_debug){
		$.event.trigger("enableDebug",[_debug])
	} else {
		$.event.trigger("disableDebug",[_debug])
	}


	$(files).each(function(index,file){
		$("head").append($("<script>",{src:file,version:version}))
	});

	   try {

	   		if($("style.generated").length == 0){
			   			log("Adding Generated Stylesheet")
			   			$("head").append("<style class='generated'></style>");
			}

			if($("script.generated").length == 0){
			   			log("Adding Generated javascript")
			   			$("head").append("<script class='generated'></script>");
			}
			log.debug("Before Current Site")
			getCurrentSite();
			log.debug("After Current Site")
			//load scripts now that body has been written
			loadAllBreakPoints();
			loadAllJs();
			
					       		
	   }catch(e){
			log.error("Unable to retrieve site [" + website + "] " + e)
			log.error(e)
	   }

	   		       
	   $("title").html(website)

		initialize();
		$.event.trigger("initializationComplete",[]);
		t = whichTool("div");
		meDiv = $(t.droppedModeHtml)
		$("body").append(meDiv)
		genericClass = CONVERT_STYLE_TO_CLASS_OBJECT(meDiv)
		meDiv.remove();

		log.debug("GENERIC IS " + JSON.stringify(genericClass));
});


/**
*  Which Tool do we want to instantiate based on User Input
*/
function whichTool (tool){

	if(!tool)
		tool = "T";

	type = (tool).toUpperCase();

	_debug&&log(`User chose tool [${tool}]`);

	var theTool = {}

	switch(type){
		
		case "BTN":
	
		theTool =  new GenericTool({
			type:type,
			droppedModeStyle:"",
			droppedModeHtml:"<div><div type=\"MENU\"><div type=\"MENU-ITEM\"  style=\"display: inline-block; padding-left: 20px;\" edittxt=\"Enter Text\nHere\">Enter Text Here</div></div><div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppable:true,
			editModeHtml:"<input>",
			droppable:true,
			editModeStyle:"border:0;width:10vw",
			class:"button red"
		});
		break;
		case "SCRL":
	
		theTool =  new GenericTool({
			type:type,
			droppable:true,
			class:"list"
		});
		break;
		case "HDR":
	
		theTool =  new GenericTool({
		type:type,
			droppedModeStyle:"position:fixed",
			droppable:true,
			class:"header",
			position:"fixed"
		});
		break;
		case "DIV":
		case "CIR":
		case "IMG":
		case "PLUGIN":
		case "MENU-ITEM":
		case "MENU-ITEM-TXT":
		case "MENU-ITEM-ICON":
		case "MENU-ITEM-IMAGE":
		case "MENU":
		theTool = new GenericTool({
			type:type,
			droppable:true,
			class:"squarepeg"
		});
		break;

		case "LIST":
		theTool = new GenericTool({
			type:type,
			droppedModeHtml:"<div><div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppable:true,
			class:"squarepeg list"
		});
		break;
		case "VID":
		theTool = new GenericTool({
			type:type,
			droppedModeStyle:"",
			droppedModeHtml:'<div><video preload="auto" autoplay><source class="content-image" src="http://brown-sugar.bouncemediallc.netdna-cdn.com/video/featured.mp4" type="video/mp4"/></video><div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>&nbsp;</div>',
			droppable:true,
			class:"squarepeg"
		});
		break;
		/*
		case "IMG":
		theTool = new GenericTool({
			droppedModeHtml:'<div style="width:75px; height:75px">&nbsp;<div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img   src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div><img align=\"center\" class="content-image" src=\"happy.png" />hello again<br clear=\"center\"></div>',
			type:type
			
		});
		break;*/
		case "ICON":
		
		theTool =  new GenericTool({
			type:type,
			droppable:true,
			editModeHtml:"",
			droppedModeHtml:"<div class=\"fa fa-youtube icon\">&nbsp;<div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppable:false
		});
		break;
		default:
		

		//<div type="MENU-ITEM" id="ELEM_1491749916155-0" item="ELEM_1491749916155-0" style="display: inline-block; padding-left: 20px;"><div type="MENU-ITEM-TXT" edittxt="Modeis" style="display:inline-block">Modeis</div></div>	
	
		theTool = new GenericTool({
			type:type,
			class:"texttool",
			friendlyName : "Text Field",
			//droppedModeHtml:"<div>Enter Text Here<div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppedModeHtml:"<div><div type=\"MENU\"><div type=\"MENU-ITEM\"  style=\"display: inline-block; padding-left: 0px;\" edittxt=\"Enter Text Here\">Enter Text Here</div></div><div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			class:"generictext"

		});
		break;
	}

	return theTool;

}

function GenericTool(options){
	log("Passed options");
	log(options);
	this.type = options.type;
	this.name = "ELEM_" + new Date().getTime();
	this.id = this.name;
	this.droppedModeStyle = "";
	//this.droppedModeHtml = "<div>&nbsp;<div class='hotspot'>E</div><div>&nbsp;</div></div>";
	this.droppedModeHtml="<div><div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>";
	this.editModeHtml = "<textarea>";
	this.editModeStyle = "";
	this.editModeAttribute = "value";
	this.class = "";
	this.zIndex = CUSTOM_incrementZIndex();
	this.friendlyName = this.type;
	this.droppable = true;



	/*
	if(options.editFields)
		$.merge(this.editFields,options.editFields);

	delete options.editFields;
	*/
	Object.assign(this,options);

	return this;
}

/*********************************
* Component Double Click Logic
*********************************/
function configuredTool(options){

	Object.assign(this,options);
	{
		me = this;

		log(options)
		this.node = $(options.droppedModeHtml).addClass(options.class).attr('id',this.name)

			.css({zIndex: options.zIndex,display:"block"}).attr('type',options.type);
	

		setUpDiv(this.node)

		if(!options.droppable){
			$(this.node).removeClass("ui-droppable").droppable("destroy")
		}

		return this.node;
	}
	
}





