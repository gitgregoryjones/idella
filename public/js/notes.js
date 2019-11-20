
var NOTES_timer = null;

var userHoveringOverNote = false;
var userEditing = false;

var LOCKED = false;

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
	//$(".widget-off,.widget-on").remove();
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

//Repositions all slashes to location of parent object in case they moved
function refreshSlashes(){

	$("[slash-for").each(function(idx,it){
		it = $(it);
		var parentObject = $(it.attr("slash-for"));

		parentObject.show();
		it.css({left:parentObject.offset().left, 
								top:parentObject.offset().top + parentObject.height()/2 })

		parentObject.hide();


	})

}


function NOTES_makeNote(element,isActive){

	
	if(!$(element).hasClass("dropped-object") && !$(element).attr("[type=option]")){
		NOTES_delete()
		return;
	}

	
	var theElem = $(element);

	//$(".fa-lock").remove();

	$(".widget-off").remove();

	var key = "#" + $(theElem).attr("id") + "-widget";

	var lock = "#" + $(theElem).attr("id") + "-lock";

	var widgets = $(key);	

	var widgetWidth = 0;

	log.debug(`The key to the lock is ${key}`)

	if(widgets.length == 0){

		log.debug("Making lock")

		widgets = $("<div>",{color:"yellow", class:"widget-off",id:$(theElem).attr("id")+"-widget"})
				.css({border:"1px solid navy","text-align":"center","background-color":"black"})

		lock = $("<div>",{class:"fa fa-lock",id:$(theElem).attr("id")+"-lock"}).appendTo(widgets)


		widgets.appendTo($(theElem));

		

		lock.on("click",function(event){
						event.stopPropagation();

						var myParent = $(event.target).parents(".dropped-object").first();

						currentCtx = myParent;
						
						var unLocked = $(this).is(".fa-unlock");

						

						if(unLocked){
							NOTES_delete();
							
							$("[data-action=lessOptions]").click();
							$(this).removeClass("fa-unlock").addClass("fa-lock")
							widgets.removeClass("widget-on").addClass("widget-off")
							return;
							//$(document).click();
						} else {
							$(".widget-on").remove()
							$("[data-action=moreOptions]").click();
							$(this).removeClass("fa-lock").addClass("fa-unlock")
							widgets.removeClass("widget-off").addClass("widget-on")

						 	NOTES_makeNote(myParent,true)

							//Highlight the layer on the Layers Menu (if shown)
							//import layers-menu.js
							//updateLayersTool($(myParent).attr("id"));
							

							
							/*
							var lilEye = $("<div>",{class:"fa fa-eye",id:$(theElem).attr("id")+"-plus"})

							if( $(`#${$(theElem).attr("id")+"-plus"}`).length == 0){
								lilEye = $("<div>",{class:"fa fa-eye",id:$(theElem).attr("id")+"-plus"}).appendTo(widgets).css({"padding-left":"5px"})
							} else {
								lilEye = $(`#${$(theElem).attr("id")+"-plus"}`);
							}
							

							lilEye.off().on("click",function(evnt){

								evnt.stopPropagation();

								var slash = $("<div>",{class:"fa fa-eye-slash",id:$(theElem).attr("id")+"-plus"}).appendTo($("body"))

								slash.attr("slash-for",`#${theElem.attr("id")}`)

								slash.css({"font-size":"32px","text-align":"center","background-color":"silver","color":"white",position:"absolute"})
												
								//now position it
								

								slash.attr("title",`click to show ${theElem.attr("id")}`)

								slash.on("mouseenter",function(){

									theElem.fadeIn();

								}).on("mouseleave",function(){

									theElem.fadeOut();

								}).on("click",function(evnt){

									theElem.hide();
									theElem.fadeIn();
									//Remove This
									$(evnt.target).remove();
								})

								theElem.hide();

								refreshSlashes();

								widgets.remove();

								NOTES_delete();

							})

							lilEye.attr("title",`click to hide ${theElem.attr("id")} from view`)

						*/

							
							//$(document).click();
						// 	NOTES_makeNote(myParent,true)
							//If Text Type, give more room in UI by removing the helper
							if(myParent.is("[type=T]")){
								//widgets.remove();
							}
							updateLayersTool($(myParent).attr("id"));
							console.log("Calling update Layers Tool");
							return;
						}
					
						
						
						
						//NOTES_makeNote($(theElem),true);
						
				
						
		})

		if(objectIsReordable($(theElem))){
							currentCtx = $(theElem);
							
							$(widgets).append($("<div>",{class:"fa fa-caret-up",id:$(theElem).attr("id")+"-before"})
									.off("click").on("click",function(event){

										event.stopPropagation();
										$("[data-action=insertBefore]").click();
										NOTES_makeNote($(theElem))
										refreshSlashes();
									}))
							$(widgets).append($("<div>",{class:"fa fa-caret-down",id:$(theElem).attr("id")+"-after"})
								.off("click").on("click",function(event){
										event.stopPropagation();
										$("[data-action=insertAfter]").click();
										NOTES_makeNote($(theElem))
										refreshSlashes();
									}))
		}

		var title = $(theElem).attr("alias") ? $(theElem).attr("alias") : $(theElem).attr("id");

		//lock.wrap(`<a href=\"#\" title=\"${title}\"></a>`)
		lock.attr("title",title)

		
		widgets.children().each(function(idx,it){
			it = $(it).css({width:"30px"});
			if(idx > 0 ){
				it.css({"padding-left":"5px"})
			}
			widgetWidth += it.outerWidth();
			log.debug(`width of index ${idx} is ${it.width()}`)
		})

		widgets.css({position:"absolute", left:$(theElem).width()/2 - parseInt(widgetWidth)/2, top:0
				,"-webkit-text-fill-color":"gold",color:"gold","font-size":"30px"})

		log.debug(`Widget is on or off?  It is ${widgets.attr("class")} and total width is ${widgetWidth}`);
			
	} 
	
	

	if(!widgets.is(".widget-on")){
		return
	} 

	var blurInitialized = false;


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


	log.debug("CUSTOM_currentlyMousingOverElementId != $(element).attr(\"id\") is " + CUSTOM_currentlyMousingOverElementId + " ==? " + $(element).attr("id") )

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

		theMsg = $("<div class='msg' msg-parent='" + element.id + "'>"+$(element).attr("type") + "#" + $(element).attr("id") + " " + ($(element).attr("alias") != undefined ? " [alias= " + $(element).attr("alias") +"]" : "") + "</div>" );

		theMsg.append("<div>Left : " + $(element).offset().left + ", Top: "+ $(element).offset().top + ", Height: "+ $(element).height() + ", Width: "+ $(element).width() +"</div>")
		
		if(!element.is("[type=PLUGIN]")){

			color = $(element).css("background-color")
			image =  $(element).is("[type=VID],[type=SITE]") ? $(element).find(".content-image").attr("src") : $(element).css("background-image")
			txtColor = $(element).css("-webkit-text-fill-color")
			fontFamily  = $(element).css("font-family")
			href = $(element).attr("href") != undefined ? $(element).attr("href") : "none" ;

			if(element.is("[type=FIELD]")){
				//visible txt, hidden value
				var stype = $("<select>").append(new Option("checkbox","checkbox"))
							.append(new Option("text area","textarea"))
							.append(new Option("input field","input"))
							.append(new Option("radio group","radio"))
							.append(new Option("select field","select"));
					theMsg.append($("<div style='display:inline-block; margin-right:10px'>Type:</div>").append(stype));

					//AutoSelect option based on what user chose last
					if(element.children("[id*=-control]").find("[type]").length > 0){
						var theType = element.children("[id*=-control]").find("[type]").attr('type').toLowerCase();
						log.debug(`Looking for archType of ${theType}`)
						stype.find(`[value=${theType}]`).attr('selected','selected');
					}

					stype.on('change',function(){
						var archType = $(this).find(":selected").attr("value").trim().toUpperCase();
						CONTROLS_makeFormFieldFor(element.children("[id*=-control]"),archType);
						//element.resizable("enable");
						//element.resizable();
					})
			} else {
				theMsg.append(" <div>Link To Page: <input type='text' class='quick-disabled' name='href' parent='" + element.id + "' value='" + href + "'></div>")
			}
			
/*
			color = $(element).css("background-color")
			image =  $(element).is("[type=VID,[type=SITE]") ? $(element).find(".content-image").attr("src") : $(element).css("background-image")
			txtColor = $(element).css("-webkit-text-fill-color")
			fontFamily  = $(element).css("font-family")*/

			videoOrImage = $(element).is("[type=VID],[type=SITE]") ? "src" : "background-image";

			if(element.is("[type=T], [type=LIST]")){

				if(element.is("[type=T]")){

					

					

					var content = $(element).text();

					
					
					theMsg.append(" <div style='display:inline-block'> Value: <input type='text' class='quick-disabled' name='content' parent='" + element.id + "' value='" + content + "'></div>").append("<br>")

					/*
					stype = $("<select>").append(new Option("paragraph","paragraph")).append(new Option("menutext","menutext"));
					theMsg.append($("<div style='display:inline-block; margin-right:10px'>Type:</div>").append(stype));

					//AutoSelect option based on what user chose last
					if(element.find(".menutext").length > 0){
						stype.find("[value=menutext]").attr('selected','selected');
					}

					stype.on('change',function(){
					
						if($(this).find(":selected").attr("value") == "menutext"){
							element.attr("archType","BUTTON")
							element.find("p").remove();
							element.find("[type=MENU-ITEM]").css("margin-left","20px").addClass("menutext");
						} else {
							element.removeAttr("archType")
							element.find("[type=MENU-ITEM]").css("margin-left",0).removeClass("menutext").append($("<p>")).removeAttr("archType")
							//:not(:last)
						}
						//element.resizable();
					})
					*/


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
				theMsg.append(" <div>Image: <input type='text' class='quick-disabled quick-disabled-image-field' name='" + videoOrImage + "' parent='" + element.id + "' value='" + image + "'></div>")
			}

			theMsg.append("<div style='display:inline-block'></div>Bckgrnd Color: <div background-color-for='#"+element.id + "' style='display:inline-block;height:10px;width:10px;border:1px solid black;background-color:"+ color + "'/>")
			theMsg.append(" <div style='display:inline-block'><input type='text' class='quick-disabled quick-color' name='background-color' parent='" + element.id + "' value='" + color + "'></div>")
			
			//theMsg.append(" <div>Font: <select name='font-family' parent='" + element.id + "' value='" + fontFamily + "'></div>")
			
			//Do Font Stuff
			var ftype = $(`<select name='font-family' parent='${element.id}'>`);

					


					var fonts = $("html").attr("fonts").split(",");

					fonts.forEach(function(font){
						var option = new Option(font,font);
						$(option).css("font-family",font);
						ftype.append(option)
					})

					//AutoSelect option based on what user chose last
					if(element.css("font-family")){
						ftype.find(`[value="${$(element).css("font-family").replace(/"/g,"")}"]`).attr('selected','selected');
					}

					ftype.on('change',function(){
						element.css("font-family",$(this).find(":selected").attr("value"));
					})

			theMsg.append(ftype)
			theMsg.append($(`<div editor-icon-for="#${element.attr("id")}" style="padding:5px; border:1px solid white; font-size:16px; margin-left:5px" orientation="start" class="fa fa-align-left"></div>`))
			theMsg.append($(`<div editor-icon-for="#${element.attr("id")}" style="padding:5px; border:1px solid white; font-size:16px; margin-left:5px" orientation="center"  class="fa fa-align-center"></div>`))
			theMsg.append($(`<div editor-icon-for="#${element.attr("id")}" style="padding:5px; border:1px solid white; font-size:16px; margin-left:5px" orientation="right"  class="fa fa-align-right"></div>`))
			theMsg.append(" <div style='display:inline-block'> Text Color: <div color-for='#" +element.id + "' style='display:inline-block;height:10px;width:10px;border:1px solid black;color:"+ color + "'/><input type='text' class='quick-disabled' name='color' parent='" + element.id + "' value='" + txtColor + "'></div>")
			
		
		} else {
			list = PLUGINS_getPluginList();
			select = $("<select>").append(new Option("choose a plugin","none"));
			for(idx in list){
				plugin = list[idx]
				select.append(new Option(plugin.alias,plugin.file))
			}
			log.debug("NOTES.js: This is cool")
			log.debug(select)
			theMsg.append($("<div style='display:inline-block'>Library:</div>").append(select));
			
			select.on('change',function(){
				
				PLUGINS_getPlugin(element,"napkin-"+ $(this).find(":selected").attr("value"))
				element.resizable();
			})
		}
		
		theMsg.off().on('mouseenter',function(){
			userHoveringOverNote = true;
			$(document).unbind("keydown",CUSTOM_KEYDOWN_LOGIC)
		}).on('mouseleave',CUSTOM_DONE_NOTE_EDITING_LOGIC);

	
		$("body").append(theMsg);


		$("body").append("<div class=\"peak\" msg-parent='" + element.id + "'>&nbsp;</div>")

		//Now Add Events to Text Alignment Editor Icons since they are finally part of the DOM
		$('[editor-icon-for]').each(function(idx,it){

				var key = $(it).attr("editor-icon-for")

				var theParent = $(key);

				var alignment = theParent.css("text-align")

				if($(it).attr("orientation") == alignment){
					$(it).css({"background-color":"navy"})
				}

		})


		$('[editor-icon-for]').on("click",function(){

			
				element.css({"text-align":$(this).attr('orientation')})

				$('[editor-icon-for]').css("background-color","initial")
				$(this).css("background-color","navy");
				$(this).attr("off","navy")

		}).on("mouseenter",function(){
				$(this).attr("off",$(this).css("background-color"))
				$(this).css({"background-color":"black"})
		}).on("mouseleave",function(){

				$(this).css({"background-color":$(this).attr("off")})
		})


		//position bar in correct place so it does not overrun the screen
		if(parseInt($(element).offset().left) + $(".msg").width()  > $("body").width()){
			log.debug("Slide Left " + $(element).attr("id")) 
			$(".msg").css({position:"absolute",top:parseInt($(element).offset().top- $(".msg").height() - 40), left:parseInt($(element).offset().left)-160})
			$(".peak").css({position:"absolute",top:parseInt($(element).offset().top)-20, left:parseInt($(element).offset().left)+20})
		} else {
			log.debug("Default Slide Left " + $(element).attr("id")) 
			$(".msg").css({position:"absolute",top:parseInt($(element).offset().top)- $(".msg").height() - 40, left:parseInt($(element).offset().left)})
			$(".peak").css({position:"absolute",top:parseInt($(element).offset().top)-20, left:parseInt($(element).offset().left)+20})

		}

/*
		$(".msg").css({left:myPage.X-20, top:myPage.Y - $(".msg").height() -40})
		$(".peak").css({left:myPage.X + 20,top:myPage.Y - $(".peak").height() - 20})
		*/
		if(element.id == "drawSpace"){
			//just delete messaging for now. It does not look good onscreen
			/*
			$(".msg").css({position:"absolute",top:parseInt($(element).offset().top) + $(element).height() - $(".msg").height() - 20, left:parseInt($(element).offset().left)+10})
			$(".peak").css({position:"absolute",top:parseInt($(element).offset().top) + $(element).height() -20, left:parseInt($(element).offset().left)+20})
			*/
			//$(".msg,.peak").remove();
		} else

		//last check, if rendered bar too close to top. move bar and peak again
		if(parseInt($(element).offset().top) - $(".msg").height() -20  < 0){


			//ok, this is really the last last check.  If to close to bottom, flip again
			if(parseInt($(element).offset().top) + $(element).height() + $(".msg").height() + 20 > $("#drawSpace").height()){

				//Place in bottom left corner of element
				log.debug("Bottom Left " + $(element).attr("id")) 
				$(".peak").css({position:"absolute",top:parseInt(($(element).offset().top + $(element).height()) - 20 )})
				$(".msg").css({position:"absolute",top:parseInt($(".peak").offset().top - $(".msg").height() - 20)})
			} else {
				log.debug("Top Left " + $(element).attr("id")) 
					$(".msg").css({position:"absolute",top:parseInt($(element).offset().top) + $(element).height() + 20 })
					
					//flip vertically
					$(".peak").css({"-ms-transform": "rotate(180deg)","-webkit-transform": "rotate(180deg)","transform": "rotate(180deg)"})
					$(".peak").css({position:"absolute",top:parseInt($(".msg").offset().top) - 35})
				}

		}

		//$(".msg").css({top:myPage.Y - $(".msg").height()*1.1,left:myPage.X})
	

		msgcoords = {top:($(".msg").offset().top * pxToVWAdjuster) + "vw", 
						left:($(".msg").offset().left * pxToVWAdjuster) + "vw"
		}


		

		log.debug("MsgCOORDS")
		log.debug(msgcoords.top)


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
		//Add 'Edit Box'
		var ii = 0;
	

		noteShowing = true;



		//write changes to parent object
		$(".quick-disabled").on("input",QUICK_EDIT)

						.on("dblclick",function(et){this.value=""})
						.on("click",function(et){
						//Do Default

							$(et.target).attr("value") == 'url("https://fponly.files.wordpress.com/2010/04/fpo_logo_02.gif")' ? $(et.target).attr("value","") : "";


							if($(et.target).attr("name") != "content"){
								log.debug("Not a text type...returning")
								return;
							}

							var parent = $("#" + $(et.target).attr("parent"));

							//DRAW_SPACE_advancedShowing = false;

							const regex = /<div (?:icon="fa\-\S+")? class="\s*fa\s+(fa\-\S+)"\s*(?:style=".*")?><\/div>/gim;

							const str = `$1`
							/*
							if(parent.html()){
								$(parent).html($(parent).html().replace(regex,str))
							}*/
							console.log(`Before Parent html is ${parent.text()}`)
							console.log(`After Parent html is ${parent.text().replace(regex,str)}`)

							$(parent).contents().get(0).nodeValue = $(parent).text().replace(regex,str)

							//$(et.target).val($(parent).text())

						})

						.on("mouseenter",function(et){
							userHoveringOverNote = true;
							$(et.target).addClass("quick-edit"); $(et.target).attr("ov",$(et.target).attr("value"))
						})
						.on("mouseleave",function(evnt){
							targ = $(evnt.target);
							targ.removeClass("quick-edit");
							if(targ.attr("value") != targ.attr("ov")){
								CUSTOM_DONE_NOTE_EDITING_LOGIC(et);
							}

						

							userHoveringOverNote = false;
							var parent = $("#" + $(evnt.target).attr("parent"));
							//parent.resizable("disable").resizable();

							log.debug("CHANGING IT UP BABY")


							//Moved to QUICK_EDIT

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

	//Signal On change for Label. Since user is modifying the note field for the label, trigger
							//the parent "Label field so that is modifies the control 'name' field with  value "
							//var parent = $("#" + $(et.target).attr("parent"));
							

	var label = $(evnt.target).attr("name");

			if(label == "class"){
				//do nothing.  wait until class is complete
				$(parent).addClass($(evnt.target).val())
				$(parent).attr("user-classes",$(event.target).val())	
			}else if(label == "src" || label == "align"){
				$(parent).find(".content-image").attr("src",$(evnt.target).val());
				//$(parent).find(".content-image").attr(label,$(evnt.target).val())
				//$(parent).find("video").first().attr(label,$(evnt.target).val())
				//https://www.uvm.edu/~bnelson/computer/html/wrappingtextaroundimages.html
				if(label == "align"){
					$(parent).find("br").attr(clear,$(evnt.target).val())
				}
				

			}else if(label.startsWith("font") || label.startsWith("text")){
				$(parent).css(label,$(evnt.target).val())
                // $(parent).find("[type]").css(label,$(evnt.target).val())  
            }  else if(label == "color"){
					$(parent).css("-webkit-text-fill-color",$(evnt.target).val())
					
					$(parent).find("[type]").css("-webkit-text-fill-color",$(evnt.target).val())

					var opt = $(evnt.target).parents(".active-message").find("[color-for]").css("background-color",$(evnt.target).val())

					console.log(`Found color parent for ${opt.length}`)

			}  else if(label == "background-image" && !($(evnt.target).val().startsWith("url(")) ){

                        theValue = "url(" + $(evnt.target).val() + ")"

                        $(parent).css(label,theValue)

                        $(parent).css("background-size","cover")

                    
				
			} else if(label == "content"){

					log.debug("User changing text to " + $(evnt.target).val())

					var idx =0;

					var final = "";

					/*
					$(parent).contents().filter(function() { 
					    //Node.TEXT_NODE === 3
					    return (this.nodeType === 3);
					}).each(function () {
					    // for each text node, do something with this.nodeValue
					    //if(idx == 0){
					    	this.nodeValue = $(evnt.target).val()

					    //}
					});*/

					$(parent).contents().get(0).nodeValue = $(evnt.target).val();

					
			}else {

				//if this is NOT custom css option. ie how we define components, write as attribute
				if(!$(parent).css(label)){
					$(parent).attr(label,$(evnt.target).val())
				} else {
				$(parent).css(label,$(evnt.target).val())
				//if this is a custom css option. ie how we define components, write as attribute
				}

				if(label == "background-color"){
					

					var opt = $(evnt.target).parents(".active-message").find("[background-color-for]").css("background-color",$(evnt.target).val())

					
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

			
			if(parent.is("[type=T]")){

								if(parent.text().trim() == "fa-bars"){
									//Write JS
									$(parent).attr("id","zMenu")
									var id = "#" + $(parent).attr("id");
									var jsString = `$("${id}").on("click",onMenu)`;
									if(getJs(parent) == null){
										eval(jsString)
									}
									$(parent).css("--webkit-user-modify","read-only")
									saveJs(parent,jsString);

								}

								const regex = /((fa-\w+)(?:-\w+)?)/igm;

								const subst = `<div icon="$1" class="fa $1"></div>`;
								
								//$(parent).contents().get(0).replaceWith($(parent).text().replace(regex,subst));

								/*
								var matches = $(parent).text().match(regex)

								if(matches && matches.length > 0){
									console.log("Found matches " + matches)
									$(parent).children("[icon]").remove();




									$(parent).contents().get(0).replaceWith($(parent).text().replace(regex,subst))
								}
								*/

								
								$(parent).contents().filter(function() { 
								    //Node.TEXT_NODE === 3
								    return (this.nodeType === 3);
								}).each(function () {
								    // for each text node, do something with this.nodeValue
								    
										//alert($(div).html())
										//this.nodeValue = (this.nodeValue.replace(regex,subst))
										$(this).replaceWith(this.nodeValue.replace(regex,subst))

								    
								});



								
			} 


	

			if(parent.attr("href") != undefined){
				//alert('hrefs is ' + parent.attr('href'))
					
					//if(loc.trim().length  > 0){

						createAnchorFor(parent);
				
					//}
			} 
		
	parent.trigger("input")
}

