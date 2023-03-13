

var currentTool = {}
var currentNode = {}

var lastComputed = 0;

var standardFields = "id:0;extends:none;alias:none;border:none;border-radius:0px;background-image:none;display:flex;src:undefined;text:none;class:none;type:none;width:0;height:0;points:0;stroke:0";

var simple = (CSSTEXT_HARDCODEDCSSTEXT + standardFields).split(";")


//var simple = "id: hello;height: 35.486160397445vw;width: 42.583392476933994vw;position: absolute;left: 50px;top: 300px;background-image: url(http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i203/ppg_unordinaryweek_725x400.jpg);".split(";")

CONVERT_STYLE_TO_CLASS_OBJECT = function(element, includeCustomClasses){

 	element = $(element)

  	normalizedObject = {}

	var theClassObj = {}
			//Enter Code Below
			log("Trying to convert element")
			log(element)

	$(simple).each(function(x,str){

	   log.debug("Still Working on " + str)
	   key = str.substring(0,str.indexOf(":")).trim();

	   if(key.trim().length == 0){

	   }

	   //Very Important!!! Filter out alias classes
	   if(key.startsWith("common-") && !includeCustomClasses){
	   
	   	key = key.substring(key.indexOf("-")+1)
	   }

	   defaultValue = str.substring(str.indexOf(":")+1).trim();
	   //theClassObj[key] = value;
	   myValue = !$(element).css(key) ? $(element).attr(key) : $(element).css(key)	

	   if(key == "text"){
	   		/*
			var innerTxt = element.contents().filter(function(){
				return this.nodeType == 3
			})[0]*/
			var innerTxt =  "";

			log.debug(`Reading text context for element ${element.attr("id")} and text ${element.text()}`)
			
			element.children(".text-detail").contents().each(function(){
				switch (this.nodeType) {
					case 1:
						log.debug(`JQ ${this.outerHTML} class = ${$(this).attr("class")}`);
						var jq = $(this.outerHTML);
						//log.debug(`JQ is ${this.id}`)
						if(jq.attr("class") && jq.attr("class").match(/(?<!\<i class="fa\s|\<div class="fa\s)((fa\-\w+)(?:(?:-\w+)+)?)/ig))
							innerTxt += jq.attr("class").match(/(?<!\<i class="fa\s|\<div class="fa\s)((fa-\w+)(?:(?:-\w+)+)?)/ig)[0];
					break;
					case 3:
						log.debug(`JQ: Found some txt nodes ${this.nodeValue}`);
						innerTxt +=this.nodeValue;
					break;
					default:
					break;

				}
			})
			log.debug(`JQ: Found Overwriting ${key} with value ${innerTxt}`)
			theClassObj[key] = innerTxt;
			/*
			if(innerTxt && innerTxt.nodeValue && innerTxt.nodeValue.trim().length > 0){
				theClassObj[key] = innerTxt.nodeValue;
			}	*/		
		} else if(key == "src"){
			theClassObj[key] = element.find(".content-image").attr("src")

		} else if(key == "display" || includeCustomClasses || (defaultValue != myValue && myValue != undefined ) ){
			    log.trace("EXTENSIONS2.js: [" + key +"] " + ":" + myValue + "!=" + defaultValue)
		  		theClassObj[key] = myValue;	  		
		} else if(key.indexOf("border") > -1 ){
			log.debug("EXTENSIONS2.js: Key is " + key + " and value is " + myValue)
		} 

		if(key == "transition-duration"){
			myValue = getTransitionDuration(element);
			theClassObj["-webkit-transition-duration"] = myValue;
			theClassObj["-moz-transition-duration"] = myValue
			theClassObj["-o-transition-duration"] = myValue;
			log.debug(`Wrote a ${key} directly to HTML`)
			$(element).attr("transition-duration",getTransitionDuration(element))
			log.debug(`Wrote a transition-duration directly to HTML ${$(element).attr("id")} ${element.attr(key)}`)
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

	log.info("EXTENSIONS2.js: Background is now " + theClassObj["background-color"])
	log.info("EXTENSIONS2.js: position is now " + theClassObj["position"])


	var regularStyles = {};

	try {
		position = getComputedStyle(element[0]).position;
		console.log(`I want to overwrite ${position}`)
			theClassObj.position = position;

	}catch(e){
		console.log(`Get Computed error ${e}`)
	}

	//Object.assign(theClassObj,regularStyles);

	theClassObj = computeDimensions(theClassObj)

	
	/*

	var outStr = "." + element.attr("id") + " {\n";

	$.each(theClassObj,function(index,element){
		outStr += "\t" + index + ":" + theClassObj[index] + ";\n";
	})

	outStr +="}"
	//theClassObj["rawjson"] = JSON.stringify(theClassObj);
	theClassObj["cssRule"] = outStr;
	
	if(theClassObj.type == "ICON"){
		log.debug("EXTENSIONS2.js:CSS Rule for ICON")
		log.debug(theClassObj.cssRule)
	}*/

	log.debug(`Wrote CSS: ${theClassObj["cssRule"]}`);

	return theClassObj;

}


function computeDimensions(theClassObj,Query,cWidth){


	var theDocWidth = cWidth ? cWidth : document.documentElement.clientWidth;

	//moveMe = $(moveMe)
	if(Query){
		$ = Query;
	}


	var X = theClassObj.left;

	var Y = theClassObj.top;

  	var units = "vw";

  	var adjuster = 1;

  	var numbersInPXReg = /([+-]?\d+(?:\.\d+)?)px/g

  	if(units =="vw"){
  		adjuster = (100 / theDocWidth);
  		log.debug("EXTENSIONS2.js:Adjuster is " + adjuster);
  		log.debug(theClassObj["width"])	
  	}

  	for(field in theClassObj){

  		var val = theClassObj[field];

  		var groups = null;

  		var computedValue = ""

  		while( ( groups = numbersInPXReg.exec(val) ) != null) {

  			//log.debug("EXTENSIONS2.js:Converting value groups[0] " + groups[0] + " to vw")
  			var newValue = adjuster * groups[1] + units 
  			computedValue += newValue + " ";
  			log.trace("Converted from groups[0] " + groups[0] + " to " + newValue);

  			if(theClassObj.type == "ICON" && field == "width"){
  				log.debug("EXTENSIONS2.js:Before " + theClassObj[field] + " After is " + computedValue)
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
  	var me = $("#"+theClassObj["id"]);
  	if($("#"+theClassObj["id"]).parent(".dropped-object").is("[type=LIST],[type=NAVIGATION]")){

  		obj = $("#"+theClassObj.id);

  		if(!obj.is("[type=T],[type=BTN],[type=MENU-ITEM],[alias^=cntrl]") ) {
			//moveMe.css({top:0,left:0,position:"relative"})
			log.debug("EXTENSIONS2.js: I am a LIST and i am overwriting position " + theClassObj.position + " alias is " + theClassObj.alias)
			theClassObj["top"] = 0;
			theClassObj["left"] = 0;
			log.debug("EXTENSIONS2.js: Inside the list")
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
			theClassObj["display"] = "absolute";
		}
		
	} 

	if($("#"+theClassObj["id"]).is("[type=MENU-OPTION]")){
		theClassObj.position = "relative";
	}


	log.debug("EXTENSIONS2.js: Inner saw the theClassObj.position as " + theClassObj["position"])
	if(theClassObj["position"] == undefined){

		theClassObj["position"] = "absolute";
		log.debug("EXTENSIONS2.js: Over saw the theClassObj.position as " + theClassObj["position"])
	}

	var outStr = "." + theClassObj.id + " {\n";

	var obj = {a: 1, b: 2, c: 3};
    
	for (var prop in theClassObj) {
	  outStr += "\t" + prop + ":" + theClassObj[prop] + ";\n";
	}

	outStr +="}"
	//theClassObj["rawjson"] = JSON.stringify(theClassObj);
	theClassObj["cssRule"] = outStr;
	

	return theClassObj;


}

function EXTENSIONS_delaySaving_PXTO_VIEWPORT(moveMe,X,Y){ 

	EXTENSIONS_timer = setTimeout(function() {
	 CUSTOM_PXTO_VIEWPORT(moveMe,X,Y); 
	}, 200) 
} 


  var CUSTOM_PXTO_VIEWPORT = function( moveMe,X,  Y ) {


  	//$(moveMe).removeClass("debug-border-style");
  	
	X = moveMe.position().left;

	Y = moveMe.position().top;

	log.debug("EXTENSIONS2.js:Starting conversion....")

	if($(moveMe).attr("type") == "ICON"){
 		log.debug("EXTENSIONS2.js:AFTER Width size is " + moveMe.css("width"))
 	}

 	$(moveMe).removeClass("submenu");

 	if(!editing && parseInt(moveMe.css("border-width")) > 0){
 		moveMe.removeClass("noborder");
 	}

 	//clean up class

 	cleanUpClassString(moveMe);


	theClassObj = CONVERT_STYLE_TO_CLASS_OBJECT($(moveMe))

	console.log(`theClassObj is ${JSON.stringify(theClassObj)}`)


	CSS_TEXT_saveCss(moveMe, theClassObj)
	
	$(moveMe).addClass($(moveMe).attr("id"))

	//remove inline style since we have added a class
	$(moveMe).attr("style","");

	/*
	if(!editing && parseInt(moveMe.css("border-width"))  0){
 		moveMe.addClass("noborder");
 	}*/

	delete theClassObj;

	//$(moveMe).addClass("debug-border-style");

	//Scroll To Layer in UI
	//reLoadLayers();

	//scrollToLayer(moveMe.attr("id"));

	return moveMe;
}


function cleanUpClassString (element){
  //  $(element).each(function(i){
		//$(element).removeClass(`idella-${$(element).attr("type").toLowerCase()}`)
    var classArr = $(element).attr("class").split(/\s+/);
    console.log(`This is the split.... ${classArr.toString()}`);
    var cleanArr = ["cleaned"];
    //var dontWrite = ["idella-photo","idella-squarepeg","idella-container","idella-video"]
    for(i=0;i < classArr.length;i++)
    {
        if(!cleanArr.includes(classArr[i])){

            cleanArr.push(classArr[i]);
        } else {
            console.log(`Saw ${classArr[i]} in cleanArr so skipping it for id ` );
        }
    }
       
    console.log(`The after is ${cleanArr.toString()}`)
    $(element).attr("class",cleanArr.toString().replace(/,/g," "))
//})
}


