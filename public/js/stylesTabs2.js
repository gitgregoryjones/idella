//stylesTabs.js
var commonTabLabel = "common"

var generatedTabsForId = null;
var anchorsAway = false;
var copiesModified = false;
var showOverlays = true;
var groupResizeEnabled = false;
var reWritingEditSpace = true;
var STYLESTABS_forceRewrite = false;
var disableEventsFlag = false;
var lastTabBeforeSave = null;
var customListFields = ["transition-number-items","transition-cntrl-left","transition-cntrl-right"];
//var parent = currentCtx;



function writeTabs(currentCtx,forceWrite){




	currentCtx = currentCtx.target ? currentCtx.target : currentCtx;

	log.debug("Writing tab for " + $(currentCtx).attr("id") + " and generatedTabsForId " + generatedTabsForId)

	if(generatedTabsForId == $(currentCtx).attr("id")){

		if(forceWrite){
			//continue;
		
		} else {
			log.debug( "Quick return. Nothing to do for " + generatedTabsForId)
			return generatedTabsForId;
		}
	}


	var parent =currentCtx;

	if($(currentCtx).parent().is("[type=T]")){
		//currentCtx = $(currentCtx).parent();
		$(currentCtx).parent().focus();

		return;
	}

	log.debug("Still Writing tab for " + $(currentCtx).attr("id") )

	styleMeta = CONVERT_STYLE_TO_CLASS_OBJECT(parent,true);

	//defaultTabs = ["slider",commonTabLabel,"misc","font","text","border","background","-webkit"]
	defaultTabs = [commonTabLabel,"misc","font","text","border","background"]

	if(lastTabBeforeSave && defaultTabs.indexOf(lastTabBeforeSave) == -1){
		defaultTabs[defaultTabs.length-1] = lastTabBeforeSave;
	}

	writtenTabs = [];

	//log.debug("STYLETABS2.js:Parent is " + JSON.stringify(parent))

	//Write all tabs
	$.each(styleMeta,function(label,value){

		log.debug("STYLETABS2.js:The label " + label)
		//Create Tabs dynamically equal to style Groups
		tabLabel = label.indexOf("-") > -1 ? label.substring(0,label.indexOf("-")) : label;

		if(label.indexOf("-") == -1){
			tabLabel = "misc";
		}


		if(tabLabel.length == 0){

			tabLabel = "-webkit"
		}

		//tabLabel = tabLabel.toUpperCase();


		if($.inArray(tabLabel,writtenTabs) == -1 ){
			log.debug("STYLETABS2.js:Writing " +tabLabel)
			li = $("<li id='li-"+ tabLabel+ "'>").append("<a href=\"#t_" +tabLabel + "\">" + tabLabel + "</a>")
			//.css("visibility","hidden")

			
			if($.inArray(tabLabel.toLowerCase(),defaultTabs) > -1){

				li.addClass("defaultTabs")
			} else {

				li.addClass("extendedTabs");
			}

			if($("#li-"+tabLabel).length == 0){

				$("ul.tabul").append(li)
				reWritingEditSpace = true;

			} else{
				reWritingEditSpace = false;
			}
			

			
			header = $("<div  id=\"t_" +tabLabel +"\"></div>").css("height","75%").css("overflow","scroll")

			if(reWritingEditSpace){

				$("#tabs").append(header)


				reWritingEditSpace = true;

			} 
			
				writtenTabs.push(tabLabel)
		}

	})


	var theParentId = $(parent).attr("id") ? $(parent).attr("id") : parent.id

	//Add Id to each section
	for(tabIdx in writtenTabs){

		tab = writtenTabs[tabIdx];
		//if not reusing already visible field from last element user inspected
		if(reWritingEditSpace){

			styleValue = $('<div class="styleValue" id="' + tab + '-id"></div>').append(theParentId).css({"border-bottom":"1px solid yellow","width":"250px"});

			styleLabel = $('<div class="styleLabel"><div>').append("id");

			styleRow = $('<div class="styleRow"></div>').css({color:"white","font-weight":"600"});

			styleRow.append(styleLabel).append(styleValue)

			log.debug("STYLETABS2.js:Appending ID to " + "#t_" + tab);

			$("#t_" + tab).append(styleRow);
			

		} else {
			log.debug("STYLETABS2.js:Parent is is now " + parent.id  + " or it is " + theParentId)

			$("#"+tab + "-id").html(theParentId)
		}

	}



	$.each(styleMeta,function(label,value){
		log.debug("The label is " + label + " and value " + value)

		let originalFieldValue = "";
		
		var common = null;

		if(label.startsWith("common-")){
			log.debug("Moving this field to common tab for easier access")
			common = label.substring(label.indexOf("-")+1);
			log.debug("Label is now " + common)
			label = common;
		}

		//Add Tab Content dynamically equal to style Groups
		var tabLabel = label.indexOf("-") > -1 ? label.substring(0,label.indexOf("-")) : label;


		if(label.indexOf("-") == -1){
			tabLabel = "misc";
		}

		if(tabLabel.length == 0){

			tabLabel = "-webkit"
		}

		//tabLabel = tabLabel.toUpperCase();

		var styleRow = $('<div class="styleRow" id="row-'+ label + '"></div>');

		var lowLab = label.replace(tabLabel.toLowerCase()+"-","")

		var styleLabel = "";

		var sAnchor =  $("<a>",{href:"yahoo.com", title:lowLab}).append(lowLab);

		sAnchor.on('click',function(e){
			
			url = 'http://cssreference.io/property/' + tabLabel + "-" + $(e.target).html();
			getHelp(url)
			e.preventDefault();

		}).css({color:"white","cursor":"help"})

		if(tabLabel != "misc"){

			styleLabel = $('<div class="styleLabel"></div>').append(sAnchor);
		} else {
			styleLabel = $('<div class="styleLabel"><div>').append(lowLab);
		}

		let theValue = !$(parent).css(label) ? $(parent).attr(label) : $(parent).css(label);

		//f = $("<input>",{value:theValue})
		
		if(label == "transition-duration"){
			//log.debug(`Reading transition-duration Before ${parent.attr("id")}`);
			theValue = getTransitionDuration($(parent));
			log.debug(`Reading transition-duration After ${theValue}`);
		}


		if(label == "src" || label == "align"){
			if($(parent).is("[type=IMG]")){
				log.debug("STYLETABS2.js:I found the source")
				theValue = $(parent).attr(label)
			} else if($(parent).is("[type=SITE],[type=AUDIO]")){
				theValue = $(parent).find(".content-image").attr(label)
			}else {
				log.debug("STYLETABS2.js:No Source Found. Overwriting with background-image if possible")
				if($(parent).is("[type=DIV]")){
					theValue=styleMeta["background-image"];
					log.debug("STYLETABS2.js:Parent is DIV is " + $(parent).is("[type=DIV]") + "  styleMeta src " + styleMeta["background-image"])
				}

			}
			
		}

		var theType = "text"

		if(label == "dialog-enabled"){
			theType = "checkbox"
		}



		var f = $("<input>",{type:theType,id:tabLabel+"-"+label,value:theValue,for:theParentId});

		//If this is a dialog Box
		if(label == "dialog-enabled"){
			log.debug(`Dialog enabled is ${$(parent).attr("id")} enabled is ${theValue}`)
			if(theValue == "on"){
				$(parent).attr("hasjs","true");
				f.prop("checked",$(parent).attr(label))
			} else {
				$(parent).removeAttr("hasjs")
			}
		}

		f.unbind("dblclick").on("dblclick",function(e){
			$(e.target).val("");
		})
					
		f.unbind("input").on('input',function(evnt){

				if(label == "class"){
					//do nothing.  wait until class is complete
					$(parent).addClass($(evnt.target).val())
					$(parent).attr("user-classes",$(evnt.target).val())	
				}else if(label == "src" || label == "align"){
					/*
					if(jwplayer == true){
							jwplayer().load([{file:$(event.target).val()}])
							//$(parent).attr(label,$(event.target).val())
					}*/

					log.debug("Src is true and value is " + $(evnt.target).val() + " pID " + $(parent).attr("id") + " type is ["+ $(parent).attr("type") + "]")

					if($(parent).is("[type=VID]")){
						$(parent).find("video").first().attr(label,$(evnt.target).val())


					} else if($(parent).is("[type=AUDIO]")){
						$(parent).children(".content-image").attr(label,$(evnt.target).val());

					} else
					if($(parent).is("[type=SITE]")){
						$(parent).children(".content-image").attr(label,$(evnt.target).val())

					} else 
					
					if($(parent).is("[type=DIV],[type=IMG]")){
						if($(evnt.target).val().indexOf("url(") == -10){
							theValue = "url(" + $(evnt.target).val() + ")"
						} else {
							theValue = $(evnt.target).val();
						}
						$(parent).css("background-image",theValue);
						$(parent).css("width","500px")
						$(parent).css(label,theValue);
						$(parent).attr(label,theValue)
						log.debug("STYLETABS2.js:Overwriting background-image with src attribute since this is what the user really wants " + $(evnt.target).val())
					}

					//https://www.uvm.edu/~bnelson/computer/html/wrappingtextaroundimages.html
					if(label == "align"){
						$(parent).find("br").attr(clear,$(evnt.target).val())
					}
					

				}else if(label.startsWith("font") || label.startsWith("text")){
					$(parent).css(label,$(evnt.target).val())
					if($(parent).is("[type=LIST],[type=NAVIGATION]")){
						$(parent).children(".dropped-object").css(label,$(evnt.target).val())
					}
                    // $(parent).find("[type]").css(label,$(evnt.target).val())  
                }else if(label == "color"){
						$(parent).css("-webkit-text-fill-color",$(evnt.target).val())
						
						$(parent).find("[type]").css("-webkit-text-fill-color",$(evnt.target).val())
					
				} else {

					//if this is a custom css option. ie how we define components, write as attribute
					if(!$(parent).css(label)){
						$(parent).attr(label,$(evnt.target).val())
					} else {
					$(parent).css(label,$(evnt.target).val())
					//if this is a custom css option. ie how we define components, write as attribute
					}
				}

				if($(parent).is("[type=T]") && label.startsWith("margin")){
					$(parent).find("[type=MENU-ITEM]").css(label,$(event.target).val())
					$(parent).css("margin",0);
				} else

				if($(parent).is("[type=LIST],[type=NAVIGATION]") && label.startsWith("margin")){
					$(parent).children(".dropped-object").css(label,$(event.target).val())
					$(parent).css("margin",0);
				}

				log.debug("STYLETABS2.js:Firing : " + label + " ==> " + $(evnt.target).val())
				log.debug("STYLETABS2.js:Webkit : " + $(parent).css("-webkit-text-fill-color"))

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
					log.trace("I see this many copies of " + $(parent).attr("id") + " : " + $(`[extends=${$(parent).attr("id")}]`).not($(parent)).length)
					//Any copies of this parent
					$(`[extends=${$(parent).attr("id")}]`).not($(parent)).css(myStyle);

					//Any copies currently being edited

					//copy to others just in case we are editing a copy
					originalParentId = $(parent).attr("extends");

					$(`[extends=${originalParentId}]`).not($(parent)).css(myStyle);

					//Copy to parent in case we are editing a copy and not the parent directly
					$("#"+originalParentId).css(myStyle)

					//test to see if this is a custom attribute instead of class
					if($(parent).css(label) == undefined){
						log.debug("STYLETABS2.js :" + label + " is not a style " + " overwriting with label " + $(event.target).val())
						//User modified an an attribute
						$("#"+originalParentId).attr(label,$(event.target).val())
						$(`[extends=${originalParentId}]`).not($(parent)).attr(label,$(event.target).val());
						$(`[extends=${$(parent).attr("id")}]`).not($(parent)).attr(label,$(event.target).val())

					}
					copiesModified = true;
				}

		}).unbind("mouseleave").on("mouseleave",function(evnt){

			var theTarget = $(evnt.target);

				if(originalFieldValue  == theTarget.val()){
				log.debug(`no save needed for ${theTarget.attr("id")}`)
				return;
			}

			if($(evnt.target).attr('type') == "checkbox" && $(event.target).attr("id") == "dialog-dialog-enabled"){
				var jsString = "";

				if(!$(evnt.target).is(":checked")){
					log.debug(`The checkbox value is now ${$(evnt.target).is(":checked")}`)
					$(parent).removeAttr("dialog-enabled");
					$(parent).removeAttr("hasjs")
					jsString = !$(evnt.target).is(":checked")? `$("#${$(parent).attr('id')}").on("click",function(){})`: `$("#${$(parent).attr('id')}").on("click",POPUP_win)`;
				} else {
					$(parent).attr("dialog-enabled",$(evnt.target).val());
					$(parent).attr("hasjs",true)
					jsString = `$("#${$(parent).attr('id')}").on("click",POPUP_win)`
				}
				
				$(parent).off("click");
				eval(jsString)
				saveJs($(parent),jsString);			

			}

			
		


			//only used to write class info here.  Everything else should use on.input
			if(label == "class" &&  $(parent).attr("user-classes").trim().length > 0){
				$(parent).attr("class",$(parent).attr("class").replace(/fa-[^fw]\S+/g,$(parent).attr("user-classes") ) )
				$(parent).removeAttr("user-classes")
			}

			if(label == "slider-auto-slide"){
				$.event.trigger("genericSliderReady",[$(event.target)])
			}

			if($(parent).is("[type=VID]")){
				$(parent).find("video")[0].load()
			}

			//alert(`Leaving parent ${$(parent).attr('id')}`)

			CUSTOM_PXTO_VIEWPORT($(parent),$(parent).position().left ,$(parent).position().top);

			
			if(copiesModified){
				log.debug("STYLETABS2.js:I'm in the copies bruh!")
				//Finally Find all copies of this element and do viewport stuff.  In viewport stuff, we also save any 
				//onhover events which are passed as attributes on the element since there is no such thing as hover class
				//retrieved or set via $.css() method
				$("[extends='"+$(parent).attr("id")+ "'],#" + originalParentId + ",[extends='"+$(parent).attr("id")+ "']").not($(parent)).each(function(idx,copy){
					CUSTOM_PXTO_VIEWPORT($(copy),$(copy).position().left ,$(copy).position().top);
				})
				/*
				$("#" + originalParentId).each(function(idx,copy){
					CUSTOM_PXTO_VIEWPORT($(copy),$(copy).position().left ,$(copy).position().top);
				})*/
			}

			if(label.startsWith("margin") && $(parent).is("[type=T]")){
				$(parent).find("[type=MENU-ITEM]").each(function(m,mi){
					
					CUSTOM_PXTO_VIEWPORT($(mi),$(mi).position().left ,$(mi).position().top);
				})
			}

			if(label.startsWith("margin") && $(parent).is("[type=LIST]")){
				$(parent).children(".dropped-object").each(function(m,mi){
					
					CUSTOM_PXTO_VIEWPORT($(mi),$(mi).position().left ,$(mi).position().top);
				})
			}

			if(label.startsWith("transition-cntrl-")){

				SLIDER_setUpButton(evnt,parent);

			}

			
			STYLESTABS_forceRewrite = true;
			//NOTES_makeNote($(parent));
			STYLESTABS_forceRewrite = false;

		}).on("change-placeholder-not-used",function(evnt){
			


		}).unbind("mouseenter").on("mouseenter",function(evnt){
			
			originalFieldValue = $(evnt.target).val()

			log.debug(`Searching for ${originalFieldValue} `)

			//originalFieldValue = $(correctId).css(label); 


		})

		//Don't write id field again. We already manually added to each tab for consistency above
		if(lowLab != "id" ){

			 if(reWritingEditSpace){

				styleValue = $('<div class="styleValue"></div>').append(f);

				styleRow.append(styleLabel).append(styleValue)


				if(common == null){
					//default 
					$("#t_" + tabLabel).append(styleRow)
				}else {
					log.trace("Appending to "+ commonTabLabel.toUpperCase() + " : " )
					log.trace(styleRow)
					//$("#t_" + commonTabLabel.toUpperCase()).append(styleRow);
					$("#t_" + commonTabLabel).append(styleRow);
				}

			} else {

				$("#"+tabLabel + "-" + label).replaceWith(f);
			}

			 if( !$(parent).is("[type=LIST]") ){ 
					//do nothing
				//if not reusing already visible field from last element user inspected
				for(i=0;i<customListFields.length;i++){
					$("#row-"+customListFields[i]).hide();
				}
			} else {
				//if not reusing already visible field from last element user inspected
				for(i=0;i<customListFields.length;i++){
					$("#row-"+customListFields[i]).show();
				}
			}


		}

		

	})

	if(reWritingEditSpace){
		//write non-standard shorthand fields
		//Write menu
		$(".tabul").append("<li style='width:10px'>&nbsp;</li>")
		$(".tabul").append('<li style="50px; padding:5px" ><div style="display:inline">&nbsp;&nbsp;More Styles : <input type="search" id="tags" value=""></div></li>');
		$(".tabul").append('<li style="50px; padding:5px" class="mini-responsive-design-tab"><div class="fa fa-desktop"></div></li>');
		//$(".tabul").append('<li style="50px; padding:5px" class="rocket-save"><div style="display:inline">&nbsp;&nbsp;Save: </div><div class="fa fa-save"></div></li>');
		//$(".tabul").append('<li style="50px; padding:5px" class="rocket-settings"><div style="display:inline">&nbsp;&nbsp;Options: </div><div class="settings-icon fa fa-angle-double-up"></div></li>');
		
		//$(".tabul").append('<li style="50px; padding:5px" ><div style="display:inline">&nbsp;&nbsp;Search Styles : <input type="search" id="tags" value=""></div></li>');
		
		
		$(".tabul").append('<div class="ui-widget">')

		widget = $('<div class="ui-widget">').append('<label for="tags"></label>');
		
		

		//widget.append('<input type="file" id="fileElem" multiple accept="image/*" style="display:none" onclick="window.myim = CUSTOM_currentlyMousingOverElementId" onchange="CUSTOM_HANDLEFILES(this.files)">')
		//widget.append('<input type="file" id="audioElem" multiple accept="audio/*" style="display:none" onclick="window.myim = CUSTOM_currentlyMousingOverElementId" onchange="CUSTOM_HANDLEFILES(this.files,true)">')

		$(".tabul").append("<li>").append(widget)
	  

		//Write all values for tabs
		$( "#tabs" ).tabs({
			create: function(){
				if(lastTabBeforeSave){
					$("[href='#t_" + lastTabBeforeSave + "']").click();
				}
			}
		})

	}

	//Need to refactor this.  This file should not care about NOTES_timer


	//$("#editSpace").offset({top:$("#drawSpace").height()});
	generatedTabsForId = $(currentCtx).attr("id");


	if(reWritingEditSpace){

	

		DRAW_SPACE_advancedShowing ? $(".settings-icon").addClass("fa-angle-double-down").removeClass("fa-angle-double-up") : $(".settings-icon").addClass("fa-angle-double-up").removeClass("fa-angle-double-down")


		$(".rocket-settings").on("click",function(){

			if(DRAW_SPACE_advancedShowing){
				
				DRAW_SPACE_hideSettings();
				$(".settings-icon").addClass("fa-angle-double-up").removeClass("fa-angle-double-down")
				DRAW_SPACE_advancedShowing = false;
				SAVE_okToSave = false;
			} else{
				
				DRAW_SPACE_showSettings();
				$(".settings-icon").addClass("fa-angle-double-down").removeClass("fa-angle-double-up")
				DRAW_SPACE_advancedShowing = true;
				SAVE_okToSave = true;
			}

		})


		$(".rocket-save").on('click',function(){

			if(website == "default"){
				//text = prompt("Please enter a name for your new site")
				 MAKE_PROMPT_FOR_INPUT_BOX_for({promptMsg:"What is new site name?"},function(text){

						if(text && text.trim().length > 0){
							$('html').attr("x-site-name",text);
							$('title').text(text);
							LOGIC_redirectNeeded = true;
							SAVEJS_goInactive()
						}
				 })
				 
			} else {
				log.debug("Pressed Key for saving ")
				SAVE_okToSave = true;
				SAVEJS_goInactive()
			}
		});
		

		$("#anchorsAway").on("click",function(){
			anchorsAway = $(this).is(":checked") ? true: false;
			if(anchorsAway){
				removeEditMode();
			} else{
				addEditMode();
			}
		})

		$(".cssToggle").on("click",function(){
			$(".extendedTabs").toggle();
		})

		$("#group-resize").on("click",function(){
			groupResizeEnabled = $(this).is(":checked") ? true: false;
		})

		$(".changesToggle").on("click",function(){
			copiesModified = $(this).is(":checked") ? true: false;
		})

		$(".showOverlays").on("click",function(){
			showOverlays = OVERLAY_areOverlaysEnabled();
			if(showOverlays){
				OVERLAY_enableOverlays();
			} else {
				OVERLAY_disableOverlays();
			}
		})

		$("#disableHoverEvents").on("click",function(){
			disableEventsFlag = $(this).is(":checked") ? true: false;
			if(disableEventsFlag){
				disableHoverEvents();
			} else {
				enableHoverEvents();
			}
		})
		
		
		//reset buttons in case page reloaded
		if(copiesModified){
			$(".changesToggle").click();
		}

		if(showOverlays){
			$(".showOverlays").click();
		}
		
		if(groupResizeEnabled) {
			$("#group-resize").click();
		}

		if(disableEventsFlag){
			$("#disableHoverEvents").click();
		}

		$( "#tags" ).autocomplete({
	      source: writtenTabs,
	      appendTo: "tags",
	      select: function(event,ui){
	      	//alert(ui.item.label)
	      	if($(".defaultTabs").length > 6){
	      		$(".defaultTabs").last().removeClass("defaultTabs").addClass("extendedTabs")
	      	}

	      	$("#li-" + ui.item.label).removeClass("extendedTabs").addClass("defaultTabs");

	      	$("#li-" + ui.item.label + " > a").click();

	      	lastTabBeforeSave = ui.item.label;

	      }

	    });


		$(".ui-menu").css({
				color:"white",
				border:"1px solid black",
				"background-color":"navy"
			})

	}

	$("[aria-selected] > a").on('click',function(){
		lastTabBeforeSave = $(this).html();
	})


}

//<div id="element-selector" class="fa fa-save" style="display:inline-block; height:20px;width:30px;font-size:25px; border-right:1px solid black"></div><div id="group-resize" class="fa fa-object-group" style="display:inline-block; height:20px;width:30px;font-size:25px; border-right:1px solid black"></div>


