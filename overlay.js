function OVERLAY_setUp(element){

	var adjuster = (100 / document.documentElement.clientWidth);

	var units = "vw";

	element = $(element);

	if(!element.is(".dropped-object")){
		console.log("Can only make overlays for user created objects")
		return;
	}

	overlay = recursiveCpy(element)

	overlay.children(".dropped-object").remove();
	
	overlay.css({"position":"relative","margin":"0","background-image":"none","background-color":"yellow",left:0 ,top:0 });

	overlay.draggable("destroy").resizable("destroy")
	element.append(overlay);

	overlay.attr("overlay-for","#"+element.attr("id"))
	element.attr("overlay","#"+overlay.attr('id'))
	overlay.attr("type","OVERLAY")
	overlay.removeAttr("extends")


	

	if(!OVERLAY_areOverlaysEnabled()){
		$(".showOverlays").click();
	}


	coords = NOTES_makeNote(overlay);
	//alert(JSON.stringify(coords))

}

function OVERLAY_enableOverlays(){
	$("[overlay-for]").show();
}

function OVERLAY_disableOverlays(){
	$("[overlay-for]").trigger("mouseleave");
	$("[overlay-for]").hide();
}

function OVERLAY_areOverlaysEnabled(){

	return $(".showOverlays").is(":checked");

}

function OVERLAY_showOverlay(theElem){

	if(theElem.hasAttribute("overlay") ){

			//$("[type=OVERLAY]").trigger("mouseleave");

			$($(theElem).children("[type=OVERLAY]")).first().fadeIn()

			overlay = $(theElem).children("[type=OVERLAY]").first();

			overlay.on("mouseleave",function(){
				if(!OVERLAY_areOverlaysEnabled() || !editing){
					$(this).fadeOut();
				}
			})
	}
}


