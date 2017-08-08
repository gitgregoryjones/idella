var _debug = false;
var lastEditedClass = "";
global_zIndex = 1000;


var hotObj = "";
var hotObjId = 0;
var genericClass = {};
var allSitesAsObj = null;
var website = "default";
var theSiteObj = null;
var theSiteConfig = {};
LOGIC_redirectNeeded = false;
var LOGIC_TEMPLATE_MODE = false;
version = "1.0";


//var autoSaveEnabled = true;
var editing = false;
//var copiesModified = false;
//var groupResizeEnabled = false;
var smartId = 0;

ERROR = {level:4,label:"ERROR"}
WARN = {level:3,label:"WARN"}
TRACE = {level:2,label:"TRACE"}
DEBUG = {level:1,label:"DEBUG"}

var LOGLEVEL = WARN;



var log = function(consoleHandler, msg){
	if(!msg){
		msg = consoleHandler.label;
		//console.log(msg)
	} else{
		if(consoleHandler.level >= LOGLEVEL.level){

			console.log(consoleHandler.label + ": " + msg);
		}
	}
}

log["debug"] = function(msg){
	log(DEBUG,msg)
}

log["trace"] = function(msg){
	log(TRACE,msg)
}

log.info = log.trace;

log["warn"] = function(msg){
	log(WARN,msg)
}

log["error"] = function(msg){
	log(ERROR,msg)
}

var myPage = {}

$(document).ready(function() {

	$(document).mousemove(function(event){
		myPage.X = event.pageX;
		myPage.Y = event.pageY;
	})

	if(pageState.params && pageState.params["x-template"]){
		LOGIC_TEMPLATE_MODE = true;
	}

	//$("body").hide();

	if(_debug){
		$.event.trigger("enableDebug",[_debug])
	} else {
		$.event.trigger("disableDebug",[_debug])
	}

	   if(editing) {

	   		containerDiv = $('<div id="misc-controls">')

		   	$(containerDiv).load("/edit-body.html",function(){

			   try {

			   		
					log.debug("Before Current Site")

					if($('body').find('.dropped-object').length == 0){
						
						website = $('html').attr('x-site-name');
						$('body').append(containerDiv);
						getCurrentSite();
						log.debug("After Current Site")
						//load scripts now that body has been written
						
					} else {

						
						website = $('html').attr('x-site-name');

						theSiteObj = {};
						theSiteObj.bp = [];
						theSiteObj.name = website;
						theSiteObj.currentPage = location.pathname.replace("/"+website,"");

						$('body').append(containerDiv)
						//loadAllJs();
					}
					loadAllBreakPoints();
					loadAllJs();

					theSiteObj.currentPage = location.pathname.replace("/"+website,"");


					if(theSiteObj.currentPage == "/" || theSiteObj.currentPage == ""){
						theSiteObj.currentPage = "index.html";
					}

					if($('html').first().attr('x-current-page-name')){
						theSiteObj.currentPage = $('html').first().attr('x-current-page-name');
					}
					//alert(theSiteObj.currentPage)
					
							       		
			   }catch(e){
					log.error("Unable to retrieve site [" + website + "] " + e)
					log.error(e)
			   }

		   		initialize();
		   		$(document).trigger("pageReloaded",pageState,currentBreakPoint);
				$.event.trigger("initializationComplete",[]);
				t = whichTool("div");
				meDiv = $(t.droppedModeHtml)
				$("body").append(meDiv)
				genericClass = CONVERT_STYLE_TO_CLASS_OBJECT(meDiv)
				meDiv.remove();

				log.debug("GENERIC IS " + JSON.stringify(genericClass));
				//$('body').show();

				CUSTOM_pressEscapeKey(); 
				PREVIEW_togglePreview(false);
		   	})
		 } else {

		  	$("*").removeClass("submenu").not("[type=anchor]").css("cursor","default")
		  	$(".ghost").remove();
		   	$('body').show().addClass("hover");
		   	$('#myp').hide();
			$(".dropped-object").not("[type=OVERLAY]").on("mouseenter",function(event){
					
					if($(this).attr("overlay") && !$(this).children("[type=OVERLAY]").first().is(":visible") ) {
						
						OVERLAY_showOverlay(event.target)
					}
					
			})
			.css("touch-action","auto").addClass("previewmode")		   
		 }

		 website = $('html').first().attr("x-site-name")

		  $.ajaxSetup({
    				beforeSend: function(xhr) {
        			xhr.setRequestHeader('x-site-name', $('html').first().attr("x-site-name"));
        			xhr.setRequestHeader('x-current-page-name', $('html').first().attr("x-current-page-name"));
        			xhr.setRequestHeader('x-current-date', $('html').first().attr('x-current-date'));

    			}
			})
		
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
			droppedModeHtml:"<div><div type=\"MENU-ITEM\"  style=\"display: inline-block; padding-left: 20px;\" edittxt=\"Enter Text\nHere\">Enter Text Here</div></div></div>",
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
		case "CIRCLE":
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
			droppedModeHtml:"<div></div>",
			droppable:true,
			class:"squarepeg list"
		});
		break;
		case "VID":
		theTool = new GenericTool({
			type:type,
			droppedModeStyle:"",
			droppedModeHtml:'<div><video preload="auto" autoplay><source class="content-image" src="http://brown-sugar.bouncemediallc.netdna-cdn.com/video/featured.mp4" type="video/mp4"/></video></div>',
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
			droppedModeHtml:"<div class=\"fa fa-youtube icon\"></div>",
			droppable:false
		});
		break;
		case "T":
			theTool = new GenericTool({
			type:type,
			class:"texttool",
			friendlyName : "Text Field",
			//droppedModeHtml:"<div>Enter Text Here<div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppedModeHtml:"<div contenteditable=\"true\">Enter Text Here</div>",
			class:"generictext"

		});
		break;

		default:
		

		//<div type="MENU-ITEM" id="ELEM_1491749916155-0" item="ELEM_1491749916155-0" style="display: inline-block; padding-left: 20px;"><div type="MENU-ITEM-TXT" edittxt="Modeis" style="display:inline-block">Modeis</div></div>	
	
		theTool = new GenericTool({
			type:type,
			class:"texttool",
			friendlyName : "Text Field",
			//droppedModeHtml:"<div>Enter Text Here<div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppedModeHtml:"<div><div type=\"MENU\"><div type=\"MENU-ITEM\"  style=\"display: inline-block; padding-left: 0px;\" edittxt=\"Enter Text Here\">Enter Text Here</div></div></div>",
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
	this.droppedModeHtml="<div></div>";
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
		this.node = $(options.droppedModeHtml).addClass(options.class).addClass("dropped-object").attr('id',this.name)

			.css({zIndex: options.zIndex,display:"block"}).attr('type',options.type);

		setUpDiv(this.node)

		if(!options.droppable){
			$(this.node).removeClass("ui-droppable").droppable("destroy")
		}

		return this.node;
	}
	
}







