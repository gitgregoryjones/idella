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
var editing = true	;
//var copiesModified = false;
//var groupResizeEnabled = false;
var smartId = 0;

ERROR = {level:4,label:"ERROR"}
WARN = {level:3,label:"WARN"}
TRACE = {level:2,label:"TRACE"}
DEBUG = {level:1,label:"DEBUG"}

var LOGLEVEL = ERROR;


var MSG = "";


function flushIt(){
	console.log("I read message : " + MSG)
	var instruction = MSG;
	PROCESS_LINES_processInstruction(instruction);
	MSG = ""
}

setInterval(function(){
	if(MSG.endsWith(".") ) {
		flushIt();
	}
},100)


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


jQuery.fn.outerHTML = function(s) {
return (s)
? this.before(s).remove()
: jQuery("&lt;p&gt;").append(this.eq(0).clone()).html();
}



$(document).ready(function() {


	saveJs($("body").first(),`function silent(){}`)


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

		 	$(".group-container").css("background-color","transparent");

		 	setUpPopUpButtons();

		  	
		  	//$("[type=anchor]").css("border","none")
		  	$("*").prop("contenteditable",false).css("-webkit-user-modify","read-only")
		  	$(".ghost").hide();
		   	$('body').show().addClass("hover");
		 
		   	$("[type=LIST]").each(function(it,div){
		   		//console.log("LISTING IT")
		   		div = $(div)
		   		if(div.hasClass("gallery")){
		   			SLIDER_init(div);
		   		}
		   	})
			$(".dropped-object").not("[type=OVERLAY]").on("mouseenter",function(event){
					
					if($(this).attr("overlay") && !$(this).children("[type=OVERLAY]").first().is(":visible") ) {
						
						OVERLAY_showOverlay(event.target)
					}
					
			})
			.css("touch-action","auto").addClass("previewmode")

			//on window resize, do ghost stuff
			loadAllBreakPoints()
			
			
			$(window).on('resize',drawResponsiveTab)		   
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


function onMenu(vertical){

	if($("#zMenu").attr("open") == "open"){
		return;
	}

	$("#zMenu").attr("open","open");

	if($("[alias=theCanvas]").offset().top > 0){
		$("[alias=theCanvas]").css({top:0})
	}

	if(typeof vertical == "object"){

		//Do nothing this is event object
	} else {
		
			//dont' overwrite and use user value passed in as boolean paramter
		

	}

	//Try to override with user value, otherwise set to false
	if($("#zMenu").attr("slider-direction")){
		vertical = $("#zMenu").attr("slider-direction").trim() == "left"? false : true;
	}

	var winHeight = Math.max.apply(null,$.map($("[type]"),function(it,i){return $(it).offset().top}));

	var theHeight = $("#drawSpace").length > 0 ? $("#drawSpace").height() : winHeight;

	NOTES_delete();

	var myDiv = $("[alias=zMenuContent]");

	if($(myDiv).length == 0){

		myDiv = configuredTool(whichTool("div")).css({
						"width":$(window).width(),
						height:(vertical ? "400px" : theHeight),
						"background-color":"rgba(0,0,0,.9)",
						position:"absolute",
						top:(vertical? "-400px" : 0),
						left:(vertical? -10: $(window).width()/-1),
						"z-index":$("[alias=header]").css("z-index")-1,
						transition:"0.5s"

					}); 

		myDiv.resizable("destroy")

		myDiv.attr("alias","zMenuContent");

		var closeB = configuredTool(whichTool("T")).css(
				{height:"5%",color:"white",right:"50px",position:"absolute",
			width:"5%",top:$("#zMenu").offset().top,left:$(window).width()/3-parseFloat($("#zMenu").css("width"))})
				.attr("id","closeB").text("").append($("<div>",{class:"fa fa-window-close",icon:"fa-window-close"}))

		if(vertical){
			closeB.css({"left":$(myDiv).width()-parseFloat($("#zMenu").css("width"))})
		}

		$(closeB).attr("id","closeB")

		myDiv.append(closeB)	

		$("body").append(myDiv)

		closeB.css({"font-size":$("#zMenu").css("font-size")})
		
		var id = "#" + $(closeB).attr("id");

		var jsString = `$("${id}").on("click",closeMenu)`;
		
		if(getJs($(closeB)) == null){
			eval(jsString)
		}
	
		saveJs($(closeB),jsString);

	

		

	} 

	$("#closeB").show();

	if(myDiv.draggable( "instance" )){

		myDiv.draggable("disable");
	}
	
	
	console.log("Sliding time!")

	var pTransition = getTransitionDuration( myDiv, true );


	myDiv.show()

	
	if(vertical){
		myDiv.css({
		"width":$(window).width(),
		height:(vertical ? "400px" : theHeight),
		
		position:"absolute",
		top:(vertical? "-400px" : 0),
		left:(vertical? 0: $("[alias=theCanvas]").width()/-1)
		})

		$("#closeB").css({position:"absolute",top:$("#zMenu").offset().top,left:$(window).width()-parseFloat($("#zMenu").css("font-size"))*2})

		myDiv.css({"position":"absolute",top:($("#zMenu").height() * 1.5 + $("#zMenu").offset().top )})

		

		$("[alias=theCanvas]").css("transition","0.5s").css("top","+=" + (myDiv.height()+5));
		//Move all content to make space

		//CUSTOM_PXTO_VIEWPORT($(myDiv),$(myDiv).position().left ,$(myDiv).position().top);
		
		//If moving left to right
	}else {
		myDiv.css({
		"width":$(window).width(),
		height:(vertical ? "400px" : theHeight),
		
		position:"absolute",
		top:(vertical? "-400px" : 0),
		left:(vertical? 0: $(window).width()/-1)
		})

		$("#closeB").css({position:"absolute",top:$("#zMenu").offset().top,left:$(myDiv).width()-parseFloat($("#zMenu").css("width"))})
				

		myDiv.css({left:0,width:$(window).width()/3})
	}
	




	if(!editing && !vertical){
		myDiv.css({height:winHeight})
	}

	/*
	if(!$.hasData($("#closeB"))){
		$("#closeB").on("click",function(){
			closeMenu();
		})
	}*/

	myDiv.find(".dropped-object").each(function(i,child){
		child = $(child);
		if(!$.hasData(child)){
			child.on("click",closeMenu)
		}
	})

	//CUSTOM_PXTO_VIEWPORT($("#closeB"),$("#closeB").position().left ,$("#closeB").position().top);
	CUSTOM_PXTO_VIEWPORT($(closeB),$(closeB).position().left ,$(closeB).position().top);


	$(".responsive-design-tab").hide();

/*
	$("[alias=zMenuContent]").children().each(function(c){
		$(c).css({left:$(c).attr("orig-left")});
	})*/

	//$(myDiv).css({position:"absolute",top:0, left:0,"z-Index":"1000000","backgroundColor":"pink"}).attr("id","bobby")

}


$(window).on("orientationchange",function(){
	closeMenu();
})


function closeMenu(vertical){

	$("#zMenu").attr("open",false);

	if(typeof vertical == "object"){

		//Do nothing this is event object
	} else {
		
			//dont' overwrite and use user value passed in as boolean paramter
		

	}

	//Try to override with user value, otherwise set to false
	if($("#zMenu").attr("slider-direction")){
		vertical = $("#zMenu").attr("slider-direction").trim() == "left"? false : true;
	}

	if(vertical){
		$("[alias=zMenuContent]").css({top:$("[alias=zMenuContent]").height()/-1})
		$("[alias=theCanvas]").css("top",0);
	} else {
		$("[alias=zMenuContent]").css({left:$("[alias=zMenuContent]").width()/-1})	
	}

	//Do transition end stuff
	if($("[alias=zMenuContent]").data() && !$("[alias=zMenuContent]").data().transitionendKey){

		$("[alias=zMenuContent]").data().transitionendKey = "set";

		$("[alias=zMenuContent]").on("transitionend",function(evnt){
			var men = $("[alias=zMenuContent]")
			if($("#zMenu").attr("open") != "open"){
				//evnt.stopPropogation();
				CUSTOM_PXTO_VIEWPORT($(men),$(men).position().left ,$(men).position().top);
				$(this).hide();
			} 
		})

	}

	
	
	
	$("#closeB").hide();

	drawResponsiveTab();
	
	
}


/**
*  Which Tool do we want to instantiate based on User Input
*/
function whichTool (tool){

	if(!tool)
		tool = "T";

	type = (tool).toUpperCase();

	log.trace(`User chose tool [${tool}]`);

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
		case "SITE":
		theTool = new GenericTool({
			type:type,
			droppedModeStyle:"",
			droppedModeHtml:'<div><iframe style="pointer-events:none; width:100%; height:100%" class="content-image" onmouseover="$(this).parents().first().mouseenter()" src="https://www.wikipedia.org/"></iframe></div>',
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
			droppedModeHtml:"<div contenteditable=\"false\">Enter Text Here</div>",
			class:"generictext"

		});

		break;
		case "NAVIGATION":
			theTool = new GenericTool({
			type:type,
			class:"texttool",
			friendlyName : "Navigation Menu",
			//droppedModeHtml:"<div>Enter Text Here<div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img  src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div>",
			droppedModeHtml:"<div></div>",
			class:"squarepeg list"

		});
			
		break;

		case "FIELD":
		
	
		theTool = new GenericTool({
			type:type,
			class:"texttool",
			friendlyName : "Input Field",
			droppedModeHtml:"<div class='group-container  helper-wrapper'><div class='dropped-object' type='T'>Field Label</div><div class='dropped-object field-container' type='DIV'><input  width='100%' height='100%' type=\"input\" placeholder=\"Enter field value\"></div></div>"
		});
		break;

		default:
		

		//<div type="MENU-ITEM" id="ELEM_1491749916155-0" item="ELEM_1491749916155-0" style="display: inline-block; padding-left: 20px;"><div type="MENU-ITEM-TXT" edittxt="Modeis" style="display:inline-block">Modeis</div></div>	
	
		theTool = new GenericTool({
			type:type,
			class:"texttool",
			friendlyName : "generic",
			droppedModeHtml:`<${type} width="100%" height="100%" type="${type}"></${type}>`,
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
	this.droppedModeHtml="<div><div class=\"toolhotspot\"><div class=\"hotspot css\"><img src=\"http://www.fancyicons.com/free-icons/153/cute-file-extension/png/256/css_256.png\"></div><div class=\"hotspot js\"><img   src=\"http://www.seoexpresso.com/wp-content/uploads/2014/11/javascript.png\"></div></div></div>";
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

		var div = setUpDiv(this.node)

		if(div.attr("type") == "FIELD"){
			div.find(".dropped-object").each(function(idx,n){
				n = $(n);
				console.log("ID IS " + $(div).attr("id"))
				if(n.is("[type=T]")){
					n.attr("id",div.attr("id")+ "-label")
				} else {
					n.attr("id",div.attr("id")+ "-control")
					n.find("input").attr("id", div.attr("id") + "inputField");
				}

				setUpDiv($(n));
			})
		}

		if(!options.droppable){
			$(this.node).removeClass("ui-droppable").droppable("destroy")
		}
		//Note: since node has not been added to document, it can does not have a width or height yet
		return this.node;
	}
	
}







