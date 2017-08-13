function GHOST_setUpElement(element,event){

	var adjuster = (100 / document.documentElement.clientWidth);

	var units = "vw";

	element = $(element);

	if(!element.is(".dropped-object")){
		console.log("Can only make ghosts for user created objects")
		return;
	}

	ghost = $("<div>").addClass("ghost")
	//$("#drawSpace").append(ghost);
	element.parent().append(ghost)

	coords = NOTES_makeNote(element);
	//alert(JSON.stringify(coords))
	var top = coords.top;
	var left = coords.left;

	ghost.css(  {top:$(element).position().top,left:myPage.X,position:element.css("position"),"z-index":99999})
		.attr("ghost-for","#"+$(element).attr("id"))
		.attr("ghost-width",element.width())
		.attr("ghost-height",element.height())
		.attr("ghost-opacity",element.css("opacity"))
		.attr("id","ELEM_" + new Date().getTime())
		.attr("breakpoint",currentBreakPoint)
		.attr("type","GHOST")

	//ghost.css({top:ghost.offset().top - ghost.width()})

	GHOST_init(ghost);

}

function GHOST_isForElement(element){

	return $("[ghost-for='#"+$(element).attr("id")+"']").length > 0;
}

function GHOST_delete(ghost){

	ghost.trigger("mouseenter");

	ghost.remove();
}


function GHOST_deInit(element){

	element = $(element)
	
	if($("[ghost-for='#"+$(element).attr("id")+"']").length == 0){
		//remove all override styles to show the element again
		element.css("opacity",1)
		CUSTOM_PXTO_VIEWPORT($(element),element.position().left,element.position().top) 
		$(element).removeAttr("style");
	}


}

function GHOST_init(ghost){

	ghost = $(ghost)

	var origWidth = ghost.attr("ghost-width");
	var origHeight = ghost.attr("ghost-height");
	var origOpacity = ghost.attr("opacity")

	$(ghost).on("mouseenter",
		function(event){
				//Enter Code Below
			var theElem = $(this).attr("ghost-for")
			$(theElem).css("opacity",.1)
			$(theElem).css({"display":"block",opacity:.1,width:0,height:0})
			NOTES_delete();
			$($(this).attr("ghost-for")).animate({width:origWidth,height:origHeight},"400",
				function(){$(theElem).css("opacity",".5");CUSTOM_PXTO_VIEWPORT($(theElem),$(theElem).position().left,$(theElem).position().top) ;GHOST_deInit(theElem)})
			CUSTOM_currentlyMousingOverElementId = $(this).attr("id");

		}
	).on("mouseleave",function(event){
			//Enter Code Below
			var theElem = $(this).attr("ghost-for")
			NOTES_delete();
			$($(this).attr("ghost-for")).animate({width:"0px",height:"0px"},"400",function(){
				$(theElem).css("display","none")
				CUSTOM_PXTO_VIEWPORT($(theElem),$(theElem).position().left,$(theElem).position().top)
			});
	})

	ghost.trigger("mouseleave");


	//Doing this because mouseleave call is async.  I need to shrink obj and write to CSS file immediately just in case
	//we're in a breakpoint and user wants to hide from other breakpoint views

	//var elem = $($(ghost).attr("ghost-for"));

	//elem.css({height:0,width:0,opacity:0})

	//CUSTOM_PXTO_VIEWPORT($(elem),elem.position().left,elem.position().top)

}

