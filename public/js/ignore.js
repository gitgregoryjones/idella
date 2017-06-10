moveOfffscreenObjects = function (child){

					$(child) = child;

					if(parseInt(child.css("left")) <= parseInt(child.css("width"))/-1 && direction == "left"){

					
					log.trace(" Less than zero ID and LEFT " + child.css("left"))
					log.trace("Append to " + $(container.children(".dropped-object").not("[slider-direction]").sort(SortByRight)[0]).css("left"))
					child.css("background-color","red")
					//container.children().not($(this)).css("background-color","transparent")
					$(container.children(".dropped-object").not("[slider-direction]").sort(SortByRight)[0]).css("background-color","green")
					
					target = $(container.children(".dropped-object").not("[slider-direction]").sort(SortByRight)[0]);
					
					if( !(target.attr("id") in leaders)){
						//leaders[target.attr("id")] = $(this).attr("id");
						log.trace("Wrote leader key " + target.attr("id"))
						leaders[target.attr("id")] = {}	
						leaders[target.attr("id")][child.attr("id")] = "unattached"
						log.trace("Pushed it good")
					} else {
							leaders[target.attr("id")][child.attr("id")] = "unattached"
							log.trace("I made it here")						
					}	
				//going right				
				} else if(direction == "right" && parseInt(child.css("left")) >= parseInt($(container).css("width"))){
					log.trace(" Less than zero ID and RIGHT " + child.css("left"))
					log.trace("Append to " + $(container.children(".dropped-object").not("[slider-direction]").sort(SortByLeft)[0]).css("left"))
					child.css("background-color","pink")
					rightTarget.css("background-color","green")
					
					
					log.trace("The Leader is " + rightTarget.attr("id"))
					if( !(rightTarget.attr("id") in leaders)){
						
						log.trace("Wrote leader key " + rightTarget.attr("id"))
						leaders[rightTarget.attr("id")] = {}	
						leaders[rightTarget.attr("id")][child.attr("id")] = "unattached"
						log.trace("Pushed it good right")
					} else {
							leaders[rightTarget.attr("id")][child.attr("id")] = "unattached"
							log.trace("I made it here right")						
					}	
				}
}