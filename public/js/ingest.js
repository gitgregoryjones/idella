//Load 

$(document).on("listLoad",function(event,list){
	getServerContent(list,function(serverContent){
		if(serverContent){
			//$(list).children("[type]").remove();
		
			recursivePopulate(serverContent, $(list))
		} else {
			log.warn("No content found for list " + list.attr("alias"))
		}
	})
})


function recursivePopulate(content, list,numberOfSiblings){

	list = $(list)

	var inheritsFrom = null;

	var cssObj = {};



	

	if(Array.isArray(content) ){
			var arr = content;
			if(arr.length > 0){
				var numberOfSiblings = arr.length;
				for(i=0; i < arr.length; i++){

					recursivePopulate(arr[i],list,numberOfSiblings)
				}
			}

	}  else {

		if(!content.id){
			log.error("The following content does not have a supplied.  Will not add to screen")
			log.error(content);
			return;
		}


		var lookupKey = content.id;

		content.id = content.id + "-" +list.attr("alias");

		content.width = $(lookupKey).length > 0 ? $(lookupKey).width() : content.width;
		content.height = $(lookupKey).length > 0 ? $(lookupKey).height() : content.height;

			for(key in content){

				if(Array.isArray(content[key])){
					var arr = content[key]
					if(arr.length > 0){
						var numberOfSiblings = arr.length;
						for(i=0; i < arr.length; i++){

							recursivePopulate(arr[i],list,numberOfSiblings)
						}
					}
				} else {
					log.error("Writing key " + key + " and value " + content[key] + " to onScreenObject " )
					

					//only go in here if not the top level object
					if(content.alias != list.attr("alias")){


						if( $("#"+ content.id).length == 0  && list.attr("type") == "LIST" ){

								if(content.type == "DIV" ){
							  	//give default width and height


									if(list.children("[type]").length == 0){

										var theWidth = list.width();

										console.log("Width is " + theWidth + " sibs = " + numberOfSiblings)
										console.log("theWidth/numberOfSiblings = " + theWidth/numberOfSiblings)

										content.width = (list.width()-numberOfSiblings*10)/parseInt(numberOfSiblings);	
										content.height = list.height()							
									} else {

										content.width = list.children("[type]").first().width();
										content.height = list.children("[type]").first().height();
										log.warn("First record width, height is ")
										log.warn({width:content.width,height:content.height})
									}
								}


								if(list.length > 0){
									log.debug("Length is " + list.length)
									inheritsFrom = list.children("[type]").first().attr("id")
								}
							//create on
							 	var aTool =  whichTool(content.type);
			                        aTool = configuredTool(aTool);
			                       
			                        //content.id = $(aTool).attr("id");
			                        //overwrite generated id with id user passed in
			                        $(aTool).attr("id",content.id)
			                        if(inheritsFrom != null){
			                        	$(aTool).attr("extends",inheritsFrom)
			                        }
			                        log.error(aTool)
			                        log.error("The copied Content id is " + content.id)


			                        //get stylesheet for this element. Will be merged with server overrides a few lines later
			                        //ELEM_1485486134283

			                        list.append(aTool);


			                        //$("#"+ content.id).css(content)
			                        //break;
						}


			           
						cssObj = $("#"+ content.id).css(key,content[key])

						//setUpDiv($(cssObj))

						if(!cssObj.css(key)){

							cssObj.attr(key,content[key])
						}
				}
				}
			}

	}

	 var cssObj = $("#"+ content.id);

	 if(cssObj.length > 0){
	 	if(cssObj.attr("type") == "ICON"){
	 		log.debug("Font size is " + $(cssObj).css("font-size"))
	 		log.debug("Before Width size is " + $(cssObj).css("width"))
	 	}
	
	 	CUSTOM_PXTO_VIEWPORT($(cssObj),cssObj.position().left,cssObj.position().top)
	 }

}

function getServerContent(list,callback){

	var list = $(list)

	var content = {};

	log.warn("Retrieving content for [" + list.attr("alias") + "]")

	
	content["social-icons"] = [
							{"id":"ELEM_1485486134283","class":"fa fa-fw fa-twitter","type":"ICON"},
							{"id":"ELEM_1485486137381","class":"fa fa-fw fa-instagram","type":"ICON"},
							{"id":"ELEM_1485486140425","class":"fa fa-fw fa-linkedin","type":"ICON"},
							{"id":"ELEM_1485486143188","class":"fa fa-fw fa-facebook","type":"ICON"},
							{"id":"ELEM_800","class":"fa fa-fw fa-tumblr","type":"ICON"}
							];
					
	content["movies"] = [
							{"id":"firstone","type":"DIV","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-0.jpg\")"},
							{"id":"ELEM_1485401888749","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-2.jpg\")","type":"DIV"},
							{"id":"ELEM_1485401890716","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-1.jpg\")","type":"DIV"},
							{"id":"ELEM_1485401892377","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-3.jpg\")","type":"DIV"},
							{"id":"ELEM_1485401894461","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-4.jpg\")","type":"DIV"},
							{"id":"ELEM_1485401896416","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-5.jpg\")","type":"DIV"}
								]
							
					

	content["featured-movie"] = [{"id":"ELEM_1485401894461","background-size":"cover","background-image":"url(\"https://www.brownsugar.com/images/posters/poster-4.jpg\")","type":"DIV"}]
								
	
	callback(content[list.attr("alias")])

}


