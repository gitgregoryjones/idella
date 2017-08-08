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
	}
	element.attr("overlay","#"+overlay.attr('id'))
	overlay.attr("type","OVERLAY")
	overlay.removeAttr("extends").removeAttr("ui-draggable").removeAttr("ui-resizable").removeAttr("ui-resizable-handle")


	if(!OVERLAY_areOverlaysEnabled()){
		$(".showOverlays").click();
	}

	coords = NOTES_makeNote(overlay);
	//alert(JSON.stringify(coords))

}

function OVERLAY_enableOverlays(){
	$("[overlay-for]").show()
	//.css("visibility","visible");
}

function OVERLAY_disableOverlays(){
	$("[overlay-for]").trigger("mouseleave");
	$("[overlay-for]").hide();
}

function OVERLAY_areOverlaysEnabled(){

	return $(".showOverlays").is(":checked");

}

function OVERLAY_showOverlay(theElem){

	if(editing){

		if(OVERLAY_areOverlaysEnabled()) {
			OVERLAY_enableOverlays();
			
		} else if(!OVERLAY_areOverlaysEnabled()) {

			OVERLAY_disableOverlays();
		}


	} else

	console.log("editing is " + editing )

	if(!editing){


		if(theElem.hasAttribute("overlay") ){

				//$("[type=OVERLAY]").trigger("mouseleave");
				olay = $(theElem).children("[type=OVERLAY]").first();

				olay.css({height:$(theElem).outerHeight(),width:$(theElem).outerWidth()})				

				olay.fadeIn()

				if($(theElem).find("video").length > 0){
					$(theElem).find("video")[0].play();
				}

				$("[type=OVERLAY]").not(olay).fadeOut();

				//overlay = $(theElem).children("[type=OVERLAY]").first();

				//overlay.off()

				olay.on("mouseleave",function(){
					if($(theElem).find("video").length > 0){
						$(theElem).find("video")[0].pause();
					}
					if(!OVERLAY_areOverlaysEnabled() || !editing){
						$(this).fadeOut()
					}
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


