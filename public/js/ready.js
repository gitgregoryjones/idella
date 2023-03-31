var ready = `
onclick 
{

	//Menu Options for Top Nav
	#ELEM_1600297097370: magic;
	.iilayers : showHideMenu;
	.iisave : SAVEJS_goInactive;
	.iiexplore : explore;
	.iireview : CUSTOM_pressEscapeKey;


	//Double Click file
	#fileElem: popupFileChooser;
	#audioElem: popupFileChooser;

	.shapes : transformers;

	[type=SVG]: r_addPointAt;

	

}

onpageReloaded {

	body : r_writePoints;

}

onresize {

	document : r_redrawSVGs;


}

onresizestart {
	
	window : startTransitions;
}

onresizestop {
	window : stopTransitions;
	
}


`;
//Get SVGs
$(document).ready(function(){
	//window.onresize = r_redrawSVGs;

	
	
})








function r_openNote(evnt){
		evnt.stopPropagation()
		$(evnt.target).mouseover();
		setTimeout(function(){
			$(evnt.target).find("[class*=fa-]").click();
		},300)
		
		//event.stopPropagation();
}

function r_lookupHover(element){

			var theValue = "";

			var myCSSLookupKey = `${$(element).attr("id")}`;
			console.log(`Hover lookup key for ${myCSSLookupKey} is ${"body.hover ." + myCSSLookupKey + ":hover"}`)
			var hoverRegex = new RegExp("body.hover ."+  myCSSLookupKey+":hover"+'\\s+\\{[^}]+\\}','img');
			var matches = [];
			if((matches = $("#pageStyles").html().match(hoverRegex)) != null){
				theValue = matches[0].replace("\n}","").substr(matches[0].indexOf("{") + 1, matches[0].lastIndexOf("}")-1).trim();
				console.log(`Found a match for body.hover .${myCSSLookupKey}:hover ${matches[0]} converted to value ${theValue}`);
			}

			return theValue;
}

function r_hoverOverElement(evnt){


	$(".highlight").remove();

	var aTool = $(evnt.target);



	var border = $("<div>",{class:"highlight", "highlight-id":$(aTool).attr("id")});

					//$(".layer").removeClass("highlight");
					/*
					if($(aTool).attr("previous-style") == undefined){
						$(aTool).attr('previous-style',$(aTool).css("border"));
						//$(aTool).css({border:"solid red"});						
					}*/
					//$(aTool).addClass('highlight');	
					//$(aTool).mouseover();

					
					aTool = $(aTool);

					if(aTool[0] == undefined)
						return;

					aTool.parent().append(border);



					border.css({
						width:aTool.width(),
						height:aTool.height() ,
						top:aTool[0].offsetTop,//.position().top * 1.7 - 95/2,
						left:aTool[0].offsetLeft,//.position().left * 1.7 -95/2,

						position:"absolute",
						"z-index":aTool.css("z-index") + 1
					})
					return;
}


function r_redrawSVGs(evt){

	console.log("Called redrawSVGs")

	log.debug(`Time to redraw SVGs`);

	var svg = $("#content [type=SVG]");

	svg.each(function(){

		coords = $(this).find(".coordinate");

		console.log(`Coords length is ${coords.length}`)
		//Resize Points
		var polygon = $(this).find("polygon");

		var cPoints = polygon.attr("points");

		var pointsArray = cPoints.trim().split(/\s+/)

		var index = 0;

		var responsivePoint = pointsArray.map(function(point){

			xy = point.split(",");

			console.log(`Units before ${point} for index ${index}`);

			var newPoint = `${$(coords[index]).position().left},${$(coords[index]).position().top}`;

			$(coords[index]).attr("coordinate",newPoint);

			index++;
			/*
			var unitsWidth = (xy[0] * (100/document.documentElement.clientWidth));

			var unitsTop = (xy[1] * (100/document.documentElement.clientWidth)) ;

			console.log(`Units are ${unitsWidth}  ${unitsTop}`);

			console.log(`UnitsW to PX ${(parseFloat(unitsWidth) * document.documentElement.clientWidth)/100 }`) 

			var w2Px = (parseFloat(unitsWidth) * document.documentElement.clientWidth)/100

			var h2Px = (parseFloat(unitsTop) * document.documentElement.clientWidth)/100

			var newPoint = `${w2Px},${h2Px}`;
			*/
			console.log(`Returing newPoint ${newPoint}`)
			

			return newPoint;

		}).join(" ");

		polygon.attr("points",responsivePoint);

	})


}

function r_resizeHitBox(evt){

	var me = $(evt.target);
	var parent = me.siblings("svg")
	var cPoints =  parent.find("polygon").attr("points");
	var pointsArray = cPoints.trim().split(/\s+/);
	console.log(`Points Array is ${pointsArray}`)
	//Loop and find my coordinate and redraw Polygon

	//Get Lowwww
	var lowXY = pointsArray.reduce(function(pointA, pointB){

		console.log(`Looking at point ${pointA}`)
    	var xy1 = pointA.split(",");
    	var xy2 = pointB.split(",");

    	var point = {lowX:0, lowY:0};
    	//find low x and high x
    	point.lowX = parseFloat(xy1[0]) < parseFloat(xy2[0]) ?  xy1[0] : xy2[0];
    	point.lowY = parseFloat(xy1[1]) < parseFloat(xy2[1]) ?  xy1[1] : xy2[1];

    	return `${point.lowX},${point.lowY}`;


    })

    var highXY = pointsArray.reduce(function(pointA, pointB){

		console.log(`Looking at point ${pointA}`)
    	var xy1 = pointA.split(",");

    	var xy2 = pointB.split(",");


    	var point = {highX:0, highY:0};

    	//find low x and high x
    	point.highX = parseFloat(xy1[0]) > parseFloat(xy2[0]) ?  xy1[0] : xy2[0];
    	point.highY = parseFloat(xy1[1]) > parseFloat(xy2[1]) ?  xy1[1] : xy2[1];

    	return `${point.highX},${point.highY}`;


    })

	console.log(`Points are lowXY: ${lowXY} and highXY: ${highXY}`)
	//parent.find("polygon").attr("points",changedPoints);
    

}

function r_dragPoints(evt){
	var me = $(evt.target);
	var parent = me.siblings("svg")
	var cPoints =  parent.find("polygon").attr("points");
	var pointsArray = cPoints.trim().split(/\s+/);
	//Loop and find my coordinate and redraw Polygon
	var changedPoints = pointsArray.map(function(point){
    	var xy = point.split(",");
    	log.debug(`Comparing [${point}] and [${me.attr("coordinate")}]`)
    	if( point == me.attr("coordinate")){
    		log.debug(` Overwriting ${point} with ${me.position().left},${me.position().top}`)
    		me.attr("coordinate",`${me.position().left},${me.position().top}`);
    		return `${me.position().left},${me.position().top}`;
    	} else {
    		return point;
    	}

    }).join(" ")

	parent.find("polygon").attr("points",changedPoints);

	r_resizeHitBox(evt)
    

}


function r_writePoints(evt){

	//log.debug(`Element is ${JSON.stringify(evt.target)}`)

	var selector = "#content [type=SVG]";

	if(evt.solo){
		console.log(`Was this a body? ${evt.target.nodeName}`)
		element = $(evt.target);
		element.unbind("on",r_addPointAt).on("click",r_addPointAt);
		selector = `#${element.attr("id")}`

	} else {
		log.debug(`Deleting everything!`)
		//delete All Points and recreate
		$(".coordinate").remove();
	}

	log.debug(`Writing Some Points for selector ${selector} length is ${$(selector).length}`);



	$(selector).each(function(){
		svg = $(this);
		log.debug(`${svg.html()}`)
		var cPoints = svg.find("polygon").attr("points");
		log.debug(` Points found are ${cPoints.split(/\s+/)}`)
		var pointsArray = cPoints.trim().split(/\s+/);
		pointsArray.forEach(function(item){
			 var coord = item.split(",");
			 var aTool =  whichTool("div");

			    aTool = configuredTool(aTool);

			    aTool.css({height:10,width:10});

			    aTool.addClass("coordinate").css({left:parseFloat(coord[0]) - parseFloat(svg.css("border-width")) -aTool.width()/2 ,top:parseFloat(coord[1]) - parseFloat(svg.css("border-width")) - aTool.height()/2,border:"4px solid red", "background-color":"yellow"}).attr("coordinate",coord.join(","))

			    log.debug(`The SVG offset left is ${svg.width()}`)

			    dropTool(aTool,{target:svg,clientX:parseFloat(coord[0]) + (svg.offset().left - parseFloat(svg.css("border-width") ) ),clientY:parseFloat(coord[1]) + (svg.offset().top - parseFloat(svg.css("border-width")))});

			   // aTool.css({left:parseFloat(coord[0]) - parseFloat(svg.css("border-width")) -aTool.width()/2 ,top:parseFloat(coord[1]) - parseFloat(svg.css("border-width")) - aTool.height()/2})

				aTool.removeClass("dropped-object")
				.addClass("coordinate")
				.resizable("destroy")
				.on("click",r_deletePointAt)
				.on("drag",r_dragPoints)
				.draggable("option","containment","parent");
		})

		
	})
	
	

}

function r_getLayers(){

	var data = ["div","img","list"];

	console.log(`${$(".layer").length}`)

	$(".layer").each(function(){
		console.log(`Looping...`)
		//data.push(`${$(this).find(".details > [type=text]").val()}`);

	})

	console.log(`Data is ${data}`);


	return data;
}

function r_sliderSVGPenStrokeValue(event,ui){

	console.log(`Stroke Width is ${ui.value}`)

	element = $(`#${$(event.target).attr("slider-for")}`)

	element.css("stroke-width",ui.value);

}



function r_sliderStartValue(event,ui){

	element = $(`#${$(event.target).attr("slider-for")}`)

	element.attr("initial-slider-value",ui.value);

}


function r_deletePointAt(evt) {

    
    var cPoints = $(evt.target).siblings("svg").find("polygon").attr("points");

    var pointArray = cPoints.trim().split(/\s+/);

    log.debug(`pointsArr ${pointArray} and X is ${$(evt.target).position().left} and Y is ${$(evt.target).position().top}`);

    var remainingPoints = pointArray.map(function(point){
    	var xy = point.split(",");
    	log.debug(`Comparing [${point}] and [${$(evt.target).attr("coordinate")}]`)
    	if( point != $(evt.target).attr("coordinate")){
    		log.debug(` Returning ${point}`)
    		return point;
    	}
    }).join(" ")

    log.debug(`remainingPoints ${remainingPoints}`);



    $(evt.target).siblings("svg").find("polygon").attr("points",remainingPoints);

    $(evt.target).remove();
    evt.stopPropagation();


}

function r_addPointAt(event){





	console.log(`Mouse X and Y ${event.clientX},${event.clientY}`)

	if(!event.target)
		return;


	//currentCtx = event.target;
	currentCtx = CUSTOM_currentlyMousingOverElementId ? $("#"+CUSTOM_currentlyMousingOverElementId) : $(event.target)

	//https://stackoverflow.com/questions/1771627/preventing-click-event-with-jquery-drag-and-drop
	if(currentCtx.attr("noclick")){
		currentCtx.removeAttr("noclick");
		console.log("ignore click")
		return;
	}

	if(currentCtx.find(".fa-unlock").length == 0){

		console.log(`The element is not unlocked`)
		return;
	}


    currentY = event.clientY + window.scrollY

    var aTool =  whichTool("div");

    aTool = configuredTool(aTool);

    aTool.css({width:10,height:10,border:"3px solid red", "background-color":"yellow"}).addClass("coordinate")





    dropTool(aTool,{target:currentCtx,clientX:(event.clientX),clientY:(currentY)});

    aTool.resizable("destroy");

    var cPoints = currentCtx.find("polygon").first().attr("points");

    //sort points by X
   arrPoints = cPoints.split(/\s+/);

   arrPoints.push(`${aTool.position().left},${aTool.position().top}`);

   /*

    var lowestDistance = 1000000;

    var closestCoord = null;

    var sortedPoints = arrPoints.sort(function(pointA,pointB){

    	var Ax = parseFloat(pointA.split(",")[0]);

    	var Ay =  parseFloat(pointA.split(",")[1]);

    	var Bx = parseFloat(pointB.split(",")[0]);

		var By = parseFloat(pointB.split(",")[1]);   



		//calculate Distance from Origin

		var currentADistance = Math.sqrt(Math.pow((Ax-0),2) + Math.pow((Ay-0),2));

		var currentBDistance = Math.sqrt(Math.pow((Bx-0),2) + Math.pow((By-0),2));

		console.log(`distance of A is ${currentADistance}`)

		console.log(`distance of B is ${currentBDistance}`)

		

		if( currentADistance < currentBDistance ){
    		return -1;
    	} else if(currentADistance == currentBDistance){ 

    		return 0;
    	} else if(currentADistance > currentBDistance){
    		return 1;
    	}

		
    })

    console.log(`Sorted from origin (0,0) ${sortedPoints}`)

   /*

    combinedPointsAsStr = arrPoints.map(function(point){

    	var x1 = parseFloat(point.split(",")[0]);

    	var y1 =  parseFloat(point.split(",")[1]);

    	var meX = parseFloat(closestCoord.split(",")[0])
    	
    	var meY = parseFloat(closestCoord.split(",")[1])

    	console.log(`Comparing [${closestCoord}] to [${point}]`)

    	if(parseFloat(meX) == parseFloat(x1) && parseFloat(meY) == parseFloat(y1)){
    		if(aTool.position().left < meX){
    			point = `${aTool.position().left},${aTool.position().top} ${point}`;
    			console.log(`Modified new point to be ${point}`)
    		} else {
    			point = `${point} ${aTool.position().left},${aTool.position().top}`
    		}
    	}  else {
    		console.log(`[${meX}] != [${x1}]`)
    	}

    	return point;

    	
    }).join(" ").trim();
	*/
    
	var combinedPointsAsStr = arrPoints.join(" ").trim();
 
   	console.log(`combinedPoints is ${combinedPointsAsStr}`)
    /*
    var sortedArr = arrPoints.sort(function(one,two){


    	var x1 = parseFloat(one.split(",")[0]);

    	var y1 =  parseFloat(one.split(",")[1]);

    	var x2 = parseFloat(two.split(",")[1]);

    	

    	//console.log(`comparing ${oneTotal} and ${twoTotal}`)

    	if( oneTotal < twoTotal ){
    		return -1;
    	} else if(oneTotal == twoTotal){ 

    		return 0;
    	} else if(oneTotal > twoTotal){
    		return 1;
    	}
    })*/

    //var pointsAsStr = combinedPoints.join(" ").trim();

    currentCtx.find("polygon").first().attr("points",`${combinedPointsAsStr}`)

    aTool.removeClass("dropped-object").attr("coordinate",`${aTool.position().left},${aTool.position().top}`);

    aTool.on("click",r_deletePointAt).on("drag",r_dragPoints).draggable("option","containment","parent");

}



/** Resize SVG Children **/
/** TODO Resize based on proportions to parent box **/
function r_resizeSVG(event,ui){

		log.debug(`UI as percent is ${ui.value}`)

		log.debug(`Event target is ${$(event.target).attr("slider-for")}`);

		element = $(`#${$(event.target).attr("slider-for")}`)

		/*
		var pointAttr = element.find("polygon").attr("points");
		
		log.debug(`Points are ${pointAttr}`);

		pointsArr = pointAttr.split(/\s+/);

		var operation = parseInt(element.attr("initial-slider-value")) < ui.value ? "multiply" : "divide";

		var updatedPoints = pointsArr.map(function(point){
			var xy = point.split(",");
			if(operation == "multiply"){
				return (xy[0] * ( 1+ ui.value/100)) + "," + (xy[1] * (1 + ui.value/100));
			} else {
				return (xy[0] / ( 1+ ui.value/100)) + "," + (xy[1] / (1 + ui.value/100));
			}		
				
			
		}).join(" ");

		var maxPoint = pointsArr.reduce(function(obj1,obj2){

			log.debug(`Object 1 is ${obj1} ${obj2}`)

			var point1 = obj1.split(",");

			var point2 = obj2.split(",");

			log.debug(`Point 1 is ${point1[0]} and Point 2 is ${point2[0]}`)

			var highX = parseFloat(point1[0]) > parseFloat(point2[0]) ? point1[0] : point2[0];

			var highY = parseFloat(point1[1]) > parseFloat(point2[1]) ? point1[1] : point2[1];

			log.debug(`High X  ${highX} and High Y ${highY}`)

			return `${highX},${highY}`;

		})

		element.find("polygon").attr("points",updatedPoints);

		var mXY = maxPoint.split(",");

		if($("#123").length == 0){
			element.append($(`<div id="123">Max Point is ${mXY}</div>`))
		} else {
			$("#123").text(`Max Point is ${mXY}`);
		}
		

		element.css({width:mXY[0],height:mXY[1]});

		*/
		element.css({transform:`scale(${ui.value})`})
	//	log.debug(`Resize values are ${updatedPoints} and mXY is ${mXY}`)
	
}

/* Method to insert node before previous node in list */
function r_InsertBefore(evt){

	 var me = $(evt.target);

	 me.insertBefore(me.prev(".dropped-object"));

}

/* Method to insert node after previous node in list */
function r_InsertAfter(evt){

	 var me = $(evt.target);

	 me.insertAfter(me.next(".dropped-object"));

}

function r_doFontAwesome(e){

		
		e.stopPropagation();
		
    	textDetail = $(e.target);

    	textDetail.css({width:"unset",height:"unset","caret-color":"unset"});
	
    	DRAW_SPACE_advancedShowing = false;
		SAVE_okToSave = true;
        
        textDetail.html($(e.target).html().replace(/(?<!\<i class="fa\s|\<div class="fa\s)((fa-\w+)(?:(?:-\w+)+)?)/gim,`<i class="fa $1"></i>`))
        textDetail.attr("contenteditable","false");
        if(textDetail.text().length == 0 && textDetail.children(".fa").length == 0){
        	textDetail.text("Enter Text")
        }

        textDetail.parent().css({position:"relative"})

        CUSTOM_PXTO_VIEWPORT($(e.target).parent())

        $(e.target).attr("noclick","true");
}

function r_makeLayerTextInputField(e){

	DRAW_SPACE_advancedShowing = true;
	SAVE_okToSave = false;

	$(e.target).one("change",(inp)=>{

			$(`#${$(inp.target).attr("text-for")}`).attr("alias",$(inp.target).val().toUpperCase());
			
			$(inp.target).val($(inp.target).val().toUpperCase())

			$(document).unbind("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)

	}).one("mouseleave",function(){
		DRAW_SPACE_advancedShowing = false;
		SAVE_okToSave = true;
		$(".form-control").focus();
	}).one("change",(e)=>{
		$( ".search-layers" ).catcomplete({
      
      		source:fit()
      
  		});
	})

	$(e.target).focus();

					
				
}


function r_makeEditable(e){ 
		   	
		   	var me = $(e.target);

		   	//I am setting a timeout to give time for us to recognize that
		   	//an drag event is really happening instead of a click event
	    	setTimeout(function(){


	    		if(me.parent().attr("noclick")){
	    			console.log(`User is really dragging...ignore one time`)
	    			me.parent().removeAttr("noclick");
	    			return;
	    		}

		    	DRAW_SPACE_advancedShowing = true;
				SAVE_okToSave = false;
				me[0].style.caretColor=$(this).parent().css("color");

				//Set width to max so user does not accidentally leave area before done typing
				me.css({width:"100%"});
				//Click Note
				var lock = me.parent().find("[lock]");

				var locked = lock.is(".fa-lock");
				
				if(locked){
					lock.click();
				}


		        //log.debug(`HTML IS ${$(this).html().replace(/<\i class="fa\s+(fa-\w+(?:-\w+)*?)"\>\<\/i\>/gim,"$1")}`);
		        me.html(  me.html().replace(/<\i class="fa\s+(fa-\w+(?:-\w+)*?)"\>\<\/i\>/gim,"$1")   );
		        me.attr("contenteditable","true").focus();
		        //CUSTOMEVENTS_placeCaretAtEnd(e.target);
				var cell = me[0];
				// select all text in contenteditable
				// see http://stackoverflow.com/a/6150060/145346
				var range, selection;
				if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(cell);
				range.select();
				} else if (window.getSelection) {
				selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(cell);
				selection.removeAllRanges();
				selection.addRange(range);
				}

				me.one("mouseleave",r_doFontAwesome)

	    	},100)
	       
	        
}

function transformers(evt){

	targ = $(evt.target);

	targ.css({transform:"scale(1.2)"});
}

function popupFileChooser(){
	window.myim = CUSTOM_currentlyMousingOverElementId;
}

//Show or Hide The Floating Menu
function showHideMenu(evt){

	log.debug(`Hiding/Showing the Menu`)
	 
	 //$("#layer-menu").toggleClass("layer-hide").css({"z-index":8000,right:"0"});


 	var theHeight = 0;

		
	if( $("#content").attr("expanded") == "true"){
		theHeight = 50;
		//We closed.  Put everything back
		console.log(`Error Expanded is NOT ${$("#content").attr("expanded")} and we are growing now`);

		shrinkOrGrowParent($("#content"),false);
		$("#content").attr("expanded",false);
			$("#layer-menu").fadeOut();
	} else {
		theHeight = "100%";
		//$("#content").css("left","6rem").css({transform:"scale(.70)"}).css("transform-origin","middle")
		var element = document.getElementById("content");
		//element.scrollIntoView({behavior: "smooth"})
		console.log(`Error xpanded is ${$("#content").attr("expanded")} and we are shrinking now`)
		shrinkOrGrowParent($("#content"),true);
		$("#layer-menu").fadeIn();
		$("#content").attr("expanded",true).css("top","6em");;

	}


	$("#layer-menu").animate({height:theHeight},300,"swing",function(){

		//$("#layer-menu").css({opacity:1})
			
		if($(".close-window").hasClass("fa-minus")){
			$(".close-window").removeClass("fa-minus").addClass("fa-plus");
			//$("#layer-menu").fadeOut();
		} else {
			$(".close-window").removeClass("fa-plus").addClass("fa-minus");
			
		}
	})

	console.log(`Expanded is did we get here`)


	/*

	$("#header").off().on("click",function(evt){
		var lId = $(this).find(".mini-preview").children("cleaned").first().attr("id")
		
		$("#editSpace").hide();
		$("#header").hide();
		$("#maincontent").css("overflow-y","auto")

	})*/



}

//Make big Horizontal view of all the sections
function explore(evt){
	var total = 0;
    $("#content > .section").each(function(index){
		total += $(this).outerWidth();
	})
	$("body,#content").css({width:total+20});



	CUSTOM_pressEscapeKey(); closeMenu(); PREVIEW_togglePreview(editing);
}


function isEditing(){

	return $("body").hasClass("editing") > 0 ? true : false;
}


function navPreview(){

		console.log(`Error Called Nav Preview`)

		console.log(`Error Calling editing is ${editing} ${window.editing}`)

		NOTES_delete();

		OVERLAY_deleteInstructions();

		var over = $("#bigDipper").length > 0 ? $("#bigDipper") : $("<div></div>",{id:"bigDipper"});
		
		$("body").append(over);

		
		//$("#content").css({filter:"blur(20px)"})

		//$(document).trigger("keydown",[{which:27}]);

		
		//over.css({width:screen.width,height:screen.height,position:"absolute",top:0,left:0,"background-color":"red","z-index":10000000})

		
		over.fadeIn(300,function(){

			//CUSTOM_pressEscapeKey(); 

			closeMenu(); 


			if(isEditing()) {

				/* Show Preview since user is leaving Editng Screen */
				PREVIEW_togglePreview(true);	
			
			} else {
				/** Show edit View since user is leaving preview Screen */
				PREVIEW_togglePreview(false);	
			}
			

		})

	
}


function magic(evt){
	log.debug(`I did magic ${evt.target.id}`)
}


/***********************************  Your Code Above This Line ***************/
const regex = /on(\w+)\s+\{([^}]+)\s*}/gm;


function javaOnePlace(){

	log.debug = console.log;

	log.debug(`Loading Ready.js ${ready}`);

	while ((m = regex.exec(ready)) !== null) {
	    // This is necessary to avoid infinite loops with zero-width matches
	    if (m.index === regex.lastIndex) {
	        regex.lastIndex++;
	    }
	    // The result can be accessed through the `m`-variable.
	    m.forEach((match, groupIndex) => {
	        log.debug(`Found match, group ${groupIndex}: ${match}`);

	        //group 1 is event
	        //group 2 key and values
	        
	        if(groupIndex == 0 && m[2]){
	        	log.debug(`onePlace => document.unbind("${m[1]}").on("${m[1]}",${m[2]})`)
	        	var lines = m[2].split("\n");
	        	lines.forEach((line)=>{
	        		if(line.trim().length > 0){	        			
		        		var keyVal = line.split(":");
		        		if(keyVal.length == 2){
			        		var key = keyVal[0].trim();
			        		var val = keyVal[1].trim().replace(/;/,"");
			        		log.debug(`Executing $("${key}").unbind("${val}").on("${m[1]}",${val})`);
			        		try {
			        			log.debug(`Binding it`)
			        			if(key == "document" || key == "window"){
			        				$(eval(key)).off(val).on(`${m[1]}`,eval(val))
			        			} else {
			        				$(`${key}`).off(val).on(`${m[1]}`,eval(val))
			        			}
			        			
			        		}catch(ex){
			        			log.debug(`Failure executing Executing $("${key}").unbind("${val}").on("${m[1]}",${val})`)
			        			log.debug(ex);
			        		}
		        		} else {
		        			log.debug(`Skipping line:\n${line}`);
		        		}
	        		}

	        	})
	        	
	        }
	    });
	}

}
 
         

     