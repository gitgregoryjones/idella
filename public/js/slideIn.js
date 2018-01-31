$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};


var eMap = new Map()


function registerForSlide(element,onload){

	$(element).css("opacity","0");


	
	if(onload == true){

		var direction = $(element).attr("slider-direction") ? $(element).attr("slider-direction") : "left";

		$(element).hide();
		$(element).css("opacity","1");
		$(element).show( "slide", {direction: direction }, 500 );
	} else {
		eMap.set($(element).attr("id"),$(element).attr('id'));
	}

}

$(window).on("scroll",function(){

	eMap.forEach(function(value,key, map){
		var direction = $("#"+key).attr("slider-direction") ? $("#"+key).attr("slider-direction") : "left";
		if ($("#"+key).isInViewport()) {
			 eMap.delete(key);
			$("#"+key).css("opacity","1").hide();
			$("#"+key).show( "slide", {direction: direction }, 500 );
		}		
	})
			
	
	

})
