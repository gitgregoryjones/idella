
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

	//if called from drawSpace.js function with clone of the page
	if(element){
		element.find(".msg,.active-message").remove();
		element.find(".peak,.active-peak").remove();
	} else {

		//We are not in the middle of a save. Just delete notes from screen as user wants
		$(".msg,.active-message").remove();
		$(".peak,.active-peak").remove();
	}
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

function NOTES_makeHighLightBox(element){

	element = $(element)

	$(".dropped-object").removeClass("highlight");

	element.addClass("highlight");


}


function NOTES_makeNote(element,isActive){

	//console.log("ERROR: Making Note for " + element[0].id)

	//NOTES_makeHighLightBox(element);

	/* Immediately return if we are not actively editing the page */
	if(!editing){
		return;
	}

	
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

		widgets = $("<div>",{color:"yellow", widget:"enabled",class:"widget-off",id:$(theElem).attr("id")+"-widget"})
				.css({cursor:"pointer",visibility:"hidden",border:"1px solid navy","text-align":"center","background-color":"black"})

		lock = $("<div>",{class:"fa fa-lock",lock:"enabled",id:$(theElem).attr("id")+"-lock"}).appendTo(widgets)

		/*

		if($(theElem).is("[type=T]")){
			widgets.css({visibility:"hidden"});
			lock.css({visibility:"hidden"});
			//On Click of Text will open controls

		}*/

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
							$(`[layer=${$(myParent).attr("id")}]`).removeAttr("active");

							return;
							//$(document).click();
						} else {
							$(".widget-on").remove()
							$("[data-action=moreOptions]").click();
							//$("#editSpace").animate({top:$(currentCtx).offset().top})
							$(this).removeClass("fa-lock").addClass("fa-unlock")
							widgets.removeClass("widget-off").addClass("widget-on")


						 	NOTES_makeNote(myParent,true)

						 	var zId = `#z${$(myParent).attr("id")}`
						 	console.log(`Mini preview is ${zId}`)
							var bgImg = $(zId).css("background-image");
							console.log(`read background image as ${bgImg}`)

							var miniObj = $(`#${$(myParent).attr("id")}`).clone(false);

							miniObj.children().remove();

							miniObj.attr("id",`z${miniObj[0].id}`);

							$(miniObj).attr("style","");

							miniObj.css("border","none").removeClass("submenu").removeClass("squarepeg").removeClass("dropped-object").removeClass("ui-resizable ui-draggable ui-draggable-handle ui-droppable")

							miniObj.css({ width:$(".mini-preview").width(), height:$(".mini-preview").height(), top:0, left:0, position:"relative"}).removeClass(".dropped-object").find('[class^=ui]').remove();

							var label = $(miniObj).attr("alias") ? $(miniObj).attr("alias") : miniObj.attr("type");

							$("#header .details").find("input").val(label);


							$(".mini-preview").children().remove();
							


							$(".mini-preview").append(miniObj);
							//$(".mini-preview").css("background-color","purple")
							/*
						 	if($("#maincontent").attr("showing") == "0" || $("#maincontent").attr("showing") == undefined){
								$("#editSpace").css({top:0,left:0,width:"99%",height:"99%",display:"inline-block",position:"relative"})
								$("#editSpace").insertAfter($("#maincontent").find(`[layer=${myParent.attr('id')}]`)).css("top");
							} else	if($("#maincontent").attr("showing") == "1"){
								return;
							}*/


							$("#editSpace").css({top:0,left:0,width:"99%",height:"99%",display:"inline-block",position:"relative"})

							/**. HIDE THE HEADER... NOT NEEDED SINCE WE FIGURED OUT THE SCROLL PROBLEM **/
							$("#header").hide();

						//	if(layerShowingAtPositionZero()){
								/*
								var blur = 2;
								var duration = 1000;

								//$("#editSpace").insertAfter($("#maincontent").find(`[layer=${myParent.attr('id')}]`)).css("top");
								//do nothing...already showing
								$("#header, #editSpace").css({filter:"blur(4px)"})

								$("#editSpace").fadeOut(300,function(){
									$("#editSpace").fadeIn();
									$("#header,#editSpace").animate({filter:"blur(0)"},{
										progress: function(anime, progress,remaining){
											console.log(`I'm chaning blur to ${progress}/${remaining}`)
											if(( 25 % Math.round(progress * duration/remaining)) == 0){
													blur -= 1;
													
													$("#header,#editSpace").css({filter:`blur(${blur}px)`})

											}

										},
										duration : duration
									})
								})
								*/


			//					} else {

								$("#editSpace").insertAfter($("#maincontent").find(`[layer=${myParent.attr('id')}]`)).css("top");
								//$("#maincontent").css({"overflow-y":"hidden"})

								var contrast = 200;
								var duration = 1000;

								//$("#editSpace").insertAfter($("#maincontent").find(`[layer=${myParent.attr('id')}]`)).css("top");
								//do nothing...already showing
								//$("#header, #editSpace").css({filter:"contrast(200%)"})

								/*$("#editSpace").fadeOut(300,function(){
									$("#editSpace").fadeIn();
									/*$("#header,#editSpace").animate({filter:"contrast(0%)"},{
										progress: function(anime, progress,remaining){
											console.log(`I'm chaning blur to ${progress}/${remaining}`)
											if(( 25 % Math.round(progress * duration/remaining)) == 0){
													contrast -= 1;
													
													$("#header,#editSpace").css({filter:`contrast(${contrast}px)`})

											}

										},
										duration : duration
									})
								})*/
						//	}
						 


						
							//$(document).click();
						// 	NOTES_makeNote(myParent,true)
							//If Text Type, give more room in UI by removing the helper
							if(myParent.is("[type=T]")){
								//widgets.remove();
							}

							updateLayersTool($(myParent).attr("id"));

							$(`[layer=${$(myParent).attr("id")}]`).attr("active","true");


							log.debug("Calling update Layers Tool");
							//impor layers.js scroll to layer
							if(!$(this).is(".alreadyscrolled")){
								scrollToLayer($(myParent).attr("id"));
								$(this).removeClass("alreadyscrolled");
							} 
							

							
							

							return;
						}
					
						
						
						
						//NOTES_makeNote($(theElem),true);
						
				
						
		})

		if(objectIsReordable($(theElem))){
							currentCtx = $(theElem);
							currentCtx.target = theElem;

							$(widgets).append($("<div>",{class:"fa fa-caret-up",id:$(theElem).attr("id")+"-before"})
									.unbind("click").on("click",function(event){
										console.log(`Reordering an element Before`)
										
										r_InsertBefore(currentCtx);
										//event.stopPropagation();
										//$("[data-action=insertBefore]").click();
										NOTES_makeNote($(theElem))
										refreshSlashes();
									}))
							$(widgets).append($("<div>",{class:"fa fa-caret-down",id:$(theElem).attr("id")+"-after"})
								.unbind("click").on("click",function(event){
										//event.stopPropagation();
										//$("[data-action=insertAfter]").click();
										console.log(`Reordering an element After`)
										r_InsertAfter(currentCtx);
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

		if(!theElem.is("[type=T]")){
			widgets.css({position:"absolute", visibility:"visible", left:$(theElem).width()/2 - parseInt(widgetWidth)/2, top:0
				,"-webkit-text-fill-color":"gold",color:"gold","font-size":"30px"})

		} else {
			
			widgets.css({position:"absolute", visibility:"hidden",left:$(theElem).width()/2, top:0
				,"-webkit-text-fill-color":"gold",color:"gold","font-size":"30px"})

			//widgets.remove();
			
			//NOTES_delete()
			//NOTES_makeNote(theElem);
			//lock.click();
		}
		//lock.click();	

		log.debug(`Widget is on or off?  It is ${widgets.attr("class")} and total width is ${widgetWidth}`);
			
	} 
	


	

	if(!widgets.is(".widget-on")){
		return
	} 

	/*
	if($(theElem).is("[type=T]")){
		widgets.css({visibility:"hidden"})
		widgets.find("[lock]").click();
		
		//NOTES_makeNote(myParent,true);
		//updateLayersTool($(theElem).attr("id"));
	}*/

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


	if(!element.id)
  		log.debug(`Element does not have an id ${element}[0].outerHTML`)

	if(element.id){
	
		log.debug("NOTES.js: Entering parent " + element.id + " with X, Y " + $(element).css("left") + "," + $(element).css("top"))

		theMsg = $("<div class='msg' msg-parent='" + element.id + "'>"+$(element).attr("type") + "#" + $(element).attr("id") + " " + ($(element).attr("alias") != undefined ? " [alias= " + $(element).attr("alias") +"]" : "") + "</div>" );

		theMsg.append("<div>Left : " + parseInt($(element)[0].offsetLeft) + ", Top: "+ parseInt($(element)[0].offsetTop) + ", Height: "+ parseInt($(element).outerHeight()*1.5) + ", Width: "+ parseInt($(element).outerWidth()*1.5) +"</div>")
		
		if(!element.is("[type=PLUGIN]")){

			color = $(element).css("background-color")
			image =  $(element).is("[type=VID],[type=AUDIO],[type=SITE]") ? $(element).find(".content-image").attr("src") : $(element).css("background-image")
			var hover = r_lookupHover(element);
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
				theMsg.append("<div class='note-label' style=''>Page Link: <input type='text' class='quick-disabled' name='href' parent='" + element.id + "' value='" + href + "'></div>")
			}
			
/*
			color = $(element).css("background-color")
			image =  $(element).is("[type=VID,[type=SITE]") ? $(element).find(".content-image").attr("src") : $(element).css("background-image")
			txtColor = $(element).css("-webkit-text-fill-color")
			fontFamily  = $(element).css("font-family")*/

			videoOrImage = $(element).is("[type=VID],[type=AUDIO],[type=SITE]") ? "src" : "background-image";

			if(element.is("[type=T], [type=LIST]")){

				if(element.is("[type=T]")){

					
					/** No Longer Needed. Simplify UI by allowing person to only change text from
					input contenteditable

					

					var content = $(element).text();

					
					
					theMsg.append(" <div style='display:inline-block'> Value: <input type='text' class='quick-disabled' name='content' parent='" + element.id + "' value='" + content + "'></div>").append("<br>")
					**/

				} else {

					ltype = $("<select>").append(new Option("adaptive","adaptive")).append(new Option("gallery","gallery"));
					theMsg.append($("<div style='margin-right:10px'>Type:</div>").append(ltype));

					element.addClass("adaptive")

					//AutoSelect option based on what user chose last
					if(element.hasClass("gallery")){
						ltype.find("[value=gallery]").attr('selected','selected');
						element.addClass("gallery").removeClass("adaptive");
					}

					

					ltype.on('change',function(){
					
						if($(this).find(":selected").attr("value") == "adaptive"){
							element.removeClass("gallery");
							element.addClass("adaptive")
						
							SLIDER_deInit(element);
							//element.children(".dropped-object").css({left:"0px",position:"relative"})

						} else {
							element.addClass("gallery")
							element.removeClass("adaptive")
							//element.css("white-space","nowrap");
							//duration = (element.css("transition-duration"))
							
							//duration = parseFloat(duration) == 0 ? "0.6s" : duration;
							
	
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
				theMsg.append(" <div class='note-label' style=''>Background Image: <input placeholder='enter url or upload' type='text' class='quick-disabled quick-disabled-image-field' name='" + videoOrImage + "' parent='" + element.id + "' value='" + image + "'><div background-color-for='#"+element.id + "' style='display:inline-block;vertical-align: top;height:20px;width:20px;border:1px solid black;background-size:contain;background-image:"+ image + "'/></div></div>")
				theMsg.append(" <div class='note-label' style=''>onHover: <input type='text' class='quick-disabled quick-disabled-image-field' name='onhover' parent='" + element.id + "' value='" + hover + "'></div>")
			}

			if(!element.is("[type=SVG]")){
			
				theMsg.append("<div class='note-label' style=''>Bg Color: <input type='text' style='display:inline-block' class='quick-disabled quick-color' name='background-color' parent='" + element.id + "' value='" + color + "'><div background-color-for='#"+element.id + "' style='display:inline-block;vertical-align: top;height:20px;width:20px;border:1px solid black;background-color:"+ color + "'/></div></div>")
				//theMsg.append(" <input type='text' class='quick-disabled quick-color' name='background-color' parent='" + element.id + "' value='" + color + "'>")
			}
			//theMsg.append(" <div>Font: <select name='font-family' parent='" + element.id + "' value='" + fontFamily + "'></div>")
			
			if(element.is("[type=T]")){
				//Do Font Stuff
				//var ftype = $(`<select name='font-family' parent='${element.id}'>`);
				var ftype = $(`<div class='note-label' style=''>Font <input type='text' class='quick-disabled quick-color' name='font-family' parent="${element.id}" value='${element.css("font-family")}'></div>`)

				ftype.children("input").on('click',function(){
					showFontDropDown($(this))
				})		
	

						/*
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
						})*/

				theMsg.append(ftype)

			
				theMsg.append($(`<br><div editor-icon-for="#${element.attr("id")}" style="padding:5px; border:1px solid white; font-size:16px; margin-left:5px" orientation="start" class="fa fa-align-left"></div>`))
				theMsg.append($(`<div editor-icon-for="#${element.attr("id")}" style="padding:5px; border:1px solid white; font-size:16px; margin-left:5px" orientation="center"  class="fa fa-align-center"></div>`))
				theMsg.append($(`<div editor-icon-for="#${element.attr("id")}" style="padding:5px; border:1px solid white; font-size:16px; margin-left:5px" orientation="right"  class="fa fa-align-right"></div>`))
				
			
			}

			if(element.is("[type=SVG]")){
		/*		$( function() {
    $( "#slider" ).slider();

  } );*/		
  				theMsg.append("<div style='display:inline-block'></div>Fill Color: <div fill-color-for='#"+element.id + "' style='display:inline-block;height:10px;width:10px;border:1px solid black;background-color:"+ element.css("fill") + "'/>")
				theMsg.append(" <div style='display:inline-block'><input type='text' class='quick-disabled quick-color' name='background-color' parent='" + element.id + "' value='" + color + "'></div>")

  				theMsg.append("<div style='display:block'></div>Pen Color: <div pen-color-for='#"+element.id + "' style='display:inline-block;height:10px;width:10px;border:1px solid black;background-color:"+ $(element).css("stroke") + "'/>")
  				theMsg.append(" <div style='display:inline-block'><input type='text' class='quick-disabled quick-color' name='stroke' parent='" + element.id + "' value='"+ $(element).css("stroke") + "'></div>")
  				var startValue = parseFloat(element.css("stroke-width"));
  				
  				theMsg.append(`<br><div style="display:inline-block">Pen Width:&nbsp;</div>&nbsp;<div style="margin-left:10px; display:inline-block;width:0%" slider-for="${element.attr("id")}"></div> 
  								<script>
  								console.log("${element.attr('id')}")

  								$( function() {
  									
								    $( "[slider-for=${element.attr('id')}]" ).slider(
								    	{
								    		min:1,
								    		max:15,
								    		slide:r_sliderSVGPenStrokeValue,
								    		
								    		value: ${startValue}
								    	});
								} );
  								</script>
  							  `);
  							  
			} else {
				if(element.is("[type=T]"))
					theMsg.append(" <div style='display:inline-block'>Text Color:&nbsp;</div><div color-for='#" +element.id + "' style='display:inline-block;height:10px;width:10px;border:1px solid black;background-color:"+ txtColor + "'></div>&nbsp;<input type='text' class='quick-disabled' name='color' parent='" + element.id + "' value='" + txtColor + "'>")
			}
			
			
		
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
		
		theMsg.unbind("mouseenter").on('mouseenter',function(){
			userHoveringOverNote = true;
			$(document).unbind("keydown",CUSTOM_KEYDOWN_LOGIC)
		}).unbind("mouseleave").on("mouseleave",function(){
			userHoveringOverNote = false;
			$(document).unbind("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)
			NOTES_delete();

			//element.on("click",r_makeEditable).resizable("destroy").resizable({handles:"n,s,e,w,se"});

		})
		//.unbind("off").on('mouseleave',CUSTOM_DONE_NOTE_EDITING_LOGIC);

		theMsg.css({zIndex:CUSTOM_incrementZIndex()})

	
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


		$('[editor-icon-for]').unbind("click").on("click",function(){

			
				element.css({"text-align":$(this).attr('orientation')})

				$('[editor-icon-for]').css("background-color","initial")
				$(this).css("background-color","navy");
				$(this).attr("off","navy")

		}).unbind("on").on("mouseenter",function(){
				$(this).attr("off",$(this).css("background-color"))
				$(this).css({"background-color":"black"})
		}).unbind("mouseleave").on("mouseleave",function(){

				$(this).css({"background-color":$(this).attr("off")})
		})


		$(".msg").css({position:"absolute",top:myPage.Y - $(".msg").height() - 60, left:myPage.X -20})
		$(".peak").css({position:"absolute",top:$(".msg").offset().top + $(".msg").outerHeight() - 10, left:myPage.X })



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
		$(".active-peak").css("z-index",CUSTOM_incrementZIndex())

		noteShowing = true;






		//write changes to parent object
		$(".quick-disabled").on("input",QUICK_EDIT)


						.on("dblclick",function(et){this.value=""})
						
						.on("mouseenter",function(et){
							userHoveringOverNote = true;
							$(et.target).addClass("quick-edit"); $(et.target).attr("ov",$(et.target).attr("value"))
						})
						.on("mouseleave",function(evnt){
							userHoveringOverNote = false;
							targ = $(evnt.target);
							targ.removeClass("quick-edit");
							if(targ.attr("value") != targ.attr("ov")){
								CUSTOM_DONE_NOTE_EDITING_LOGIC(et);
							}

							log.debug(`Leaving the field quick-disabled ${$(targ).attr("parent")}`);
							updateLayersTool($(targ).attr("parent"));
							CUSTOM_PXTO_VIEWPORT($(`#${$(targ).attr("parent")}`));
						

							
							var parent = $("#" + $(evnt.target).attr("parent"));
							if(parent.is("[type=AUDIO]")){
								log.debug("Audio playing")
								try {
									parent.find("audio")[0].play();
								}catch(e){
									log.debug(`Failure playing audio for ${parent.attr("id")} ${e}`)
								}
							}

							var theHREF = parent.attr("href") ? parent.attr('href').trim() : undefined;
							//parent.resizable("disable").resizable();
							if(theHREF != undefined &&  !theHREF.startsWith("http") && !theHREF.startsWith("javascript:") && !theHREF.startsWith("#")){
							//alert(loc)

								loc =theHREF;


								if(loc.length > 0){
										if(loc.startsWith("/")){
											loc = loc.replace("/","");
										}
										
										REVISION_anchors.push(loc)
								} else {
										parent.find("[type=anchor]").remove();
										return;
								}
							} 


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

	//if we got here from styleTabs, use the "for" attribute, else use the parent attribute that came from popup Notes
	var parentId =  $(evnt.target).attr("parent") != undefined ? "#" + $(evnt.target).attr("parent") : `#${$(evnt.target).attr("for")}`


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
				if(parent.is("[type=VID]")){
					parent.find("video")[0].load();
				}
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

					log.debug(`Found color parent for ${opt.length}`)

			}  else if(label == "background-image" && !($(evnt.target).val().startsWith("url(")) ){

                        theValue = "url(" + $(evnt.target).val() + ")"

                        $(parent).css(label,theValue)

                        if($(evnt.target).val().startsWith("none")){
                        	 $(parent).css({"background-image":"url(https://res.cloudinary.com/practicaldev/image/fetch/s--P-zvMTgt--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/i/qyix6eyhrnc8x9c44yp2.jpg)"})
                        } else {
                        	  $(parent).css({"background-color":"transparent"})
                        }
                       

                         $(parent).css({"background-size":"cover"})

                    
				
			} else if(label == "background-color" && parent.is("[type=SVG]")) {
				console.log(`I see fill color ${label} ${$(evnt.target).val()}`)
				label = "fill";
				$(parent).css(label,$(evnt.target).val())
			}

			else {

				//if this is NOT custom css option. ie how we define components, write as attribute
				if(!$(parent).css(label)){
					$(parent).attr(label,$(evnt.target).val())
				} else {
				$(parent).css(label,$(evnt.target).val())
				//if this is a custom css option. ie how we define components, write as attribute
				}

				
			}

			if(label == "background-color"){
					

					var opt = $(evnt.target).parents(".active-message").find("[background-color-for]").css("background-color",$(evnt.target).val())
					
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

			

			if(parent.attr("href") != undefined){
				//alert('hrefs is ' + parent.attr('href'))
					
					//if(loc.trim().length  > 0){

						createAnchorFor(parent);
				
					//}
			} 
		
	parent.trigger("input")
}

function makeTextAwesome(string){


	words = string.split(/\s+/);





}
	