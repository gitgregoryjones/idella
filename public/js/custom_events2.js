var hoverOverNote = false;

var CUSTOM_currentlyMousingOverElementId = null;


var CUSTOM_lastCopyElement = null;

function CUSTOM_pressEscapeKey(){
	var e = jQuery.Event("keydown");
	e.which = 27; // # Some key code value
	$("input").trigger(e);
}


function CUSTOM_incrementZIndex(){

	var globI = 0;

	$(".dropped-object").not("[alias^=cntrl],[alias^=header]").each(function(idx,obj){

		obj = $(obj);

		if(obj.css("position") != "fixed"){
			if(parseFloat(obj.css("z-index")) > parseFloat(globI)){

				globI = parseFloat(obj.css("z-index"));
			}
		}

	})

	log.debug("CUSTOMEVENTS.js:Returing global Index globI " + globI)
	return globI;
}

CUSTOM_KEYDOWN_LOGIC = function(event){

	log.trace("Pressed Key " + event.which)

	hotObj = $("#"+CUSTOM_currentlyMousingOverElementId);
	
	if(DRAW_SPACE_advancedShowing && event.which != 27){
		log.debug("CUSTOMEVENTS.js:Ignoring Hot Key because advanced settings are showing " + event.which)
		return;
	}
	

	key = event.which;
	//Escape Key
	if(key == 27 && !DRAW_SPACE_advancedShowing){

		$(".msg,.peak,.active-message,.active-peak").remove();

		$("[data-action=fulledit]").html("Open Inspector...");
        $("#drawSpace").css({height:$(document).height()});
        $("#editSpace").html("").hide()
        $("*").removeClass("disabledElements").removeClass("submenu_on")
        SAVE_okToSave=true;
        return;        
	} else if(DRAW_SPACE_advancedShowing){

		$(".rocket-settings").click();
	}
	//if Cntrl-S or CMD-S then Save
	if( ( key == 83 && event.shiftKey ) ){
		
		
		$(".rocket-save").click()
		event.stopPropagation();
		event.preventDefault();


	//KEY C and Shift Key to COPY
	} else


	//Shift-V is Paste
	if(key == 86 && event.shiftKey && $(hotObj).hasClass("dropped-object")){
		
		$(document).trigger("contextmenu").show()
		$(".custom-menu").css("top","-3000px")
		$("[data-action=paste]").click();
		$(document).click();


	//KEY C and Shift Key to COPY
	}else if(key == 67 && event.shiftKey && $(hotObj).hasClass("dropped-object")){
	

		$(document).trigger("contextmenu").show()
		$(".custom-menu").css("top","-3000px")
		$("[data-action=copy]").click();
		$(document).click();
		//$(document).click();

		//Show Javascript Window SHIFT+J
	}else if(key == 74 && event.shiftKey){

		$(document).trigger("contextmenu").show()
		$(".custom-menu").css("top","-3000px")
		$("[data-action=javascript]").click();
		$(document).click();
		event.preventDefault()

	//if delete key
	} else if(key == 68 && event.shiftKey){
		
		NOTES_delete()
		$(document).trigger("contextmenu").show()
		$(".custom-menu").css("top","-3000px")
		$("[data-action=delete]").click();
		$(document).click();
		
	} // NO LONGER NEEDED SHIFT+T
		else if(key == 84 && event.shiftKey){
			//alert('hi')
		$(document).trigger("contextmenu")
		//Shift-R toggles draft mode
	} else if(key == 82 && event.shiftKey){
		NOTES_delete();
		//$("#id_toolset").find(".mastertools").find("img").click();
		$(document).trigger("contextmenu").show()
		$(".custom-menu").css("top","-3000px")
		$("[data-action=preview]").click();
		$(document).click();

	} else {
		log(event.which)
	}


}



CUSTOM_MOUSEENTER_LOGIC = function(event){


	
	if($(event.target).hasClass("ui-resizable-handle")){
		//alert($(event.target).parents(".dropped-object").first().attr("id"))
		$(event.target).parents(".dropped-object").first().trigger("mouseenter");
		//$(event.target).off("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
		
		return;	
	}

	//NOTES_delete()

	//enableHoverEvents();

	if(DRAW_SPACE_isEditing() ){

		event.stopPropagation()

		return;
	}
	
	var theElem = event.target;

	if($(theElem).css("cursor") == "auto"){
		$(theElem).css("cursor","pointer")
	} else if(theElem.hasAttribute("hasjs")){
		$(theElem).css("cursor","context-menu")
	}

	log.debug("Up in Here! " + theElem.id + " Is anchor = " + $(theElem).is("[type=anchor]"))


	

	if(!editing || $(".custom-menu").is(":visible") ){


		//OVERLAY_showOverlay(theElem);
	
		log.info("will not highlight element user hovers over because master tool edit mode if off ")
		log.info("theElem is ")
		log.info(theElem)
		return;
	}

	$("*").removeClass("submenu")

	if(theElem.id){



		log.debug("Entering parent " + theElem.id + " with X, Y " + $(theElem).css("left") + "," + $(theElem).css("top"))
	
		if($(theElem).is("[type=MENU]")){


			theElem = $(theElem).parent();
			log.debug("Trying to trigger T")
			log.debug(theElem.attr("id"))
			theElem.id = theElem.attr("id");
			
		}



		if($(theElem).is("[type=anchor]")){

			log.info("Changing target to dropped-object");
			//theElem = $(theElem).parents(".dropped-object").first();
			log.info(theElem)
			$(theElem).parents(".dropped-object").first().trigger('mouseenter')
			return;
		}	

		$(theElem).addClass("submenu");	

		
		if(CUSTOM_currentlyMousingOverElementId !=null){
			$(theElem).parent().trigger("mouseleave")
			
		}	
			
		CUSTOM_currentlyMousingOverElementId = theElem.id;	

		log.debug("making note for " + CUSTOM_currentlyMousingOverElementId)




		NOTES_delayShowingNote(theElem);
		//Render popup note above element
		//NOTES_makeNote(event.target)

	} else {
		log.debug("Entering bad child bad node")
		$(".dropped-object").not(event.target).removeClass("submenu")
		$(event.target).parents().first().trigger("mouseenter")
		return;
	}
}

CUSTOM_MOUSELEAVE_LOGIC = function(event){

	//event.stopPropagation();


	log.debug("Leaving LOGIC ")
	log.debug(event.target)
	if(!event.target.id){
		log.warn("CUSTOMEVENTS2.js: Bad Node Encountered-->\n " + $(event.target).html())
		$(event.target).removeClass("submenu")
		$(event.target).parents().removeClass("submenu")
		$(event.target).parents(".dropped-object").first().trigger("mouseleave")
	} else {
		$("#"+event.target.id).removeClass("submenu")

		//$(event.target).parents(".dropped-object").first().trigger("mouseenter")
	}

}


_DEFAULT_OPEN_CODE = function(event,ui){
	SAVE_okToSave = false;
	$(document).unbind("keydown");

}

_DEFAULT_CLOSE_CODE = function(event,ui){
	SAVE_okToSave = true;
	log.debug("CUSTOMEVENTS.js:Closing the window")
	log($(event.target).data())
	parent = $(event.target).data().theClickedElement;
	log(parent)

	if(copiesModified){
		$("[extends='"+$(parent).attr("id")+ "']").not($(parent)).each(function(idx,copy){
			CUSTOM_PXTO_VIEWPORT($(copy),$(copy).position().left ,$(copy).position().top);
		})
	}
	copiesModified = false;

	$(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
	$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)

}

/*
*  Call back executed when user click JS button
*  
*/
CUSTOM_JS_OPEN_CODE = function(event,ui){

	NOTES_delete();

	userHoveringOverNote = true;

	$(document).unbind("keydown");

	//Add Default Title...Other funcs override this if user clicks on draggable shape
	$(event.target).dialog("option","title","Global JS");

	$(event.target).find("#error_area").val("")
	
	exampleFunc = "//Enter Global JS below";

	elem = $("#"+CUSTOM_currentlyMousingOverElementId);

	//if global window just display empty window
	if(elem.attr("id") != "id_toolset"){

		exampleFunc = "$(\"#"+elem.attr("id") + "\").on(\"click\",\n\tfunction(event){\n\t\t\/\/Enter Code Below\n\n\t}\n)";
	}

	log(exampleFunc)

	
	log.debug("CUSTOMEVENTS.js:Length of area is " + $(this).find("#user_area").val().trim().length)

	//Get Persisted JS from Server

	js = getJs(elem);

	if(js == null || js.trim().length == 0){

		$("#user_area").val(exampleFunc)

	} else {
		$("#user_area").val(js);	
	}

	enableTextAreaTabs($("#user_area"))

	log.debug("CUSTOMEVENTS.js:Opener of Dialog is")
	log(elem)

}



CUSTOM_ON_QUICK_INPUT = function(evnt){
				//evnt.preventDefault();
				

	var parentId =  "#" + $(evnt.target).attr("parent");

	var parent = $(parentId);

	var label = $(evnt.target).attr("name");

			if(label == "class"){
				//do nothing.  wait until class is complete
				$(parent).addClass($(evnt.target).val())
				$(parent).attr("user-classes",$(event.target).val())	
			}else if(label == "src" || label == "align"){

				$(parent).find(".content-image").attr(label,$(evnt.target).val())
				//https://www.uvm.edu/~bnelson/computer/html/wrappingtextaroundimages.html
				if(label == "align"){
					$(parent).find("br").attr(clear,$(evnt.target).val())
				}
				

			}else if(label.startsWith("font") || label.startsWith("text")){
				$(parent).css(label,$(evnt.target).val())
                // $(parent).find("[type]").css(label,$(evnt.target).val())  
            }else if(label == "color"){
					$(parent).css("-webkit-text-fill-color",$(evnt.target).val())
					
					$(parent).find("[type]").css("-webkit-text-fill-color",$(evnt.target).val())

			}  else if(label == "background-image" && !($(evnt.target).val().startsWith("url(")) ){

                        theValue = "url(" + $(evnt.target).val() + ")"

                        $(parent).css(label,theValue)

                        $(parent).css("background-size","cover")

                    
				
			} else {

				//if this is a custom css option. ie how we define components, write as attribute
				if(!$(parent).css(label)){
					$(parent).attr(label,$(evnt.target).val())
				} else {
				$(parent).css(label,$(evnt.target).val())
				//if this is a custom css option. ie how we define components, write as attribute
				}
			}
			log.debug("CUSTOMEVENTS.js:Firing : " + label + " ==> " + $(evnt.target).val())
			log.debug("CUSTOMEVENTS.js:Webkit : " + $(parent).css("-webkit-text-fill-color"))

			if($(".changesToggle").is(":checked")){
				log.trace("Style is checked ")
				//myStyle = CONVERT_STYLE_TO_CLASS_OBJECT($(parent))
				myStyle = {}
				myStyle[label] = $(evnt.target).val()
				if(label == "color"){
					myStyle["-webkit-text-fill-color"] = $(evnt.target).val();
				}
				log.trace(myStyle)
				//delete myStyle.top;
				//delete myStyle.left;
				log.trace("I see this many copies of " + $(parent).attr("id") + " : " + $("[extends='"+$(parent).attr("id")+ "']").not($(parent)).length)
				//Any copies of this parent
				$("[extends='"+$(parent).attr("id")+ "']").not($(parent)).css(myStyle);

				//Any copies currently being edited

				//copy to others just in case we are editing a copy
				originalParentId = $(parent).attr("extends");

				$("[extends='"+originalParentId+"']").not($(parent)).css(myStyle);

				//Copy to parent in case we are editing a copy and not the parent directly
				$("#"+originalParentId).css(myStyle)

				copiesModified = true;
			}
		
	
}



CUSTOM_TXT_RESIZE = function(event,ui){
	
	if(ui && !ui.element){

		ui = $(ui)
		log.trace("Resziing and ui " + ui.attr("id") + " : " + ui.height() + " <==> " + ui.weight())
		log.trace("Up in here today " + ui.css("font-size"))
		ui.css("font-size",ui.height())
		
		w = ui.width() * (100 / document.documentElement.clientWidth);
		h = ui.height() * (100 / document.documentElement.clientWidth);


		ui.find("[resize]").css({height:h+"vw",width:w+"vw"})
		//CUSTOM_PXTO_VIEWPORT(ui,ui.position().left,ui.position().top)
		

	} else {
		ui.element.css("font-size",ui.size.height)/*
		ui.element.find("[resize]").each(function(idx,child){
			CUSTOM_PXTO_VIEWPORT(child,$(child).position().left,$(child).position().top)
		
		})*/
		w = ui.element.width() * (100 / document.documentElement.clientWidth);
		h = ui.element.height() * (100 / document.documentElement.clientWidth);

		ui.element.find("[resize]").css({height:h+"vw",width:w+"vw"})
	}
}

CUSTOM_ICON_RESIZE = function(event,ui){
	log.trace("Showing UI for CUSTOM_ICON_RESIZE")
	if(ui && !ui.element){

		ui = $(ui)
		log.trace("Up in here " + ui.css("font-size"))
		ui.css("font-size",ui.height())
		//ui.css("line-height",ui.height())
		ui.css("width",ui.height());
		CUSTOM_PXTO_VIEWPORT(ui,ui.position().left,ui.position().top)

	} else {
		ui.element.css("font-size",ui.size.height)
		//ui.element.css("line-height",ui.size.height)
		ui.size.width = ui.size.height;
	}
}

function figure(elem){
	log.trace($(elem).width() + " for id " + $(elem).attr("id"))
	return $(elem).width();
}




CUSTOM_ON_RESIZE_LOGIC = function(event,ui){


	event.stopPropagation()
	event.preventDefault();

	log.trace("Group Resize Enabled is " + groupResizeEnabled + "ID " + $(event.target).attr("id"))

	groupResizeEnabled = $("#group-resize").is(":checked")

	if(groupResizeEnabled && ui.originalSize){
		rH = ui.size.height / ui.originalSize.height 
		rW = ui.size.width / ui.originalSize.width 
		rL = ui.position.left / ui.originalPosition.left 
		rT = ui.position.top / ui.originalPosition.top 

		
		$(event.target).find("[type]").each(function(it,child){

			child = $(child)

		

			if(child.attr("original-height") && child.attr("original-width")){

				var myH = parseFloat(child.attr("original-height"))
				var myW = parseFloat(child.attr("original-width")) 
				var myT = parseFloat(child.attr("original-top"))
				var myL = parseFloat(child.attr("original-left")) 
				var LRatio = parseFloat(child.attr("left-ratio"))
				var TRatio = parseFloat(child.attr("top-ratio"))

				child.css(
					{
						height:myH * rH,
						width:myW * rW,
						left:LRatio * ui.size.width, 
						top:TRatio * ui.size.height, 
						"font-size":myH * rH
					})
				/*
				if(child.is("[type=T],[type=BTN]")){
					child.css("line-height","20px");
				} else {
				//	child.css("line-height",myH * rH)
				}
				*/
				log.debug("Line height is " + child.css("line-height"))
				//setTimeout(function(){log.debug("CUSTOMEVENTS.js:Waiting....")},2000)
				//do something
			} else {
				child.attr("original-height",child.height())
				child.attr("original-width",child.width())
				child.attr("original-top",child.position().top)
				child.attr("original-left",child.position().left)
				child.attr("left-ratio",child.position().left/ui.originalSize.width)
				child.attr("top-ratio",child.position().top/ui.originalSize.height)
			}
			

		})
	}

}

CUSTOM_ON_RESIZE_STOP_LOGIC = function(event,ui){
	log.trace("Resizing is stopped " + event.target.id)
	
	event.stopPropagation()
	event.preventDefault();

	$(event.target).removeClass("submenu");

	div = $(event.target);

	//if(div.is("[type=T]")){

	

	//}
	

	if(groupResizeEnabled){
		
	
		$(event.target).find(".dropped-object").each(function(it,child){
			child = $(child)


			log.trace("Resizing Child is stopped for " + child.attr("id"))

			child.removeAttr("original-height").removeAttr("original-width")

			CUSTOM_PXTO_VIEWPORT(child,$(child).position().left,$(child).position().top)
			//.trigger("resizestop",[$(child)])

		})
	}

	//Add border for menu-items. makes it easier for user to click and choose 
	/*
	if($(event.target).is("[menu]")){
		$(event.target).css("height",$(event.target).children("[type=MENU-ITEM]").first().height()*1.2)
	}*/
	

//if called from clone/copy cmd
		log.debug("RESIZE X IS " + $(event.target).css("left") + " Y IS " + $(event.target).css("top"))
		CUSTOM_PXTO_VIEWPORT(event.target,$(event.target).position().left,$(event.target).position().top)

		$(event.target).addClass("submenu");

		createAnchorFor(div,true)

		enableHoverEvents();

}

CUSTOM_DRAPSTOP_LOGIC = function(event,ui){
	log.debug("Triggered Done Dragging parent " + event.target.id)

	event.stopPropagation();
	

	NOTES_makeNote(event.target)

	parent = $(event.target)

	$(parent).removeClass("submenu");

	CUSTOM_PXTO_VIEWPORT($(parent),$(parent).position().left ,$(parent).position().top);
	if(copiesModified){
		$("[extends='"+$(parent).attr("id")+ "']").not($(parent)).each(function(idx,copy){
			CUSTOM_PXTO_VIEWPORT($(copy),$(copy).position().left ,$(copy).position().top);
		})
	}
	//alert("enable");
	enableHoverEvents();
	//
}

CUSTOM_DONE_NOTE_EDITING_LOGIC = function(event,ui){

	userHoveringOverNote = false;

	//log.debug("CUSTOMEVENTS.js:Triggered Done Editing Notes for parent " + $(event.target).attr("parent"))

	var parentId = $(event.target).attr("parent")

	if(!parentId){
		//alert('nothing to do ' + $(event.target).attr("parent"))
		return;
	}


	var parent = $("#"+parentId)

	if(parent.attr("href") != undefined){
		//alert('hrefs is ' + parent.attr('href'))
			var loc = parent.attr("href");
		
			if(loc.trim().length  > 0){

				createAnchorFor(parent);
		
			}
	}


   
	

	CUSTOM_PXTO_VIEWPORT($(parent),$(parent).position().left ,$(parent).position().top);
	if(copiesModified){
		$("[extends='"+$(parent).attr("id")+ "']").not($(parent)).each(function(idx,copy){
			CUSTOM_PXTO_VIEWPORT($(copy),$(copy).position().left ,$(copy).position().top);
		})
	}
	copiesModified = false;
	//bind document listener keydown again
	$(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
	$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)

	writeTabs(parent,true)

	noteShowing = false;


}

CUSTOM_CLOSE_LOGIC = function(event,ui){
	userHoveringOverNote = false;
	log.debug("CUSTOMEVENTS.js: Closing the window")
	log.debug("CUSTOMEVENTS2.js: " + $(event.target).data())
	parent = $(event.target).data().theClickedElement;
	log.debug("CUSTOMEVENTS2..js: parent is")
	log.debug(parent)
	CUSTOM_PXTO_VIEWPORT($(parent),$(parent).position().left ,$(parent).position().top);
	if(copiesModified){
		$("[extends='"+$(parent).attr("id")+ "']").not($(parent)).each(function(idx,copy){
			CUSTOM_PXTO_VIEWPORT($(copy),$(copy).position().left ,$(copy).position().top);
		})
	}
	copiesModified = false;


	//bind document listener keydown again
	$(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
	$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)


}

CUSTOM_ELEMENT_DOUBLECLICK_LOGIC = function(event){
	

			userHoveringOverNote = true;

			var oldTxtColor = "black";
			
			//disable AutoSave Temporarily
			SAVE_okToSave = false;	

			NOTES_delete()

			$.event.trigger("CUSTOM_userEditing",[])

			event.preventDefault();
			event.stopPropagation();

			if($(event.target).is("[type=IMG]")){
				log.debug("starting image upload")
				$("#fileElem").click();

				log.debug("Done uploading image")
				userHoveringOverNote = false;
				return;
			}

			
			var myParent = $(event.target);

			myParent.removeClass("submenu")

			//Test if user accidentally dblclicked menu-item or children AND correct if they did so
			if($(myParent).is("[type=MENU],[type=MENU-ITEM]")){

				log.debug("CUSTOMEVENTS.js:Overwriting event target with new target ")
				myParent = $(event.target).parents("[type=T]").first();
				log.debug("CUSTOMEVENTS.js:Making note for " + $(myParent).attr("id"))
				console.log(myParent)
				//return;
			} 

			attr = $(myParent).attr("type");


			if(attr != "T" && attr != "BTN" &&  attr != "IMG" ){

					log.debug("CUSTOMEVENTS.js:DOUBLE_CLICK cancelled " + attr )
					return;

			}

			//Temp Change Txt Color to black so user can edit against white backgrounds
			oldTxtColor = myParent.css("-webkit-text-fill-color")

			//myParent.css("-webkit-text-fill-color","black")

			$(document).unbind("keydown");

			currentTxt = "";

			log.debug("CUSTOMEVENTS.js:Parent is " + myParent.attr("id") + " parent type is " + myParent.attr("type")+ " color is "
				+myParent.css("color"))

			proto = whichTool(myParent.attr("type"));

				//retain id
			id = myParent.attr("id") && myParent.attr("id").length > 0 ? myParent.attr("id") : proto.name;
			//$(event.target).text('');
			currentNode = myParent;

			//Get Txt from Menu items so user can modify
			
			var menuItemIds = [];

			var menuOptionsIds = [];

			var newMenuItemIds = [];

			var newMenuOptionIds = [];

			var menuItemStyles = {};

			var renderAsMenu = false;

			myParent.find("[type=MENU]").each(function(mendx,aMenu){
					//Add new line to signal beginning of new menu item
				aMenu=$(aMenu)
				currentTxt += (mendx > 0 ? "\n" : "");
				//Parse Menu Items for Text to populate User Editable Text Area
				aMenu.find("[type=MENU-ITEM]").each(function(idx,child){
					menuItem = $(child);

					if(menuItem.attr("id")) {
						menuItemIds.push(menuItem.attr("id"));
						menuItemStyles[menuItem.attr("id")]=CONVERT_STYLE_TO_CLASS_OBJECT($("#"+menuItem.attr("id")));
								
					}

					currentTxt += (idx > 0 ? ","+ menuItem.attr("edittxt") : menuItem.attr("edittxt"));
				
					//write HREF last on line
					if(menuItem.attr("href") && menuItem.attr("href").trim().length > 0 ){
						currentTxt += "(" + menuItem.attr("href")+")";
					}
					
					

				})
			})

			renderAsMenu = myParent.find(".menutext").length > 0;
			
			myParent.attr("menuItemIds",menuItemIds);
			myParent.attr("menuOptionsIds",menuOptionsIds);

			log.debug("CUSTOMEVENTS.js:Current TXT IS NOW " + currentTxt)
			
			input = $(proto.editModeHtml).attr('style',proto.editModeStyle).attr('parent-node',id).css("-webkit-text-fill-color","black").val(currentTxt)

			enableTextAreaTabs(input)


			log.debug("CUSTOMEVENTS.js:Input color is " + $(myParent).css("color"))
			log.debug("CUSTOMEVENTS.js:parent color is " + $(myParent).css("background-color"))
			var pbgcolor = $(myParent).css("background-color")
			/*
			if( $(myParent).css("color").indexOf("rgb(255, 255, 255)")> -1){
				$(input).val(currentTxt).css({"background-color":"#afcaff"})
			} else {
				$(input).val(currentTxt).css({"background-color":"white"})
			}*/

			//Ok, remove kids and old menu because we don't need it from this point forward.  We will create new menu from scratch
			myParent.children("[type=MENU]").remove();

			$(myParent).append(input);

			
			//var menu = $("<div>",{id:"menu-for-"+myParent.attr("id"),type:"MENU"}).css({"position":"absolute","display":"inline"})

			

			$(input).focus().on('blur',function(event){

				$.event.trigger("CUSTOM_userDoneEditing",[])


				//reenable keydown logic and save input
				$(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
				$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)
				
					var tokens = $(input).val().split("\n");

						//if Newlines?  Change Render Text As Menu
					if( tokens.length > 0){

				
						log.debug("CUSTOMEVENTS.js:I should not be here")
						//Loop Over Tokens and write as inline Div Tags
						for(it = 0; it < tokens.length; it++){

							
							var menu = $("<div>",{id:"menu-for-"+myParent.attr("id")+"-"+it,type:"MENU"}).css({"position":"relative","display":"inline"})
							myParent.append(menu);
							
							//see if User gave us comma separated line.  If so, treat as images and text in menu item
							var imgTxtTok = tokens[it].split(",")
							log.debug("CUSTOMEVENTS.js:SPLITTING ON ,")
							console.log(imgTxtTok)
							if(imgTxtTok.length > 0){

							
						

								var option = "";

								menuItemIds = menuItemIds;
						
								for(x=0; x < imgTxtTok.length; x++){

									//var mId = menuItemIds.splice(0,1).toString();

							var mId = menuItemIds.splice(0,1)
							
							if(!mId || mId.length ==0){
								mId = myParent.attr("id") + "-" +it+"-"+x;	
								
							} 
							newMenuItemIds.push(mId);
							



							var mi = $("<div>",{type:"MENU-ITEM",id:mId,item:myParent.attr("id")+ "-" +it+"-"+x})
										.css('display','inline')
						

							menu.append(mi)
							

									var oId = menuOptionsIds.splice(0,1).toString();

									if(oId.length == 0){
										oId = myParent.attr("id") + "-" +it + "-" + x;
									}

									newMenuOptionIds.push(oId);

									option = $("<div>",{type:"MENU-OPTION",id:oId,item:myParent.attr("id")+"-"+x})
										.addClass(myParent.attr("id")+"-"+x).css({display:"inline",padding:"5px"});

									var filename = imgTxtTok[x].trim()
									//did user specify a fontawesome class or an image or plain text for this menu-item
									ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
									log.debug("CUSTOMEVENTS.js:EXT is " + ext + " and filename is " + filename)
									if(true){
										if(filename.startsWith("fa-")) {
											mi.attr("class","fa" + " " + filename).attr("edittxt",filename).css("padding","5px")
										}//urls fall in here too because or .com, .org extension etc 
										
										else {
											//test for extensions
											/*
											if(filename.startsWith("napkin-")){
												log.warn("Searching for napkin plugin " + filename);
												PLUGINS_getPlugin(mi,filename);
												mi.attr("edittxt",filename)

											}else */{
												log.debug("CUSTOMEVENTS.js:filename is"+filename)
												var reg=/(.+)\(([^)]+)\)/g;
												grp = reg.exec(filename)
												log.debug("CUSTOMEVENTS.js:group is"+grp)
												if(grp){
													mi.attr("edittxt",grp[1]).attr("href",grp[2]).text(grp[1]);
													createAnchorFor(mi);
												}else{
													mi.attr("edittxt",filename).text(filename);
												}
											}
											
										}

										//mi.append(option)

									} else if(filename.startsWith("href:")){

											 var url = filename.substring(filename.indexOf("href:")+5);

											//Only 1 href per line.  Anything more would be confusing
											//option.attr("href",url);
											//Temp include option just to copy href to siblings and then destroy because it is useless
											//for end user display purposes. ie. HREF aren't seen
											//mi.append(option)
											mi.attr("href",url);
											createAnchorFor(mi);
											

									}else {
										//USER IMAGE NEEDS SOME WORK. SHOULD BE SPLIT OUT TO IMG TAG OR SECOND DIV TAG
										//found image
											log.debug("CUSTOMEVENTS.js:Appending image " + filename)
											mi.css({display:"inline-block","vertical-align":"middle","background-image":"url(" + filename + ")","background-size":"cover","background-repeat":"no-repeat"})
												.attr("edittxt",filename)
											//mi.append($("<div>",{edittxt:filename, style:"display:inline-block"}).html(filename))			
											//mi.append(option)
									}

									
								}
								//done editing... copy user requested styles onto element again so we don't lose the style
								//when done editing this text.
								style = menuItemStyles[mi.attr("id")]

								if(style){
									mi.css(style)
								}

								if(renderAsMenu){
									if(mi.css("margin-left") == "0px" ){
										mi.css("margin-left","20px");

									}
								} else {
									mi.append("<p>");	
								}

								mi.removeClass("submenu")
								
								CUSTOM_PXTO_VIEWPORT($(mi),mi.offset().left, mi.offset().top)
								if(renderAsMenu){
									mi.addClass("menutext")
								}
								//determine if img or token
							}/* else {

								mi.append($("<div>",{type:"MENU-ITEM-TXT",edittxt:tokens[it],style:"display:inline-block"}).html(tokens[it]))
							}*/
						}
						
					}

				myParent.attr("menuItemIds",newMenuItemIds);
				myParent.attr("menuOptionsIds",newMenuOptionIds)
				
				log.debug(`Current Node is ${$('#'+$(myParent).attr('parent-node')).attr(proto.editModeAttribute)}`);
				myParent.removeClass("submenu")
				//myParent.css("color",oldTxtColor)
				CUSTOM_PXTO_VIEWPORT(myParent,myParent.offset().left, myParent.offset().top)
			
				$(input).remove();

				userHoveringOverNote = false;

				SAVE_okToSave = true;
				//enable menu items
				setUpMenuItems($(myParent))	
				/*
				$(myParent).css("height",$(myParent).children("[type=MENU-ITEM]").first().height()*1.2).children("[type=MENU-ITEM]").each(function(it,child){
					//setUpDiv(child);
				})*/
			});
}

function initDraggableObject(obj){

	
	$(obj).draggable({snap:false});
	
	$(obj).droppable(DROPPER_LOGIC);

}

//Create (or Modify) smart anchor. ie. only triggers when in Live mode. Also positioned correctly since we use absolute positioning inside display:"inline"
function 	createAnchorFor(parent,overwriteOldAnchor){


	var parentId = $(parent).attr("id");
	var loc = $(parent).attr("href");

	if(!overwriteOldAnchor){
		anchors = $("<a>",{id:"anchor-"+parentId,href:loc,label:loc,type:"anchor"})
		if(!loc.trim().startsWith("http") && !loc.trim().startsWith("javascript:") ){
			//alert(loc)
			if(loc.trim().length > 0){
				if(loc.startsWith("/")){
					loc = loc.replace("/","");
				}
				
				REVISION_anchors.push(loc.trim())
			}
		}

	} else {

		if($(parent).find("[type=anchor]").length == 0){
			console.debug("I found no anchors to update");
			return;
		}

		anchors = $(parent).find("[type=anchor]")
	}


	anchors.each(function(idx,a){
		a = $(a);

		immediateParent = overwriteOldAnchor ? a.parent("[href]") : parent;



		var leftPos = immediateParent.css("display") == "inline-block" ? 0 : "0px";
		var topPos = immediateParent.css("display") == "inline-block" ? 0 : "0px";


		log.debug("CUSTOMEVENTS.js:immediate parent is " + immediateParent.attr("id") + " with offsets " + immediateParent.position().left)
		console.log({left:leftPos,top:immediateParent.offset().top});
		
		a.css({align:"center",display:"inline-block",left:leftPos,width:immediateParent.width(),height:immediateParent.height()
			,"position":"absolute", top:topPos});				
		a.on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
		a.on("click",writeTabs)

		CUSTOM_PXTO_VIEWPORT($(a),$(a).position().left, a.position().top)

	})


	//The name of the anchor variable is misleading here.  If we get in here, only adding one anchor. So the name could be 'a' 	

	if(!overwriteOldAnchor){
		$("#anchor-"+parentId).remove();

		$(parent).append(anchors);

		CUSTOM_PXTO_VIEWPORT($(anchors),$(anchors).position().left, anchors.position().top)

		setUpAnchors(parent);
	}

	return parent;
}

//Make sure we can only click anchors in Preview/Live mode, ELSE show Ballon for parent MENU-ITEM
function setUpAnchors(div){


	div.find("[type=anchor]").each(function(idx,anchor){

		$(anchor).on("dblclick",function(e){
				if(editing){
					$(this).parents("[href]").first().trigger("dblclick")
					//e.preventDefault();
					return false;
				}

		}).on("click",function(){
			log.debug("CUSTOMEVENTS.js:Editing is " + editing)
				if(editing){
					$(this).parent("[href]").first().click();
					//e.preventDefault();
					return false;
				}

		}).on("mouseenter",function(){

			if(editing) {			
				window.status = $(this).attr("href");
				$(this).parent("[href]").first().trigger("mouseenter");
			}
		})

	})


}

//file input field is actually created in stylesTabs2.js dynamically
//attached it here because it was too much trouble attaching it in normal HTML and hiding/rewriting after autoSave feature enabled
function CUSTOM_HANDLEFILES(files) {

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /^image\//;
    
    if (!imageType.test(file.type)) {
      continue;
    }
    //CUSTOM_currentlyMousingOverElementId
    var img = $("#"+window.myim);
    
    img.file = file;
    
    
    var reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { 
    	 $(aImg).css({"background-image":"url(" + e.target.result + ")","background-size":"cover"})
    }; })(img);
    reader.readAsDataURL(file);
  }
}

function setUpMenuItems(tParent){

		$(tParent).find("[type=MENU-ITEM]").on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
					.on("mouseleave",CUSTOM_MOUSELEAVE_LOGIC)
					.on("click",writeTabs)
}

function addEditMode(){

	if(!$("#anchorsAway").is(":checked")){
		$("body").addClass("editing")
		$("[type=anchor]").css("border","1px solid red")
	}
}

function removeEditMode(){
	$("body").removeClass("editing")
	$("[type=anchor]").css("border","none")
}

function enableHoverEvents(){
	if(!$("#disableHoverEvents").is(":checked")){
		$("body").addClass("hover")
	} 
}



function disableHoverEvents(){

	$("body").removeClass("hover");
}

function setUpDiv(div){

	div = $(div)



	try {
		div.off("dblclick",CUSTOM_ELEMENT_DOUBLECLICK_LOGIC).off("dblclick",CUSTOM_ELEMENT_DOUBLECLICK_LOGIC).off("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
			.off("mouseleave",CUSTOM_MOUSELEAVE_LOGIC).off("click",writeTabs).resizable("destroy");
	} catch(destroy){
		log.debug("ignoring warning while destroying system generated events tied to div " + div.attr("id"));
	}

	div.on("mouseenter",function(event){
		log.debug("CUSTOM_EVENTS2.js: " + event.target.id)
		//event.stopPropagation()
		OVERLAY_showOverlay(event.target)
	})

	var oldPos = div.css("position");

	div.find(".hotspot").css({height:0,width:0}).hide()

	div.not("#drawSpace,body").resizable().on("resizestart",disableHoverEvents).on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC)
		.not("[type=TXT],[type=ICON],[type=BTN]").on("resize",CUSTOM_ON_RESIZE_LOGIC);


	
	div.draggable().on("drag",function(e){
		
		//e.stopPropagation()
		NOTES_makeNote(this);

	}).on("dragstart resizestart",function(e){
	
		disableHoverEvents()
	}).on("dragstop",CUSTOM_DRAPSTOP_LOGIC).on("resize",function(){
		NOTES_makeNote(this);
	});



	

	div.filter("[type!=T],[type!=ICON]").droppable(DROPPER_LOGIC);

	
	if(div.is("[type=ICON]")){
		div.on("resize",CUSTOM_ICON_RESIZE)
	}


	attr = div.attr("type");

	if(attr == "T" || attr == "BTN"){
		$.event.trigger("translateTxt",[div])
		div.on("resize",CUSTOM_TXT_RESIZE).on("dblclick",CUSTOM_ELEMENT_DOUBLECLICK_LOGIC);
	}

	if(div.is("[type=LIST]")){
		log.warn("CUSTOMEVENTS2.js: Triggering list SLIDER_INIT for list " + div.attr("id") + " and alias " + div.attr("alias"))
		
		if(div.hasClass("gallery")){
			div.css("white-space","nowrap");
			duration = (div.css("transition-duration"))
			
			duration = parseFloat(duration) == 0 ? "0.6s" : duration;
			div.css({overflow:"hidden","transition-duration":duration})

			SLIDER_init(div);
		}
	

	} 

	
	if(div.is("[type=IMG]")){
		//$.event.trigger("translateTxt",[div])
		div.on("dblclick",CUSTOM_ELEMENT_DOUBLECLICK_LOGIC);
	}


	log.debug("doing Divs")
	
	div.not("body,[type=MENU]").on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
					.on("mouseleave",CUSTOM_MOUSELEAVE_LOGIC)
					.on("click",writeTabs)
					

	//Setup Menu Divs
	if(div.is("[type=T]")){
		setUpMenuItems(div);	
	} 

	setUpAnchors(div)
	//div.not("#drawSpace").not("body").on("mouseover",CUSTOM_MOUSEENTER_LOGIC);
	/*
	if(div.is("[alias]")){

		$.event.trigger(div.attr("alias") + "-" + "available",[div,function(serverContent){
				log.debug("CUSTOMEVENTS.js:ServerContent is " + serverContent)
				if(serverContent){
					log.debug("CUSTOMEVENTS.js:ServerContent is below for alias " + div.attr("alias"))
					console.log(serverContent)

					for(responseKey in serverContent){
						log.debug("CUSTOMEVENTS.js:ServerContent Looking for alias with key " + responseKey)
						if(div.is("[type=LIST]")) {
							$(div).children("[type=IMG]").not(":first").remove();
						}
					
						INGEST_recursivePopulate(serverContent[responseKey], $("[alias=" + responseKey + "]"))

						if(div.is("[type=LIST]")) {
							$(div).children("[type=IMG]").first().remove();
						}

					}
				} else {
					log.warn("No content found for list " + div.attr("alias"))
				}

		}])
	}
	*/


	//commented out because it swallows Anchor click event and will not allow links to be clicked.
	//todo: 1. On user choosing slide options, add JS dynamically to call slider click event and save to JS file
	//div.not("#drawSpace,body,[type=VID]").on("click",genericSlide);

	div.not("body").addClass(div.attr("id")).addClass("dropped-object")

	//fix bug in jquery which forces position to relative on draggable() init
	div.css("position",oldPos);




	
}




function parseStyleClassFromString(theStr){

	var theStyle = {};
	
	oldHos = theStr.split(";")

	for(i=0; oldHos && i < oldHos.length; i++){
		theOldHo = oldHos[i];
		lilOldHos = theOldHo.split(":")
		log.debug("CUSTOMEVENTS.js:Do I have old hos!")
		console.log(lilOldHos);
		if(lilOldHos.length > 1){
			
			theOldLabel = lilOldHos[0];
			theOldValue = lilOldHos[1];

			theStyle[theOldLabel] = theOldValue;

		} 
	}

	return theStyle;
}


function initialize(){

	
 	$("body").attr("id","body").addClass("body").addClass("hover");

 	$("#smalldialog").dialog({
 		autoOpen: false, 
 		modal:true,
 		resizable:true,
 		open:_DEFAULT_OPEN_CODE,
 		close:_DEFAULT_CLOSE_CODE,
 	});


 	$("#dialog").dialog({
 		autoOpen: false, 
 		modal:true,
 		resizable:true,
 		open:_DEFAULT_OPEN_CODE,
 		close:_DEFAULT_CLOSE_CODE,
 	});

 	$( "#jsdialog" ).dialog({ 
 		autoOpen: false, 
		resizable:false,
		height:"auto",
		width:600,
		modal:true,
		close:CUSTOM_CLOSE_LOGIC,
		open: CUSTOM_JS_OPEN_CODE,
		buttons:{
			Cancel: function(){
				log.debug("CUSTOMEVENTS.js:Ignoring " + $("#jsdialog").find("textarea").val());
				$(this).dialog("close");
			},
			"Save Function": function(){
				var error = false;
				try {
					//disable all events before adding new user events	

					$(this).data().theClickedElement.off("click")
					//test and add new user events
					eval($("#jsdialog").find("textarea").val())

					//if we make it to this line, user entered good js
					//So unbind any duplicated events and eval again to execute any on("x") events where x = event name
					var myRegexp = /\s*on\(\s*"(\s*\w+)"\s*,.+|on.\("(\w+)"\s*\)\.+/img

					normalizedCopy = $("#jsdialog").find("textarea").val().replace(/\n/g,"");

					log(normalizedCopy)

					match = myRegexp.exec(normalizedCopy);

					log.debug("CUSTOMEVENTS.js:Match is " + match)

					elemId = $(this).data().theClickedElement.attr("id")

					var recompileCode = false;

					while (match != null) {

					  // matched text: match[0]
					  // match start: match.index
					  // capturing group n: match[n]
					  log.debug("CUSTOMEVENTS.js:attempting to unbind any events of type ["+match[1] + "] attached to #" + elemId )
					  $("#"+elemId).unbind(match[1]);

					  if(match[1] == "hover"){
					  	$("#"+elemId).unbind("mouseleave").unbind("mouseover")
					  }

					  //rebind our custom events
					  if(match[1] == "mouseenter" || match[1] == "mouseleave" || match[1] == "click"){
						  	$("#"+elemId).on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
								.on("mouseleave",CUSTOM_MOUSELEAVE_LOGIC)
								//.on("click",genericSlide);
					  }
					  recompileCode = true;


					  match = myRegexp.exec(normalizedCopy);

					
					}

					if(recompileCode){
						eval($("#jsdialog").find("textarea").val())
					}

					//Now that we are sure code is good.  Write it to storage
					saveJs($(this).data().theClickedElement,$("#jsdialog").find("textarea").val());

				}catch(e){
					log.debug("CUSTOMEVENTS.js:Writing Error")
					error = true;
					$("#jsdialog").find("#error_area").val(e)
				}
				if(!error) {
					$(this).data().theClickedElement.attr("hasjs","true")
					$(this).dialog("close");
				}

				if($("#jsdialog").find("textarea").val().trim().length == 0){
					//signal to UI that JS no longer enabled for this element
					$(this).data().theClickedElement.removeAttr("hasjs")	
				}

				theId = $(this).data().theClickedElement.attr("id")
				//Always Renable Drag events
				initDraggableObject($(this).data().theClickedElement);
			}
		}

 	});


   	
   	//Reinitialize resizable that may have been saved during autosave or manual save process
   	
	kids = $(".ui-resizable").children(".ui-resizable-handle").remove();

	$(".ui-resizable").on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC);

	$(".ui-resizable-disabled").resizable().removeClass(".ui-resizable-disabled")

	try {

	$(".dropped-object").droppable("destroy").resizable("destroy")
	
	}catch(e){
		log.info("CUSTOMEVENTS2.js: No destroy methods found to clean up.  Continuing")
	}


	$(".ui-droppable").resizable().on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC)

	
	$(".template").on("click",function(){
		if($(this).css("opacity") == 1){
			$(this).css({"opacity":.9,"background-color":"green"})
			groupResizeEnabled = true;
		} else {
			$(this).css({"opacity":1,"background-color":"transparent"})	
			groupResizeEnabled = false;
		}
	})

	$(".dropped-object").each(function(idx,element){
		setUpDiv($(element));
	})

	//$('.ui-draggable').draggable({snap:false});
	
	$("#drawSpace").droppable(DROPPER_LOGIC).on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
					.on("mouseleave",CUSTOM_MOUSELEAVE_LOGIC).find(".hotspot").css({height:0,width:0}).hide()
	
	
   	//Setup edit hotspots
   	//$("div.hotspot").on("click",sSPOT_CLICK)

   	//Setup up Dblclick event for editing text areas on all components
   	//$("div.hotspot").parentsUntil(".ui-draggable").parent().not("#id_toolset").on("dblclick",CUSTOM_ELEMENT_DOUBLECLICK_LOGIC);
   	//.resizable({disable:false})

   	//Show Toolbar and setup options
   $(".toolset_header").on("dblclick",function(event){
   		$(".tool_panel").toggle();
   })

   $(".tool").draggable({
		helper: "clone"
	});

   $(".mastercopy").draggable({
		helper: "clone"
	});

   	$('.toolset').draggable()

   $( "#dialog" ).dialog({ 
 			autoOpen: false,
 			close:CUSTOM_CLOSE_LOGIC

 	});

   $(".trash").resizable("destroy").draggable("destroy")

   $(".dropped-object").addClass("squarepeg")

   
   


   //Signal that all elements are on the page and slider is ready
    $.event.trigger("genericSliderReady",[])

	//Determine which popup to call based on Key User Pressed
	//Note: Unbind called while user is entering values on dialog so that we don't
	//interfere with Shift or Ctrl keys needed while in JS view
	$(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
   	$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)


   	//setupGhosts
   	$("[ghost-for]").each(function(i,ghost){

   		GHOST_init(ghost);
   	})
	

   	log.debug("CUSTOMEVENTS.js:all done")
}


function recursiveCpy(obj){
	var obj = $(obj)

	obj.removeClass("submenu")

	log.trace("Copying")
	//temporarily disable dragging on parent
	//obj.draggable("destroy").find(".ui-droppable").draggable("destroy")

	try {

	obj.draggable("destroy").find(".ui-droppable").draggable("destroy")

	obj.resizable("destroy")

	}catch(e){
		log.warn(e)
	}

		$(obj).find(".ui-droppable").each(function(idx,elem){
   		setUpDiv(elem);
   	})

   	//Now process copy of obj
   	var clone = obj.clone();

	clone.removeAttr("hasjs")

	clone.attr("extends",obj.attr("id"))

	clone.attr("id","ELEM_"+ new Date().getTime())

	log.trace(clone)
	
	style = CONVERT_STYLE_TO_CLASS_OBJECT(obj)
   	
   	$(clone).css(style)

   	clone.removeClass(obj.attr("id")) 


	
	//var goodChildren = $(obj).children(".dropped-object"); 

   	log.trace("CUSTOMEVENTS2.js : bad children after copy");
   //	console.log($(obj).children(".dropped-object")); 

   	$(obj).children(".dropped-object").each(function(idx,elem){
   		
   		var elem = $(elem)
   		log.trace("child copy of " + $(elem).attr("id"))
   		var id = elem.attr("id")

   		// find elem on copy
   		var cpy = $(clone).find("#"+id);

   	
   		mystyle = CONVERT_STYLE_TO_CLASS_OBJECT(elem)
   		log.debug("CUSTOMEVENTS.js:what was position " + mystyle.position)
   		//mystyle.position = "absolute";
   		cpy.css(mystyle)
   		log.debug("CUSTOMEVENTS.js:what was written " + cpy.css("position"))
   		log.trace("CUSTOMEVENTS.js: Height " + elem.css("height") + " widht " + elem.css("width") + " from id " + elem.attr("id"))
   		log.trace("CUSTOMEVENTS.js: Height " + cpy.css("height") + " widht " + cpy.css("width")+ " to id " + cpy.attr("id"))
   		log.debug("CUSTOMEVENTS.js: Back from traje : position " + cpy.css("position"))
   		cpy.attr("extends",id)
   		cpy.attr("id","ELEM_" + new Date().getTime());
   		//trigger write to file
   		//cpy.trigger("resizestop")
   		//CUSTOM_PXTO_VIEWPORT($(cpy),cpy.position().left,cpy.position().top)
   		log.debug("CUSTOMEVENTS.js:Copy position is " + cpy.css("position"))
   		//cpy.css("position",cpy.css("position"))
   		//cpy.css("position")
   		cpy.removeClass(id)

   		cpy.off();
   		
   		setUpDiv(cpy);
   	
   	})

  
   	
   

	

   	//then parent
   	setUpDiv($(clone))

	setUpDiv($(obj))

	//wait until paste
	if(obj.is("[type=LIST]")){
   	 //obj.parent().append(clone)
   	 //CUSTOM_PXTO_VIEWPORT($(clone),clone.position().left,clone.position().top)
	}

   	//clone.css({top:obj.offset().top + 10, left:obj.offset().left+10})

  

   
 
   	return $(clone);

}



var hiddenItems = null;

DROPPER_LOGIC = {

		helper:"clone",

		greedy:true,
		
        drop: function(event, ui) {

        	//remove class which highlights element when hovering over it in inspect mode
        	$(ui.draggable).removeClass("submenu")

        	//event.preventDefault();
        	log.trace("Showing hiddenItems")
        	$(hiddenItems).show();
        	$.event.trigger("droppedEvent",[event,ui]);
        	
 
        	$(event.target).removeClass("over")

        	$(ui.draggable).css("z-index",parseInt($(event.target).css("z-index"))+1)

        	if($(ui.draggable).hasClass("mastercopy")){
        	
        		log.trace("Starting Master Copy")

        		clone = recursiveCpy(event.target);
        		
        		//clone.css({left:$(event.target).position().left -	10,top:$(event.target).position().top -10})
        		//$('body').append(clone);
        		
				$(clone).on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
							.on("mouseleave",CUSTOM_MOUSELEAVE_LOGIC)
							

        		log.debug("CUSTOMEVENTS.js:Copy")
				return;
				
			}  
			

			if($(event.target).attr("type") == "T"){
				log.debug("CUSTOMEVENTS.js:Exiting.  Can drop anything on text.  Only Copy is possible")
				return;

			}

			if($(ui.draggable.id) == "trash"){
				log.debug("CUSTOMEVENTS.js:Can not drop trash on droppable components....returning")
				return;
			}

        
	
			if($(ui.draggable).hasClass("toolset")){
				log.debug("CUSTOMEVENTS.js:Can't drop drawing tools")
				return;		
			}  	

        	log.trace("Dropping over " + $(event.target).attr("id"));

        	if(event.target.id == "trash"){
        		myCSSLookupKey = "." + $(ui.draggable).remove().attr("id");
        		log.debug("CUSTOMEVENTS.js:My Lookup Key " + myCSSLookupKey)
        		var re = new RegExp(myCSSLookupKey+'\\s+\\{[^}]+\\}','img')
				$("style.generated").html($("style").html().replace(re,""))

        		log.debug("CUSTOMEVENTS.js:take out trash")
        	} 

        	if(event.target.id == "id_toolset"){

        		log.debug("CUSTOMEVENTS.js:nothing to do");
        		return;

        	}else {
        	
        			var createdTool = false;

        			parent = "#"+event.target.id;

		        	child = "#"+ $(ui.draggable).attr('id')

		        	var isBTNCntrl = false;
		        	

		        	theElem = $(ui.draggable);
		        	theTarget = $(event.target);

		        

		      

		        	if(theElem.is("[alias^=cntrl]")){
		        		
		        		if(!theTarget.is("[type=LIST]")){
		        			theTarget = $(event.target).parents("[type=LIST]");
		        		}
		        		if(theTarget){
			        		/*
			        		theTarget.append(theElem);
			        		theElem.css({top:0,left:theTarget.width()-theElem.width()});*/
			        		SLIDER_setUpButton(theElem,theTarget);

			        		CUSTOM_PXTO_VIEWPORT($(theElem),$(theElem).position().left,$(theElem).position().top)
			        		return;

		        		}

		        	} else


		        	if($(event.target).parent().is("[type=LIST]") && $(ui.draggable).parent().is("[type=LIST]")){
		        		 
							$(ui.draggable).insertBefore($(event.target));
							CUSTOM_PXTO_VIEWPORT($(ui.draggable),$(ui.draggable).position().left,$(ui.draggable).position().top)
							return;
					
					}

		        	if(isBTNCntrl){
		        		log.trace("Can't drop button here")
					
						CUSTOM_PXTO_VIEWPORT($(ui.draggable),$(ui.draggable).position().left,$(ui.draggable).position().top)
						return;
		        	}
					
					
					
					
					if( ( $(event.target).width() * $(event.target).height()) <=  ( $(ui.draggable).width() * $(ui.draggable).height() ) ){
						log.trace("Exiting Target too small to accept the dropped element " + $(event.target).offset().left)
						
						CUSTOM_PXTO_VIEWPORT($(ui.draggable),$(ui.draggable).position().left,$(ui.draggable).position().top)
						return;
					}



	        		if($(parent).children(child).length > 0  )
	        		{
	        	
	        			CUSTOM_PXTO_VIEWPORT($(ui.draggable),$(ui.draggable).position().left,$(ui.draggable).position().top)
	     
	        			return;
	        		} else {
	        			log.trace ("i REALLY don't know this child")
	        		}

	        		if( $(ui.draggable).hasClass("dropped-object")){
	        			aTool = $(ui.draggable)

					} else {

			        	aTool =  whichTool($(ui.draggable).text());
			        	
			        	log.warn("UI draggable offset is ")
						log.warn($(ui.draggable).offset())

			        	aTool = configuredTool(aTool);
			        	createdTool = true;
					}


					//dropTool Call
					//dropTool(aTool,{target:event.target,clientX:event.clientX,clientY:event.clientY});
					dropTool(aTool,{target:event.target,clientX:aTool.offset().left,clientY:aTool.offset().top});
					/*
		        	log.debug("CUSTOMEVENTS.js:A tool is ")
		        	log(aTool)

		        	
		        	$(aTool).css({position:"absolute"})

						        

					log(`Value of position is ${$(aTool).css('position')}`);
				
					log.debug("CUSTOMEVENTS.js:Offset before append is " + Math.abs($(event.target).offset().top - $(aTool).offset().top))

					//var relativeAppendTop = createdTool ? event.clientY : Math.abs($(event.target).offset().top - $(aTool).offset().top);	
					$(event.target).append(aTool);	

					yOffset = event.clientY + window.scrollY;
					xOffset = event.clientX;
					aTool.offset({left:xOffset,top:yOffset})
					$(event.target).append(aTool);	
		        	aTool = CUSTOM_PXTO_VIEWPORT(aTool,aTool.position().left,aTool.position().top)
		        	$(aTool).addClass("debug-border-style");
		      		$(aTool).addClass("dropped-object");

		        	log.debug("CUSTOMEVENTS.js:Handle length is " + aTool.children(".ui-resizable-handle").length)
		        	
        	

		        	aTool.resizable({disabled:false}).on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC);
		        	try {
		        		aTool.unbind("click",genericSlide).on("click",genericSlide);
		        	}catch(e){
		        		log.debug("CUSTOMEVENTS.js:generic slide is disabled")
		        	}
					*/
        	
        	}
        
        	log.trace("Showing hiddenItems")
        			$(hiddenItems).show();
        
        	$(this).removeClass('over')
        	//$(ui.draggable).addClass("squarepeg");
        },
        start:function(event,ui){

        	$(ui.draggable).css("z-index","80000");

        },
       
        over: function(event,ui){
        
        	$(this).addClass('over');
        	

        
        	//|| parseInt($(this).css("left")) < parseInt($(this).parent().css("left")) )
        },
        out : function(event,ui){
        	$(this).removeClass('over')
        	$(this).show();
        	$(hiddenItems).show();
        	
        }
}

function dropTool(aTool,dropInfo){

		var target = dropInfo.target;
		var yOffset = dropInfo.clientY + window.scrollY;
		var xOffset = dropInfo.clientX;


		log.debug("CUSTOMEVENTS.js:A tool is ")
		        	log(aTool)

		        	
		        	$(aTool).css({position:"absolute"})

						        

					log.info(`CUSTOMEVENTS2.js: Value of position is ${$(aTool).css('position')}`);
					log.info(`CUSTOMEVENTS2.js: Value of offset is ${$(aTool).offset()}`);

				
					//log.debug("CUSTOMEVENTS.js:Offset before append is " + Math.abs($(event.target).offset().top - $(aTool).offset().top))

					//var relativeAppendTop = createdTool ? event.clientY : Math.abs($(event.target).offset().top - $(aTool).offset().top);	
					//$(target).append(aTool);	
					//log.warn("target is ")
					//log.warn(target)

					$(target).append(aTool);
					aTool.offset({left:xOffset,top:yOffset})
					


					//$(target).append(aTool);


		        	aTool = CUSTOM_PXTO_VIEWPORT(aTool,aTool.position().left,aTool.position().top)
		        	$(aTool).addClass("debug-border-style");
		      		$(aTool).addClass("dropped-object");

		        	log.info("CUSTOMEVENTS2.js: Handle length is " + aTool.children(".ui-resizable-handle").length)
		        	
        	

		        //if(aTool.children(".ui-resizable-handle").length == 0){
		        	aTool.resizable({disabled:false}).on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC);
		        	if(aTool.is("[type=VID]")){
		        		aTool.find("video")[0].play()
		        	}
		        	
}


	