

var currentTool = {}
var currentNode = {}

var lastComputed = 0;

var standardFields = "id:0;extends:none;alias:none;background-image:none;display:block;src:none;text:none;class:none;type:none;width:0;height:0;";

var simple = (CSSTEXT_HARDCODEDCSSTEXT + standardFields).split(";")

CONVERT_STYLE_TO_CLASS_OBJECT = function(element, includeCustomClasses){

 	element = $(element)

  	normalizedObject = {}

	var theClassObj = {}
			//Enter Code Below
			log("Trying to convert element")
			log(element)

	$(simple).each(function(x,str){

	   key = str.substring(0,str.indexOf(":")).trim();

	   //Very Important!!! Filter out alias classes
	   if(key.startsWith("common-") && !includeCustomClasses){
	   
	   	key = key.substring(key.indexOf("-")+1)
	   }

	   defaultValue = str.substring(str.indexOf(":")+1).trim();
	   //theClassObj[key] = value;
	   myValue = !$(element).css(key) ? $(element).attr(key) : $(element).css(key)	

	   if(key == "text"){
			var innerTxt = element.contents().filter(function(){return this.nodeType == 3})[0]
			if(innerTxt && innerTxt.nodeValue && innerTxt.nodeValue.trim().length > 0){
				theClassObj[key] = innerTxt.nodeValue;
			}			
		} else if(key == "src"){
			theClassObj[key] = element.find(".content-image").attr("src")

		} else if(key == "display" || includeCustomClasses || (defaultValue != myValue && myValue != undefined ) ){
			    log.error("[" + key +"] " + ":" + myValue + "!=" + defaultValue)
		  		theClassObj[key] = myValue;	  		
		} else if(key.indexOf("border") > -1 ){
			log.debug(" Key is " + key + " and value is " + myValue)
		}
	})

	if(element.is("[type=MENU-OPTION],[type=MENU-ITEM],[type=MENU]")){
		theClassObj["font-size"] = "inherit";
		//theClassObj["color"] = "inherit";
		theClassObj.height="inherit";
		theClassObj.width="inherit";
		theClassObj.position="relative";
		//theClassObj.width = element.parents("[type=T]").width()/element.siblings("[type]").length
	}

	log.error("Background is now " + theClassObj["background-color"])

	theClassObj = computeDimensions(theClassObj)



	var outStr = "." + element.attr("id") + " {\n";

	$.each(theClassObj,function(index,element){
		outStr += "\t" + index + ":" + theClassObj[index] + ";\n";
	})

	outStr +="}"
	//theClassObj["rawjson"] = JSON.stringify(theClassObj);
	theClassObj["cssRule"] = outStr;
	if(theClassObj.type == "ICON"){
		log.debug("CSS Rule for ICON")
		log.debug(theClassObj.cssRule)
	}

	

	return theClassObj;

}


function computeDimensions(theClassObj){

	//moveMe = $(moveMe)

	var X = theClassObj.left;

	var Y = theClassObj.top;

  	var units = "vw";

  	var adjuster = 1;

  	var numbersInPXReg = /([+-]?\d+(?:\.\d+)?)(px)/g

  	if(units =="vw"){
  		adjuster = (100 / document.documentElement.clientWidth);
  		log.debug("Adjuster is " + adjuster);
  		log.debug(theClassObj["width"])	
  	}

  	for(field in theClassObj){

  		var val = theClassObj[field];

  		var groups = null;

  		var computedValue = ""

  		while( ( groups = numbersInPXReg.exec(val) ) != null) {

  			//log.debug("Converting value groups[0] " + groups[0] + " to vw")
  			var newValue = adjuster * groups[1] + units 
  			computedValue += newValue + " ";
  			log.trace("Converted from groups[0] " + groups[0] + " to " + newValue);

  			if(theClassObj.type == "ICON" && field == "width"){
  				log.debug("Before " + theClassObj[field] + " After is " + computedValue)
  			}

  		}

  		//Don't try to convert background-images.  This will cause problems for data:image embedded bas64 images
  		if(computedValue.length > 0 && field != "background-image"){
  			computedValue = computedValue.trim();
  			log.trace("Overwriting field [" + field + "] with new computed value [" + computedValue + "]")
  			theClassObj[field] = computedValue;
  		}

  	}

  	//override Line Height?
  	if(theClassObj.type == "BTN" || theClassObj.type == "TXT" || theClassObj.type == "ICON"){
  		theClassObj["line-height"] = theClassObj["font-size"];
  	}

  	theClassObjParent = $("#"+theClassObj["id"]).parent();
  	//theClassObj["line-height"] = theClassObj["type"] == "ICON" ||  theClassObj["type"] == "BTN" ? theClassObj["height"] : ( adjuster * parsePx(theClassObj["line-height"]));
  	//any last minute overrides
  	if($("#"+theClassObj["id"]).parent(".dropped-object").is("[type=LIST]")){

  		obj = $("#"+theClassObj.id);

  		if(!obj.is("[type=T],[type=BTN],[type=MENU-ITEM],[alias^=cntrl]") ) {
			//moveMe.css({top:0,left:0,position:"relative"})
			console.log("I am a LIST and i am overwriting position " + theClassObj.position + " alias is " + theClassObj.alias)
			theClassObj["top"] = 0;
			theClassObj["left"] = 0;
			console.log("Inside the list")
			if(parseFloat(theClassObj["font-size"]) > 400 ){
				//error
				theClassObj["font-size"] = "16px";
				$("#"+theClassObj["id"]).parent().css("font-size","16px")
			}
			//$("#"+theClassObj["id"]).parent().css("line-height","0")
			//$("#"+theClassObj["id"]).parent().css("font-size","20")
			//theClassObj["line-height"] = "20px";
			//theClassObj["font-size"] = "20px";
			theClassObj["position"] = "relative";
			//theClassObj["float"] = "left"
			//theClassObj["width"] = "20px"
			 theClassObj["display"] = "inline-block";
		}
		
	} 

	if($("#"+theClassObj["id"]).is("[type=MENU-OPTION]")){
		theClassObj.position = "relative";
	}


	console.log("Inner saw the theClassObj.position as " + theClassObj["position"])
	if(theClassObj["position"] == undefined){

		theClassObj["position"] = "absolute";
		console.log("Over saw the theClassObj.position as " + theClassObj["position"])
	}

	return theClassObj;


}

  function doItCool(moveMe,X,  Y , width, height){

  	if($(moveMe).attr("type") == "ICON"){
  		log.debug("Proxy overwrite width is " + width)
  		 moveMe.css("width",width)
 		log.error("PROXY AFTER Width size is " + moveMe.css("width"))
 	}
  	CUSTOM_PXTO_VIEWPORT(moveMe,X,Y)
  }


  var CUSTOM_PXTO_VIEWPORT = function( moveMe,X,  Y ) {
  	
	//$(moveMe).removeClass("submenu");
	moveMe = $(moveMe);

	log.debug("Starting conversion....")

	if($(moveMe).attr("type") == "ICON"){
 		log.debug("AFTER Width size is " + moveMe.css("width"))
 	}

 	$(moveMe).removeClass("submenu");

	
	theClassObj = CONVERT_STYLE_TO_CLASS_OBJECT($(moveMe))


	CSS_TEXT_saveCss(moveMe, theClassObj)
	
	/*
	var myId = $(moveMe).attr("id");

	var myCSSLookupKey = "\\." + $(moveMe).attr("id")

	var re = new RegExp(myCSSLookupKey+'\\s+\\{[^}]+\\}','img')

	var thescript = "";
	

	if(isBreakPoint()){
		
		saveBreakPoint($(moveMe),theClassObj)

	} else {

		log.debug("My Class should be persisted as")
		log.debug(theClassObj.cssRule)

		thescript = $("style.generated");

		styleCss = thescript.html();
		//test to see if style is not found, add it.  If found, replace it
		if(!thescript.html().match(re)){
			log.error("Appending RULE for " + myId)
			thescript.append(theClassObj.cssRule + "\n");
		}else {
			log.error("I found  RULE for " + myId)
			thescript.html(thescript.html().replace(re,theClassObj.cssRule))
		}
	}
	*/
	if(theClassObj.type == "DIV"){
		log.error("Foxy")
		log.error(theClassObj.cssRule)
	}

	$(moveMe).addClass($(moveMe).attr("id"))

	//remove inline style since we have added a class
	$(moveMe).attr("style","");

	delete theClassObj;

	return moveMe;
}

;(function( $ ) {

	$.fn.aeImageResize = function( params ) {

		params.height = params.height -20;
		params.width = params.width - 20;

		var aspectRatio = 0;

		// We cannot do much unless we have one of these
		if ( !params.height && !params.width ) {
			return this;
		}


		// Calculate aspect ratio now, if possible
		if ( params.height && params.width ) {
			aspectRatio = params.width / params.height;
		}

		log("Resizer called with params ")
		log({params:params})

		// Attach handler to load
		// Handler is executed just once per element
		// Load event required for Webkit browsers
		return this.one( "load", function() {

			log("Running image Resizer")

			// Remove all attributes and CSS rules
			this.removeAttribute( "height" );
			this.removeAttribute( "width" );
			this.style.height = this.style.width = "";

			var imgHeight = this.height
				, imgWidth = this.width
				, imgAspectRatio = imgWidth / imgHeight
				, bxHeight = params.height
				, bxWidth = params.width
				, bxAspectRatio = aspectRatio;

			// Work the magic!
			// If one parameter is missing, we just force calculate it
			if ( !bxAspectRatio ) {
				if ( bxHeight ) {
					bxAspectRatio = imgAspectRatio + 1;
				} else {
					bxAspectRatio = imgAspectRatio - 1;
				}
			}

			// Only resize the images that need resizing
			//if ( (bxHeight && imgHeight > bxHeight) || (bxWidth && imgWidth > bxWidth) ) {

				if ( imgAspectRatio > bxAspectRatio ) {
					bxHeight = ~~ ( imgHeight / imgWidth * bxWidth );
				} else {
					bxWidth = ~~ ( imgWidth / imgHeight * bxHeight );
				}

				this.height = bxHeight;
				this.width = bxWidth;

				log({rH:this.height,rW:this.width})
			//}
		})
		.each(function() {

			// Trigger load event (for Gecko and MSIE)
			if ( this.complete ) {
				$( this ).trigger( "load" );
			}

			// This fixes IE9 issue
			this.src = this.src;
		});
	};

})( jQuery );




