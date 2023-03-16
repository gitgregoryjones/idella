
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

	$("#editSpace").animate({height:$(document).height(),top:0},function(){
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
	//Defined in layer-menu.js
	
	

	if(copyForSave){
		//Attempt background save by copying all contents to buffer and saving
		
		NOTES_delete();
		
		html = $("html").clone();

		html.find("#content").css("left",0).css("top",0).css("width","100%");

		var contentCopy = html.find("#content");

		PREVIEW_makeSaveableView(contentCopy);

		contentCopy.attr("id","contentCopyFor-" + $("#content")[0].id);

		var offScreenSaveableParent = contentCopy.parent();

		$("#content").parent().append(contentCopy);		

		//contentCopy.css({left:0,top:0})
		

		shrinkOrGrowParent(contentCopy,false);

		offScreenSaveableParent.append(contentCopy);

		//Now find any styles or JS that needs to be preserved for the copies
		var copiedStyles = $("#pageStylesCopy").clone();

		$("#pageStylesCopy").html("");

		html.find("#pageStyles").html(copiedStyles.html());

		delete copiedStyles;

	
		//html.append($("html").children())
		html.find("body").append(html.find("#drawSpace").children())
		html.find("#workspace").remove();
		html.find("#editSpace").remove();
		html.find("#drawSpace").remove();
		//html.find("body").append(ds.children());

		//DRAW_SPACE_addWorkSpaceToBody()
		PREVIEW_makeSaveableView(html);

		html.find("body").addClass("hover").addClass("hover");

		html.html(html.html().replace(/contentCopyFor-/g,""));
		return html;


	} else {

		//Cover Up
		;
		//return;

		

			
		
			$("#content").css("left",0).css("top",0).css("width","100%");	

			shrinkOrGrowParent($("#content"),false);

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

			var close = $(`<i id="close-button" class="fas fa-compress-alt"></i>`);

			close.css({
			    position: "absolute",
			    top: 30,
			    left: 220,
			    width: 33,
			    height: 33,
			    zIndex: 1000,
			    color: "green",
			    backgroundColor: "green",
			    
			    borderRadius: "50%",
			   fontSize:"x-large",
			    
			    textAlign:"center",
			    border:"2px solid silver"
			})

			close.off().on("click",function(evt){ 
				$(evt.target).css({filter:"contrast(200%)"})
				$("#bigDipper").show(1000,function(){
					$(this).remove(); 
					PREVIEW_togglePreview(false)

				});
				
			});

			
			close.hover(function(){
				$(this).css({color:"black", transition:".3s","cursor":"pointer",opacity:1})
			},
			function(){
				$(this).css({color:"green",opacity:"0.4"})
			}
			)

			$("#content").append(close);

			
			top = DRAW_SPACE_getMaxTopElement();
					
			$("#bigDipper").hide();

	
		

	}

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

		tools.frame = $('<iframe id="help-css" src="'+url+'" ></iframe>').css({display:"none",position:"absolute",top:$("#idella-search").outerHeight(),left:$(".babynav").outerWidth(),"z-index":$("content").css("z-index")+1,height:"2000px",width:$("#content").outerWidth()})

		/*
		tools.close = $(`<div  id="close-button" >X<div style="font-size:14px">Close</div></div>`);

		tools.close.css({
			    position: "absolute",
			    top: 0,
			    left: screen.width - 250,
			    width: 60,
			    height: 60,
			    zIndex: 100010000000,
			    color: "white",
			    backgroundColor: "silver",
			    paddingLeft: 4,
			    paddingTop: 10,
			    borderRadius: "5px",
			    top: "10px",
			    fontWeight:800,
			    textAlign:"center",
			    boxShadow:"2px 2px solid black"

		}).on('click',function(){
					$("#help-css").remove();
					$(this).remove();
					SAVE_okToSave = true;
					
					$(".hideMe").removeClass("hideMe").show()

				})*/

		tools.sponsor = $('<div id="sponsor-help" class="fa fa-bullhorn"></div>')
				.css({"background-color":"#FFFFFF",width:"200px",height:"60px",display:"none",cursor:"pointer",position:"absolute",top:"10px","left":"20px",
					"font-size":"80px",color:"green","z-index":"3000000000"})
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

	SAVE_okToSave = false;
	bn = $("<div class='HelpClose'>Click Here to Continue Editing</div>").css({"font-weight":800,"font-size":"2vw", "padding-top":"10px","z-index":10000000000,color:"black","text-align":"center","font-family":"Helvitica",width:$("#content").outerWidth(), height:"60px", position:"fixed", "background-color":"yellow", left:$(".babynav").outerWidth(), top:$("#idella-search").outerHeight()});
	$("#idella-search").append(bn)
	$(".babynav").fadeOut();
	$(".project-control").fadeOut();
	$("#content").fadeOut();
	bn.off().on("click",function(){

		$("#help-css").remove();
					
					SAVE_okToSave = true;
					$(".HelpClose").remove();
					$(".babynav").fadeIn();
					$(".project-control").fadeIn();
					$("#content").fadeIn();

	})

	return tools;

}


function DRAW_SPACE_addWorkSpaceToBody(){

	NOTES_delete();

	content = $("body");

	$("#close-button").remove();

	//Defined in layer-menu.js
	var theHeight = $("#layer-menu").height();

	if(theHeight > 0){
		//The menu on the edit screen is expanded. Shrink content to fit the edit window again
		shrinkOrGrowParent($("#content"),true);
	} else {
		//Do nothing.  Return contents full expanded since the user is working in zoomed in mode
	}
	
	$("#content").css("left","6em").css("top","6em");

	//body.children().last().remove();

	var wp = $("<div>",{id:"workspace",type:"workspace"}) ;

	var ds = $("<div>",{id:"drawSpace",class:"dropped-object",type:"canvas"})

	var es = $("<div>",{id:"editSpace"}).append('<div id="tabs"><ul class="tabul"></ul></div>');

	//$(ds).append(content);


	//ds.append(body.children());

	//wp.append(ds);

	//wp.append(es)

	


	wp.css({
		height:window.innerHeight,
		width:$(window).width()
	})

	ds.css({
		height:$(wp).height() * .7,
		width:$(window).width(),
		"overflow-y":"scroll",
		"overflow-x":"hidden",
		position:"absolute",
		"background-image":"url(/dotgrid.png)",
		
		
		"background-repeat":"repeat"
	})


	es.css({
		height:"30%",
		"---width":400,
		top:100,
		position:"absolute",
		"z-index": 9999999,
		"--border":"3px solid white",
		"--box-shadow":"2px 2px 2px black",
		"--border-radius":"5px",
		overflow:"none"
		

		
	}).show().unbind("mousenter").on("mouseenter",function(){
				 
				 $(document).off("keydown")

				 $(".custom-menu").hide(100);

				 OVERRIDE_CTX_MENU = false;

				if($(".active-message").is(":visible")){
					//alert("visible " + $(".active-message").attr("msg-parent"))
					$("#" + $(".active-message").attr("msg-parent")).trigger("mouseenter");
				}

			}).unbind("mouseleave").on("mouseleave",function(){
				$(document).off("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)

				OVERRIDE_CTX_MENU = true;
				
				//$("#drawSpace").css({height:$(document).height()});
		        //$("#editSpace").css("transtion-duration","0.6s").fadeOut();
		        //$("*").removeClass("disabledElements").removeClass("submenu_on")
		        //SAVE_okToSave=true;
				//CUSTOM_pressEscapeKey()
				//console.log("Pressed escape key");
				
			})


	body = $("body");

	body.id = "body";


	//body.append(content);
	body.append(es.hide());

	body.css({width:"100%"})

	/*
	ds.scroll(function(){
		//Kill any notes
		NOTES_delete()
	 })

	*/
	$("[type=VID]").each(function(id,div){
		var vid = $(div).find("video")[0];
		startVideo(vid);
	})

	/*

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

        console.log(`Number of footers is ${$("[alias=footer]").length}`);

        theFooter = configuredTool(whichTool("DIV"));
                     
        
                               
        dropTool(theFooter,{target:theExpandableArea,clientX:0,clientY:0});

        theFooter.css({"width":$(document).outerWidth(),height:"350px","background-color":"grey"}).attr('alias',"footer")
		
        console.log(`Number of footers is now ${$("[alias=footer]").length}`);

        theNotice.css({"width":"100%",height:"25%","background-color":"yellow"}).attr('alias',"notification")
                        
        //dropTool(theNotice,{target:theBody,clientX:0,clientY:0});
        console.log(`Number of headers is ${$("[alias=header]").length}`);

		  //Make empty page
		
		theHead = configuredTool(whichTool("DIV"));
                                            
        dropTool(theHead,{target:theBody,clientX:0,clientY:theNotice.height()});
     
		//Now Setup the head
		theHead.css({"position":"fixed","width":$(document).outerWidth(),height:"15%","background-color":"black",top:theNotice.height()}).attr('alias',"header")


			//$("[alias=header]").appendTo($("[alias=body]"))
		    //.css({"overflow":"hidden","z-index":CUSTOM_incrementZIndex(),top:$("[alias=notification]").height()})

			//getHelp();
		

		 console.log(`Number of headers is now ${$("[alias=header]").length}`);

	} 

	*/

	//$("[alias=body]").css("z-index",400)
	

	/*
  
	$("[alias=notification]").appendTo($("[alias=body]"))
	    .css({overflow:"hidden","position":"fixed",zheight:"100px","z-index":CUSTOM_incrementZIndex(),top:0})

	*/
    //$("[alias=notification]").css({"height":"100px"})
    

	addEditMode()

	DRAW_SPACE_advancedShowing = false;
			userHoveringOverNote = false;
	$("#drawSpace").css({height:$(document).height()});
    $("#editSpace").css("transtion-duration","0.6s").fadeOut();
    $("*").removeClass("disabledElements").removeClass("submenu_on")
    SAVE_okToSave=true;
			//CUSTOM_pressEscapeKey()
	log.debug("Pressed escape key");


	$(".responsive-design-tab").on("click",makeOrBreakpoint)

	$(window).off("resize").on('resize',drawResponsiveTab)

	$("#tabs").append('<div class="setarea"></div>')
	
	if(CUSTOM_currentlyMousingOverElementId == null){
		CUSTOM_currentlyMousingOverElementId = $(".dropped-object").not("#drawSpace,[alias=theCanvas]").first().attr("id");
	   //CUSTOM_currentlyMousingOverElementId = $("#content").addClass("dropped-object");
		
		_localElem = writeTabs(CUSTOM_currentlyMousingOverElementId,true)
		//NOTES_makeNote($("#"+_localElem))

	} else {
		STYLESTABS_forceRewrite = true;

		 _localElem = writeTabs($("#"+CUSTOM_currentlyMousingOverElementId),true);
		
		//NOTES_makeNote($("#"+_localElem))
	}

	//NOTES_makeNote($("#"+CUSTOM_currentlyMousingOverElementId))




	$(".mini-responsive-design-tab").off("click").on('click',makeOrBreakpoint)

	

	userHoveringOverNote = false;
	drawResponsiveTab()

	/*
	var sliderp = $("<div id='sliderp'></div>").css("width","400px");
	
	$("#editSpace").prepend(sliderp);

	*/

	var origWidth = $("[alias=theCanvas]").width();
	var origHeight = $("[alias=theCanvas]").height();

	var target = {};

	target.target = $("#content").first();

	target.stopPropagation = function(){

	}

	target.preventDefault = function(){

	}
	/*
    $( "#sliderp" ).slider({value:100}).off("slide").on('slide',function(event,ui){
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
	*/
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



