function OVERLAY_setUp(element){

	var adjuster = (100 / document.documentElement.clientWidth);

	var units = "vw";

	element = $(element);

	if(!element.is(".dropped-object")){
		console.log("Can only make overlays for user created objects")
		return;
	}

	overlay = recursiveCpy(element)
	//overlay.appendTo($("#drawSpace"))
//alert(element.offset().left + " pos = " + element.position().left)
//alert(element.offset().top + " pos = " + element.position().top)

	overlay.css({"position":"relative","margin":"0","background-image":"none","background-color":"yellow",left:0 ,top:0 });
//alert(overlay.offset().left + " top = " + overlay.offset().top)
	overlay.draggable("destroy").resizable("destroy")
	element.append(overlay);

	overlay.attr("overlay-for","#"+element.attr("id"))
	element.attr("overlay","#"+overlay.attr('id'))
	overlay.attr("type","OVERLAY")
	overlay.removeAttr("extends")


	//OVERLAY_addEvents(element,overlay)

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

			$($(theElem).attr("overlay")).fadeIn();

			overlay = $($(theElem).attr("overlay"));

			overlay.on("mouseleave",function(){
				if(!OVERLAY_areOverlaysEnabled() || !editing){
					$(this).fadeOut();
				}
			})
	}
}
/*
function OVERLAY_addEvents(element,overlay){

	element.on("mouseleave",function(evnt){
		//evnt.stopPropagation();
		if(!OVERLAY_areOverlaysEnabled() || !editing){
			alert("Hiding " + evnt.target.id)
			$($(element).attr("overlay")).fadeOut();

			//$($(this).attr("overlay-for")).css("opacity","1");
		}
	})


	element.on('mouseenter',function(evnt){
		

		if(OVERLAY_areOverlaysEnabled() || !editing){
			alert("Showing " + $(evnt.target).attr("overlay"))
			$((element).attr("overlay")).fadeIn();
			//$(this).css("opacity", ".5");
		}
	})

}*/