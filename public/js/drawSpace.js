
var DRAWSPACE_hoveringOverEditWindow = false;
var DRAW_SPACE_advancedShowing = false;

var editSpaceCoords = {}

//Always Execute This function
$(document).ready(function(){

	$("[alias=notification]").on("click",function(){
	 		$("[alias=header]").animate({"top":0},"slow")
	 		$("[alias=theCanvas]").animate({"top":0},"slow")
        	$(this).animate({height:"0"},"slow")
        	if(!editing){
        			localStorage.setItem($(this).text().replace(" ",""),$(this).text());
        	}
     })

	key = $("[alias=notification").text();

	ack = localStorage.getItem(key.replace(" ",""));

    if(ack){
		//alert(editing)
		if(!editing){
			$("[alias=notification]").css({"height":0})
			//$("[alias=notification]").click()
			$("[alias=header]").css({"top":0})
	 		$("[alias=theCanvas]").css({"top":0})
   
		}
	} else {
		$("[alias=notification]").css({height:"400px",top:0})
		$("[alias=header]").css({top:$("[alias=notification]").height()})
	}
	

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

	$("#editSpace").animate({height:$(document).height(),top:20},function(){
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


function DRAW_SPACE_getMaxTopElement(){
	var lastOne = [];

	$(".dropped-object").each(function(idx,it){
		lastOne.push($(this).position().top + $(this).height());
	})

	return lastOne.sort().reverse()[0]
}

function DRAW_SPACE_isEditing(){

	return DRAWSPACE_hoveringOverEditWindow;
}
   
function DRAW_SPACE_deleteWorkspaceFromBody(copyForSave){

	if(copyForSave){

		NOTES_delete();

		
		html = $("html").clone();

		//html.append($("html").children())
		html.find("body").append(html.find("#drawSpace").children())
		html.find("#workspace").remove();
		html.find("#editSpace").remove();
		html.find("#drawSpace").remove();
		//html.find("body").append(ds.children());

		//DRAW_SPACE_addWorkSpaceToBody()
		PREVIEW_makeSaveableView(html);
		return html;
	}



	workspace = $("#workspace");

	removeEditMode();

	$("body").append($("#drawSpace").children())

	key = $("[alias=notification").text();

	ack = localStorage.getItem(key.replace(" ",""));

    if(ack){
		//alert(editing)
		if(!editing){
			$("[alias=notification]").css({"height":0});
			//$("[alias=notification]").click()
			$("[alias=header]").css({"top":0})
	 		$("[alias=theCanvas]").css({"top":0})
        	

			//localStorage.setItem($(this).text().replace(" ",""),$(this).text());
		}
	}

	$(workspace).remove();

	$("[type=VID],[type=PLUGIN]").each(function(id,div){
		var vid = $(div).find("video")[0];
		startVideo(vid);
	})

	top = DRAW_SPACE_getMaxTopElement();

//		$("body").css({height:"3000px"})

	



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

		tools.frame = $('<iframe id="help-css" src="'+url+'" ></iframe>').css({display:"none",position:"absolute",top:$("[alias=header]").position().top,left:"0px","z-index":"10000",height:"6000px",width:"100vw"})

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
		} else {
			$('body').append($(tools.frame).fadeIn(1000))
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
		width:$(window).width()
	})

	ds.css({
		height:$(wp).height()*.75,
		width:$(window).width(),
		"overflow-y":"scroll",
		"overflow-x":"hidden",
		position:"absolute",
		"background-image":"url(https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Cartesian_5mm..svg/2000px-Cartesian_5mm..svg.png)",
		"background-image":"url(https://1.bp.blogspot.com/-J2JBT--3ssc/T6GusOoFtJI/AAAAAAAAAdg/bjmtYbAP6oE/s1600/pattern-dots-square-grid-01_xxl.png)",
		"background-image":"url(http://udel.edu/~spfefer/website/dotgrid.png)",
		
		
		"background-repeat":"repeat"
	})


	es.css({
		height:$(wp).height()*.25,
		width:"100%",
		top:$(ds).height(),
		position:"absolute",
		"z-index": 999999,
		border:"3px solid yellow"
		
	}).show().on("mouseenter",function(){
				 
				 $(document).off("keydown")

				if($(".active-message").is(":visible")){
					//alert("visible " + $(".active-message").attr("msg-parent"))
					$("#" + $(".active-message").attr("msg-parent")).trigger("mouseenter");
				}

			}).on("mouseleave",function(){
				$(document).off("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)
				
				$("#drawSpace").css({height:$(document).height()});
		        $("#editSpace").css("transtion-duration","0.6s").fadeOut();
		        $("*").removeClass("disabledElements").removeClass("submenu_on")
		        SAVE_okToSave=true;
				//CUSTOM_pressEscapeKey()
				console.log("Pressed escape key");
				
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
		theExpandableArea.css({"width":$(document).outerWidth(),height:"1000px","background-color":"transparent","font-family":"avenir-next-rounded-std-med"}).attr('alias',"theCanvas")
		
		dropTool(theExpandableArea,{target:ds,clientX:0,clientY:0});

		theNotice = configuredTool(whichTool("DIV"));
       
		
        //#F2F6F9

        theBody = configuredTool(whichTool("DIV"));
                     
        theBody.css({"width":$(document).outerWidth(),height:"750px","background-color":"#F2F6F9"}).attr('alias',"body")
                               
        dropTool(theBody,{target:theExpandableArea,clientX:0,clientY:0});

      
        theImage = configuredTool(whichTool("IMG"));
                     
        //theImage.css({"width":"337px",height:"134px"}).attr('alias',"bigPicture")

                               
        dropTool(theImage,{target:theBody,clientX:theBody.offset().left + 50,clientY:theBody.offset().top + 250});

        theFooter = configuredTool(whichTool("DIV"));
                     
        theFooter.css({"width":$(document).outerWidth(),height:"350px","background-color":"grey"}).attr('alias',"footer")
                               
        dropTool(theFooter,{target:theExpandableArea,clientX:0,clientY:0});
		
        theNotice.css({"width":"100%",height:"25%","background-color":"yellow"}).attr('alias',"notification")
                        
        //dropTool(theNotice,{target:theBody,clientX:0,clientY:0});

		  //Make empty page
		theHead = configuredTool(whichTool("DIV"));
                                            
        dropTool(theHead,{target:theBody,clientX:0,clientY:theNotice.height()});
     
		//Now Setup the head
		theHead.css({"position":"fixed","width":$(document).outerWidth(),height:"15%","background-color":"black",top:theNotice.height()}).attr('alias',"header")
		//getHelp();


	} 

	$("[alias=body]").css("z-index",400)
	

  
	$("[alias=notification]").appendTo($("[alias=body]"))
	    .css({overflow:"hidden","position":"fixed",zheight:"100px","z-index":CUSTOM_incrementZIndex(),top:0})
	
	$("[alias=header]").appendTo($("[alias=body]"))
    .css({"overflow":"hidden","z-index":CUSTOM_incrementZIndex(),top:$("[alias=notification]").height()})

    //$("[alias=notification]").css({"height":"100px"})
    

	addEditMode()

		DRAW_SPACE_advancedShowing = false;
				userHoveringOverNote = false;
				   $("#drawSpace").css({height:$(document).height()});
        $("#editSpace").css("transtion-duration","0.6s").fadeOut();
        $("*").removeClass("disabledElements").removeClass("submenu_on")
        SAVE_okToSave=true;
				//CUSTOM_pressEscapeKey()
				console.log("Pressed escape key");


	$(".responsive-design-tab").on("click",makeOrBreakpoint)

	$(window).on('resize',drawResponsiveTab)

	$("#tabs").append('<div class="setarea"></div>')
	
	if(CUSTOM_currentlyMousingOverElementId == null){
		CUSTOM_currentlyMousingOverElementId = $(".dropped-object").not("#drawSpace,[alias=theCanvas]").first().attr("id");
	
		
		_localElem = writeTabs(CUSTOM_currentlyMousingOverElementId,true)
		//NOTES_makeNote($("#"+_localElem))

	} else {
		STYLESTABS_forceRewrite = true;

		 _localElem = writeTabs($("#"+CUSTOM_currentlyMousingOverElementId),true);
		
		//NOTES_makeNote($("#"+_localElem))
	}

	//NOTES_makeNote($("#"+CUSTOM_currentlyMousingOverElementId))




	$(".mini-responsive-design-tab").on('click',makeOrBreakpoint)

	

	userHoveringOverNote = false;
	drawResponsiveTab()

	var sliderp = $("<div id='sliderp'></div>").css("width","400px");
	
	$("#editSpace").prepend(sliderp);



	var origWidth = $("[alias=theCanvas]").width();
	var origHeight = $("[alias=theCanvas]").height();

	var target = {};

	target.target = $("#drawSpace").first();

	target.stopPropagation = function(){

	}

	target.preventDefault = function(){

	}

    $( "#sliderp" ).slider({value:100}).on('slide',function(event,ui){
    	//console.log("This is it ");
    	//console.log(ui);
    	//console.log((ui.value/100) * origWidth)
    	//$("#drawSpace").css("width",(ui.value/100) * origWidth);
    	//$("#drawSpace").css("width",(ui.value/100) * origWidth);
    	
    

		ui = {
			size :{
				height:  (ui.value/100) * origHeight,
				width:(ui.value/100) * origWidth

				
			},
			position :{
				left:$("[alias=theCanvas]").position().left,
				top:$("[alias=theCanvas]").position().top
			},
			originalSize : {
				height: origHeight,
				width: origWidth

			},
			originalPosition : {
				left:$("[alias=theCanvas]").position().left,
				top:$("[alias=theCanvas]").position().top,
			}
		}



    	CUSTOM_ON_RESIZE_LOGIC(target,ui);
    });

    //Hide Expanded Menu until we need it
    
	//$("#tabs").css("height","100%")

}

/**
* Needed because some browsers have race conditions
* http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
*/
function startVideo(vid){
	setTimeout(function () {      
	  // Resume play if the element if is paused.
	  if (vid && vid.paused && $(vid).is(":visible")) {
	    vid.play();
	  }
	}, 150);	
}



