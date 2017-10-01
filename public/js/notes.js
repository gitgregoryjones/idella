
var NOTES_timer = null;

var userHoveringOverNote = false;
var userEditing = false;

function NOTES_delayShowingNote(target){ 

	NOTES_timer = setTimeout(function() {
	 NOTES_makeNote(target,true); 
	}, 200) 
} 

$(this).on("CUSTOM_userEditing",function(){userEditing = true})
$(this).on("CUSTOM_userDoneEditing",function(){userEditing = false})

//Render info bubble over selected element
var userOverNote = false;
var noteShowing = false;

function NOTES_delete(element){

	SAVE_okToSave = true;

	$(".msg,.active-message").remove();
	$(".peak,.active-peak").remove();

	noteShowing = false;
}


function setCaretPosition(elem, caretPos) {
    var elem = $(elem);

    //alert(elem)

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}


function NOTES_makeNote(element,isActive){


	var msgcoords = {top:0,left:0}

	if(!$(element).hasClass("dropped-object") && LOGIC_TEMPLATE_MODE){
		$("*").not(".dropped-object").removeClass("redoutline")
				$(element).addClass("redoutline")
				//$(element).css("opacity",".7");
				CUSTOM_currentlyMousingOverElementId = $(element).attr("id")

				$(element).parents().first().mouseleave()
	}

	
	if(!editing  ||  userHoveringOverNote || $(element).attr("id") == "undefined" || CUSTOM_currentlyMousingOverElementId != $(element).attr("id") ){

		if(STYLESTABS_forceRewrite){
			STYLESTABS_forceRewrite = false
			//continue processing
		} else {
			return msgcoords;
		}
		
	}

	if(GHOST_isForElement(element)){
		return msgcoords;
	}
	
	if($(element).hasClass("dropped-object")){
		writeTabs(element)
	}
	//NOTES_delete()

	//window.clearTimeout(NOTES_timer);

	element = $(element);

	element.id = $(element).attr("id")
	/*
	if($(window).width() < 850)
		return;*/

	var pxToVWAdjuster = (100 / document.documentElement.clientWidth);


	if(element.id){
		log.debug("NOTES.js: Entering parent " + element.id + " with X, Y " + $(element).css("left") + "," + $(element).css("top"))

	
		//$(element).addClass("submenu");

		theMsg = $("<div class='msg' msg-parent='" + element.id + "'>&nbsp;&nbsp;"+$(element).attr("type") + "#" + $(element).attr("id") + " " + ($(element).attr("alias") != undefined ? " [alias= " + $(element).attr("alias") +"]" : "") + "</div></div>" );

		theMsg.append("<div>Left : " + $(element).offset().left + ", Top: "+ $(element).offset().top + ", Height: "+ $(element).height() + ", Width: "+ $(element).width() +"</div>")
		
		if(!element.is("[type=PLUGIN]")){

			color = $(element).css("background-color")
			image =  $(element).is("[type=VID]") ? $(element).find(".content-image").attr("src") : $(element).css("background-image")
			txtColor = $(element).css("-webkit-text-fill-color")
			fontFamily  = $(element).css("font-family")
			href = $(element).attr("href") != undefined ? $(element).attr("href") : "none" ;

			theMsg.append(" <div>href: <input type='text' class='quick-disabled' name='href' parent='" + element.id + "' value='" + href + "'></div>")

			color = $(element).css("background-color")
			image =  $(element).is("[type=VID]") ? $(element).find(".content-image").attr("src") : $(element).css("background-image")
			txtColor = $(element).css("-webkit-text-fill-color")
			fontFamily  = $(element).css("font-family")

			videoOrImage = $(element).is("[type=VID]") ? "src" : "background-image";

			if(element.is("[type=T], [type=LIST]")){

				if(element.is("[type=T]")){
					stype = $("<select>").append(new Option("paragraph","paragraph")).append(new Option("menutext","menutext"));
					theMsg.append($("<div style='display:inline-block; margin-right:10px'>Type:</div>").append(stype));

					//AutoSelect option based on what user chose last
					if(element.find(".menutext").length > 0){
						stype.find("[value=menutext]").attr('selected','selected');
					}

					stype.on('change',function(){
					
						if($(this).find(":selected").attr("value") == "menutext"){
							element.find("p").remove();
							element.find("[type=MENU-ITEM]").css("margin-left","20px").addClass("menutext");
						} else {
							element.find("[type=MENU-ITEM]").css("margin-left",0).removeClass("menutext").append($("<p>"))
							//:not(:last)
						}
						//element.resizable();
					})

				} else {

					ltype = $("<select>").append(new Option("adaptive","adaptive")).append(new Option("gallery","gallery"));
					theMsg.append($("<div style='display:inline-block; margin-right:10px'>Type:</div>").append(ltype));

					//AutoSelect option based on what user chose last
					if(element.hasClass("gallery")){
						ltype.find("[value=gallery]").attr('selected','selected');
					}

					ltype.on('change',function(){
					
						if($(this).find(":selected").attr("value") == "adaptive"){
							element.removeClass("gallery");
							element.css("white-space","normal");
							element.css({overflow:"auto","transition-duration":"0s"})
							SLIDER_deInit(element);

						} else {
							element.addClass("gallery")
							element.css("white-space","nowrap");
							duration = (element.css("transition-duration"))
							
							duration = parseFloat(duration) == 0 ? "0.6s" : duration;
							element.css({overflow:"hidden","transition-duration":duration})
	
							SLIDER_init(element);

							/*
							if(element.children("[alias^=cntrl]").length == 0){
								element.on("click",goLeft)
							} else {
								element.children("[alias^=cntrl]").each(function(idx,button){
									SLIDER_setUpButton(button,element,true);
								})
							}*/
							
							//:not(:last)
						}
						element.find("[type=MENU-ITEM]").css("white-space","normal")
						//save list which automatically positions child elements correctly based on user choice
						CUSTOM_PXTO_VIEWPORT($(element),$(element).position().left ,$(element).position().top);
						//element.resizable();
					})
					
	

				}

			} else {
				theMsg.append(" <div>Source: <input type='text' class='quick-disabled' name='" + videoOrImage + "' parent='" + element.id + "' value='" + image + "'></div>")
			}

			theMsg.append("<div style='display:inline-block'></div>BgColor: <div style='display:inline-block;height:10px;width:10px;border:1px solid black;background-color:"+ color + "'/>")
			theMsg.append(" <div style='display:inline-block'><input type='text' class='quick-disabled' name='background-color' parent='" + element.id + "' value='" + color + "'></div>")
			
			theMsg.append(" <div>Font: <input type='text' class='quick-disabled' name='font-family' parent='" + element.id + "' value='" + fontFamily + "'></div>")
			theMsg.append(" <div style='display:inline-block'> Text Color: <input type='text' class='quick-disabled' name='color' parent='" + element.id + "' value='" + txtColor + "'></div>")
		
		} else {
			list = PLUGINS_getPluginList();
			select = $("<select>").append(new Option("choose a plugin","none"));
			for(idx in list){
				plugin = list[idx]
				select.append(new Option(plugin.alias,plugin.file))
			}
			log.debug("NOTES.js: This is cool")
			console.log(select)
			theMsg.append($("<div style='display:inline-block'>Library:</div>").append(select));
			
			select.on('change',function(){
				
				PLUGINS_getPlugin(element,"napkin-"+ $(this).find(":selected").attr("value"))
				element.resizable();
			})
		}
		/*
		theMsg.on('mouseenter',function(){
			userHoveringOverNote = true;
		}).on('mouseleave',CUSTOM_DONE_NOTE_EDITING_LOGIC);*/

	
		$("body").append(theMsg);


		$("body").append("<div class=\"peak\" msg-parent='" + element.id + "'>&nbsp;</div>")


		//position bar in correct place so it does not overrun the screen
		if(parseInt($(element).offset().left) + $(".msg").width()  > $("body").width()){
			console.log("Slide Left " + $(element).attr("id")) 
			$(".msg").css({position:"absolute",top:parseInt($(element).offset().top- $(".msg").height() - 40), left:parseInt($(element).offset().left)-160})
			$(".peak").css({position:"absolute",top:parseInt($(element).offset().top)-20, left:parseInt($(element).offset().left)+20})
		} else {
			console.log("Default Slide Left " + $(element).attr("id")) 
			$(".msg").css({position:"absolute",top:parseInt($(element).offset().top)- $(".msg").height() - 40, left:parseInt($(element).offset().left)})
			$(".peak").css({position:"absolute",top:parseInt($(element).offset().top)-20, left:parseInt($(element).offset().left)+20})
		}

		
		if(element.id == "drawSpace"){
			//just delete messaging for now. It does not look good onscreen
			/*
			$(".msg").css({position:"absolute",top:parseInt($(element).offset().top) + $(element).height() - $(".msg").height() - 20, left:parseInt($(element).offset().left)+10})
			$(".peak").css({position:"absolute",top:parseInt($(element).offset().top) + $(element).height() -20, left:parseInt($(element).offset().left)+20})
			*/
			$(".msg,.peak").remove();
		} else

		//last check, if rendered bar too close to top. move bar and peak again
		if(parseInt($(element).offset().top) - $(".msg").height() -20  < 0){


			//ok, this is really the last last check.  If to close to bottom, flip again
			if(parseInt($(element).offset().top) + $(element).height() + $(".msg").height() + 20 > $("#drawSpace").height()){

				//Place in bottom left corner of element
				console.log("Bottom Left " + $(element).attr("id")) 
				$(".peak").css({position:"absolute",top:parseInt(($(element).offset().top + $(element).height()) - 20 )})
				$(".msg").css({position:"absolute",top:parseInt($(".peak").offset().top - $(".msg").height() - 20)})
			} else {
				console.log("Top Left " + $(element).attr("id")) 
					$(".msg").css({position:"absolute",top:parseInt($(element).offset().top) + $(element).height() + 20 })
					
					//flip vertically
					$(".peak").css({"-ms-transform": "rotate(180deg)","-webkit-transform": "rotate(180deg)","transform": "rotate(180deg)"})
					$(".peak").css({position:"absolute",top:parseInt($(".msg").offset().top) - 40})
				}

		}

		
	

		msgcoords = {top:($(".msg").	offset().top * pxToVWAdjuster) + "vw", 
						left:($(".msg").offset().left * pxToVWAdjuster) + "vw"
		}

		log.debug("MsgCOORDS")
		log.debug(msgcoords)


		//Convert Coords to VW
		//$(".msg").css({top:($(".msg").offset().top * pxToVWAdjuster) + "vw",left:($(".msg").offset().left * pxToVWAdjuster) + "vw"})
		//$(".peak").css({top:($(".peak").offset().top * pxToVWAdjuster) + "vw",left:($(".peak").offset().left * pxToVWAdjuster) + "vw"})
	


		//now that placement is correct, color it active if necessary
		if(element.id == $(".active-message").attr("parent") || isActive) {

			oldAct = $(".active-message").clone();
			$(".active-message").remove();
			$(".active-peak").remove();


			$(".msg").addClass("active-message").removeClass("msg").attr("parent",element.id);
			$(".peak").addClass("active-peak").removeClass("peak")

			oldAct.remove();

		}

		$(".active-message").css("overflow","auto")


		noteShowing = true;

	

		//write changes to parent object
		$(".quick-disabled").on("input",QUICK_EDIT)

						.on("click",function(et){$(et.target).attr("value") == 'url("https://fponly.files.wordpress.com/2010/04/fpo_logo_02.gif")' ? $(et.target).attr("value","") : ""})
						.on("mouseenter",function(et){$(et.target).addClass("quick-edit"); $(et.target).attr("ov",$(et.target).attr("value"))})
						.on("mouseleave",function(et){
							targ = $(et.target);
							targ.removeClass("quick-edit");
							if(targ.attr("value") != targ.attr("ov")){
								CUSTOM_DONE_NOTE_EDITING_LOGIC(et);
							}

						})
						
						
	} 

	return msgcoords;
}

/*
* Save changes to selected Object
*/
function QUICK_EDIT(evnt){
				//evnt.preventDefault();
	
	//Turn of autosave temporarily
	SAVE_okToSave = false;				

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

			//Turn Autosave back on again. Now that user is done editing
			SAVE_okToSave = true;	

			log.debug("NOTES.js: Firing : " + label + " ==> " + $(evnt.target).val())
			log.debug("NOTES.js: Webkit : " + $(parent).css("-webkit-text-fill-color"))

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

