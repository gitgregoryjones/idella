//https://stackoverflow.com/questions/9144560/jquery-scroll-detect-when-user-stops-scrolling


function OVERLAY_setUp(element,isTemplate){

	

	var adjuster = (100 / document.documentElement.clientWidth);

	var units = "vw";

	element = $(element);

	if(!element.is(".dropped-object")){
		console.log("Can only make overlays for user created objects")
		return;
	}

	overlay = recursiveCpy(element)

	overlay.children().remove();

	overlay.text("")

	if(overlay.attr("alias")){
		overlay.attr("alias",`overlay for ${overlay.attr("alias")}`)
	}
	
	//overlay.css({height:$(element).outerHeight(),width:$(element).outerWidth()})				


	if(isTemplate){
		overlay.css({"position":"absolute","margin":"0","background-image":"none","background-color":"rgba(255,255,255,.5)",left:0,top:0 });
	}else {
		overlay.css({"position":"absolute","margin":"0","background-image":"none","background-color":"rgba(255,255,255,.5)",left:0,top:0 });
	}

	

	element.append(overlay);

	try{
		overlay.draggable("destroy").resizable("destroy")
	}catch(e){
		console.log("Ignoring destroy console errors.")
	}

	overlay.attr("overlay-for","#"+element.attr("id"))

	if(isTemplate){
		overlay.attr("template",true)
		overlay.attr("focus-overlay-for","#"+element.attr("id"))
	}
	element.attr("overlay","#"+overlay.attr('id'))
	overlay.attr("type","OVERLAY")
	overlay.removeAttr("extends").removeAttr("ui-draggable").removeAttr("ui-resizable").removeAttr("ui-resizable-handle")


	if(!OVERLAY_areOverlaysEnabled()){
		$(".showOverlays").click();
	}

	coords = NOTES_makeNote(overlay);

	return overlay;
	//alert(JSON.stringify(coords))

}

function OVERLAY_enableOverlays(){
	$("[overlay-for]").show()
	//.css("visibility","visible");
}

function OVERLAY_disableOverlays(){
	//$("[overlay-for]").trigger("mouseleave");
	$("[overlay-for]").hide();
}

function OVERLAY_areOverlaysEnabled(){

	return $("#content .showOverlays").is(":checked");

}

function OVERLAY_deleteInstructions(){

	$("#imgwin").remove();

	
}


function OVERLAY_showInstructions(theElem){

	theElem = $(theElem)

	OVERLAY_deleteInstructions();

	if(editing && $(theElem).css("background-image").indexOf("saveabandonedbabies") > -1){
		div = $("<div>",{id:"imgwin",width:theElem.width(),height:theElem.height()*.40})
		div.append("Double click to edit image").css("text-align","center")
		div.on("dblclick",function(){
			$(this).parent().dblclick();
			$(this).remove();
		})
		theElem.append(div);
	}
}

function OVERLAY_showOverlay(theElem){

	theElem = $(theElem)

	if(editing){

		if(OVERLAY_areOverlaysEnabled()) {
			OVERLAY_enableOverlays();
			
		} else if(!OVERLAY_areOverlaysEnabled()) {

			OVERLAY_disableOverlays();
		}


	} else

	console.log("editing is " + editing )

	if(!editing){


		if(theElem[0].hasAttribute("overlay") ){

				//$("[type=OVERLAY]").trigger("mouseleave");
				var olay = $(theElem).children("[type=OVERLAY]").first();

				//Do Big Overlay if user wants
				if(olay.attr("bigun")){

					olay.css("opacity",0)
					olay.show();

					//olay.css({height:"6000px",width:$(theElem).outerWidth()})
					olay.attr("orig-height",olay.height())
					olay.attr("orig-width",olay.width());
					olay.attr("orig-top",olay.offset().top);
					olay.attr("orig-left",olay.offset().left);

					olay.find(".dropped-object").each(function(it,div){
						var div = $(div);
						div.attr("orig-height",div.height())
						div.attr("orig-width",div.width())
						div.attr("ratio",div.height()/div.width());
						div.attr("pct-x", (olay.offset().left -div.offset().left)/olay.width() )
						div.attr("pct-y", (olay.offset().top -div.offset().top)/olay.height() )
						div.attr("orig-top",div.offset().top)
						div.attr("orig-left",div.offset().left)
						//div.css({top:window.scrollY + "30",width:(div.width()/olay.width())*$(window).width(),height:(div.width()/olay.height())*$(window).height()})
					})


					olay.hide();
					olay.css("opacity",1);
					olay.appendTo($('body')).css({"position":"absolute","z-index":"10000",top:0,height:"6000px",width:"100vw"})
				}

	
				olay.fadeIn()

				

			
				if(olay.attr("bigun")){
					olay.find(".dropped-object").each(function(it,div){
						var div = $(div);
						
						//alert(olay.attr("orig-top")/div.attr("orig-top"))
						//alert((parseFloat(div.attr("orig-left"))/parseFloat(olay.attr("orig-left"))))
						console.log("pct-x " + div.attr("pct-x"));
						console.log("Left " + div.attr("pct-x")*$(window).width());

						var coords = {"position":"absolute",display:"inline-block",
							width:(div.attr("orig-width")/$(olay).attr("orig-width"))*$(window).outerWidth(),
							height:((div.attr("orig-width")/$(olay).attr("orig-width"))*$(window).width()) * div.attr("ratio"),
							top:Math.abs((div.attr("pct-y") * $(window).height())) - div.parent(".dropped-object").offset().top,
							left:Math.abs((div.attr("pct-x") * $(window).outerWidth())) - div.parent(".dropped-object").offset().left
						}
					//	olay.append($("<div style='font-size:20px'>"+JSON.stringify(coords)+ "</div>").css({top:window.scrollY,width:"400px"}))
						//if first child
						if(div.parent(olay)){
							coords.top += window.scrollY;
						}
						div.css(coords)
					})
				}	

				if(olay.attr("bigun")){
					var close = $('<div id="close-help" class="fa fa-window-close"></div>');

					close.appendTo(olay).css({position:"absolute","color":"navy","right":"5%","font-size":"30px","top":window.scrollY,"z-index":olay.css("z-index")+1}).on("click",function(){
						olay.mouseleave();
					});

					if($(theElem).find("video").length > 0){
						$(theElem).find("video")[0].play();
					}
				}

				$("[type=OVERLAY]").not(olay).fadeOut();

				//getHelp()
				//overlay = $(theElem).children("[type=OVERLAY]").first();

				//overlay.off()

				olay.unbind("mouseleave").on("mouseleave",function(){
					console.log(`Overlay Exited Time to Go! Id ${theElem.attr("id")} Alias = ${theElem.attr("alias")}`);
					theElem.mouseleave();
					
					if($(theElem).find("video").length > 0){
						$(theElem).find("video")[0].pause();

					}
					

					if(!OVERLAY_areOverlaysEnabled() || !editing){
						if(olay.attr("bigun")){
							$(this).fadeOut(function(){
									olay.appendTo($(theElem))
									olay.css({height:olay.attr("orig-height"),width:olay.attr("orig-width"),top:0,left:0})
									olay.find(".dropped-object").each(function(it,div){
										div = $(div);
										
										console.log("Width " + div.attr("orig-width")/$(window).width()*$(window).width());
										div.attr("style","")
									})
									close.remove();
							})
						} else {
							$(this).fadeOut(function(e){
								
							});
						}
					
					}
				}).on("click",function(){
					//
				})
		} else {

			//$(theElem).parents('[overlay]').first().children("[type=OVERLAY]").first().fadeIn()
			/*
			if($(theElem).find("video").length > 0){
				$(theElem).find("video")[0].play();
			}*/
		}
	}
}


