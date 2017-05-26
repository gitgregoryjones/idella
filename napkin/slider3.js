
/*Go right*/
function addToBeginning(list){
	var list =$(list)

	var options ={}

	options["transition-duration"] = list.css("transition-duration");

	list.children(".dropped-object").css("border","none");
	var last =list.children(".dropped-object").last().css("border","3px solid orange")

	var myId = last.attr("id");

	var first = list.children(".dropped-object").first().css("border","3px solid green");

	var left = last.width();

	list.children(".dropped-object").css("transition-duration",options["transition-duration"]).css("transform","translateX("+left+"px)")
	last.one('transitionend webkitTransitionEnd oTransitionEn', function(e){
			
			if(e.target.id == myId){
				//last.clearQueue();
				
				//e.remove()
				list.children(".dropped-object").css("transition-duration","0s").css("transform","translateX(0px)");
				$(last).insertBefore(first)

				//list.children(".dropped-object").css("transition-duration","0s").css("transform","translateX(0px)");
		}
	
	});

}
/*Go left*/
function addToEnd(list){
	var list =$(list);

	var options ={}

	options["transition-duration"] = list.css("transition-duration");

	var first =list.children(".dropped-object").css("border","none").first().css("border","3px solid green")

	var last =list.children(".dropped-object").last().css("border","3px solid orange")


	var left = first.width() * -1;

	list.children(".dropped-object").css("transition-duration",options["transition-duration"]).css("transform","translateX("+left+"px)");

	$(first).one('transitionend webkitTransitionEnd oTransitionEn', function(e){
		/* Rather than log on screen, we'll alert the information */
		
		if(e.target.id == $(first).attr("id")){
			
				//e.remove()

			list.children(".dropped-object").css("transition-duration","0s").css("transform","translateX(0px)")
			$(first).insertAfter(last)

			
		}
	});

}