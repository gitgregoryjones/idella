
var DRAWSPACE_hoveringOverEditWindow = false;
var DRAW_SPACE_advancedShowing = false;

var editSpaceCoords = {}

$(document).on("initializationComplete",function(){

	//$(document).on("scroll",function(){ if(!editing){$("[type=OVERLAY]").hide();}})

	DRAW_SPACE_addWorkSpaceToBody();

})

function DRAW_SPACE_showSettings(){

	NOTES_delete();

	editSpaceCoords = {top:$("#editSpace").offset().top, height:$("#editSpace").height()}

	$("#editSpace > a").hide();

	$("#editSpace [aria-hidden=false] ").addClass("showme").hide()
	
	left = $(".rocket-settings").offset().left

	$(".tabul > li").not(".rocket-settings").hide();

	$(".rocket-settings").css({left:left})

	$(".setarea").load("/settings.html");

	$("#editSpace").animate({height:$(document).height(),top:10},function(){
		//$("#drawSpace").hide();
		
	})

}

function DRAW_SPACE_hideSettings(){

	$("#editSpace").animate(editSpaceCoords,function(){
			$(".rocket-settings").css({left:0})
			$(".setarea").html("");
			$(".tabul > li").show();
			$("#editSpace > a").show();
			$(".tabul > li.extendedTabs").hide();
			$(".showme").removeClass("showme").show()
	})
	
}
/*
function DRAW_SPACE_hideSettings2(){

	$("#editSpace > #settings").remove();

	DRAW_SPACE_deleteWorkspaceFromBody();

	DRAW_SPACE_addWorkSpaceToBody()
	
}*/


function DRAW_SPACE_getMaxTopElement(){
	var lastOne = [];

	$(".dropped-object").each(function(idx,it){
		lastOne.push($(this).offset().top + $(this).height());
	})

	return lastOne.sort().reverse()[0]
}

function DRAW_SPACE_isEditing(){

	return DRAWSPACE_hoveringOverEditWindow;
}
   
function DRAW_SPACE_deleteWorkspaceFromBody(){

	workspace = $("#workspace");

	removeEditMode();

	$("body").append($("#drawSpace").children())

	$(workspace).remove();

	$("[type=VID],[type=PLUGIN]").each(function(id,div){
		var vid = $(div).find("video")[0];
		startVideo(vid);
	})

	top = DRAW_SPACE_getMaxTopElement();

	$("body").css({height:top})

	return $("body");


}

function getHelp(url){

	NOTES_delete();

	SAVE_okToSave = false;

	$("#help-css").remove();

	var tools = {}

	$("#drawSpace > .dropped-object").not(":hidden").addClass("hideMe").hide()

	if(!url){
		url = "http://cssreference.io/";
	} 

	if($("#help-css").length > 0){

		tools.frame = $("#help-css")

		tools.frame.attr("src",url)

	} else {

		tools.frame = $('<iframe id="help-css" src="'+url+'" width="100%" height="100%"></iframe>').css({display:"none",position:"absolute",top:"0px",left:"0px","z-index":"10000"})

		tools.close = $('<div id="close-help" class="fa fa-window-close"></div>')
				.css({display:"none",cursor:"pointer",position:"absolute",top:"10px","right":"10px",
					"font-size":"40px",color:"red","z-index":"3000000"})
				.on('click',function(){
					$("#help-css").remove();
					$(this).remove();
					SAVE_okToSave = true;
					
					$(".hideMe").removeClass("hideMe").show()

				})

		tools.sponsor = $('<div id="sponsor-help" class="fa fa-bullhorn"></div>')
				.css({"background-color":"#FFFFFF",width:"200px",height:"60px",display:"none",cursor:"pointer",position:"absolute",top:"10px","left":"20px",
					"font-size":"80px",color:"green","z-index":"3000000"})
				.on('click',function(){
					$("#help-css").remove();
					
					$("#sponsor-help").remove();
					$(this).remove();
					SAVE_okToSave = true;
				})

		if($("#drawSpace").length > 0){
			$("#drawSpace").append($(tools.frame).fadeIn(1000))
			$("#drawSpace").append(tools.close.fadeIn(1000));
			//$("#drawSpace").append(tools.sponsor.fadeIn(1000));
		}
	} 

	return tools;

}

function DRAW_SPACE_addWorkSpaceToBody(){

	NOTES_delete();

	body = $("body")

	var wp = $("<div>",{id:"workspace",type:"workspace"}) ;

	var ds = $("<div>",{id:"drawSpace",class:"dropped-object",type:"canvas"})
	var es = $("<div>",{id:"editSpace"}).append('<div id="tabs"><ul class="tabul"></ul></div>');
	

	ds.append(body.children());

	

	wp.append(ds);
	wp.append(es)

	$(body).append(wp);



	wp.css({
		height:window.innerHeight,
		width:"100%"
	})

	ds.css({
		height:$(wp).height() * .75,
		width:"100%",
		"overflow-y":"scroll",
		"overflow-x":"hidden",
		position:"absolute",
		"background-image":"url(https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Cartesian_5mm..svg/2000px-Cartesian_5mm..svg.png)",
		"background-image":"url(https://1.bp.blogspot.com/-J2JBT--3ssc/T6GusOoFtJI/AAAAAAAAAdg/bjmtYbAP6oE/s1600/pattern-dots-square-grid-01_xxl.png)",
		"background-image":"url(http://udel.edu/~spfefer/website/dotgrid.png)",
		
		
		"background-repeat":"repeat"
	})

	es.css({
		height:$(wp).height() *.25,
		width:"100%",
		top:$(ds).height(),
		position:"absolute",
		"z-index": 999999999,
		border:"3px solid yellow"
		
	}).show().on("mouseenter",function(){
				if($(".active-message").is(":visible")){
					//alert("visible " + $(".active-message").attr("msg-parent"))
					$("#" + $(".active-message").attr("msg-parent")).trigger("mouseenter");
				}
			})


	body = $("body");

	body.id = "body";

	ds.scroll(function(){
		//Kill any notes
		NOTES_delete()
	 })

	$("[type=VID]").each(function(id,div){
		var vid = $(div).find("video")[0];
		startVideo(vid);
	})

	if($(".dropped-object").length <= 1){

		//create starter template
		theExpandableArea = configuredTool(whichTool("LIST"));
		theExpandableArea.css({"width":"100%",height:"1000px","background-color":"transparent","font-family":"avenir-next-rounded-std-med"}).attr('alias',"theCanvas")
		dropTool(theExpandableArea,{target:ds,clientX:0,clientY:0});

		theNotice = configuredTool(whichTool("DIV"));
                     
        theNotice.css({"width":"100%",height:"50px","background-color":"yellow"}).attr('alias',"notification")
                               
        dropTool(theNotice,{target:theExpandableArea,clientX:0,clientY:0});

		//Make empty page
		theHead = configuredTool(whichTool("DIV"));
                     
        theHead.css({"width":"100%",height:"100px","background-color":"white"}).attr('alias',"header")
                               
        dropTool(theHead,{target:theExpandableArea,clientX:0,clientY:theNotice.height()});

        //#F2F6F9

        theBody = configuredTool(whichTool("DIV"));
                     
        theBody.css({"width":"100%",height:"750px","background-color":"#F2F6F9"}).attr('alias',"body")
                               
        dropTool(theBody,{target:theExpandableArea,clientX:0,clientY:parseFloat(theHead.offset().top) + parseFloat(theHead.height())});

        theImage = configuredTool(whichTool("IMG"));
                     
        theImage.css({"width":"550px",height:"350px"}).attr('alias',"bigPicture")
                               
        dropTool(theImage,{target:theBody,clientX:50,clientY:50});

        theFooter = configuredTool(whichTool("DIV"));
                     
        theFooter.css({"width":"100%",height:"350px","background-color":"grey"}).attr('alias',"footer")
                               
        dropTool(theFooter,{target:theExpandableArea,clientX:0,clientY:parseFloat(theHead.offset().top) + parseFloat(theHead.height())});
		
		//getHelp();
	}

	top = DRAW_SPACE_getMaxTopElement();

	top = top > $("body").height() ? top *1.25 : $("body").height() ;

	//$("body").css({height:top})

	addEditMode()


	$(".responsive-design-tab").on("click",makeOrBreakpoint)

	$(window).on('resize',drawResponsiveTab)

	if(CUSTOM_currentlyMousingOverElementId == null){
		writeTabs(body)
	} else {
		writeTabs($("#"+CUSTOM_currentlyMousingOverElementId));
		STYLESTABS_forceRewrite = true;
		NOTES_makeNote($("#drawSpace").children(".dropped-object").first())
	}

	$("#tabs").append('<div class="setarea"></div>')



	$(".mini-responsive-design-tab").on('click',makeOrBreakpoint)

	$(".rocket-save").on('click',function(){

		if(website == "default"){
			text = prompt("Please enter a name for your new site")
			if(text && text.trim().length > 0){
				$('title').text(text);
				theSiteObj.name = text;
				SAVEJS_goInactive()
			}
		} else {
			SAVEJS_goInactive()
		}
	});



	drawResponsiveTab()

	//$("#tabs").css("height","100%")

}

/**
* Needed because some browsers have race conditions
* http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
*/
function startVideo(vid){
	setTimeout(function () {      
	  // Resume play if the element if is paused.
	  if (vid && vid.paused) {
	    vid.play();
	  }
	}, 150);	
}



