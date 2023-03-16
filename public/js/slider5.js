
var numberToSlide = 0;
var howFarLeft = 0;

var numberHidden =0;

SLIDERS = {};




var tail = [];

function findTail(list){

	if(tail.length > 0){
		console.log(` Tail short circut is ${tail[0].id}`)
		return tail[0];
	}

	var max = {id:0};

	list.children('.dropped-object').not("[alias^=CNTRL]").each(function(){

		console.log(`Comparing ${this.id} to ${max.id}`)

		if(max.offsetLeft && max.offsetLeft > this.offsetLeft){
			
		} else {

			max = this;
		}

	})

	console.log(`Returning is ${max.id}`)
	 return max
}


function resetForLeft(container){

	list =$(container);
	
	//duration = list.attr("transition-duration");

	//log.debug(`Read transition-duration from attribute ${duration}`)

	var needReset = [];

	//Get Items that have rolled past the left edge
	list.children('.dropped-object').each(function(){

		if($(this).position().left <=  -$(this).outerWidth()){
			//stopTrain(list);
			needReset.push(this);
			 //start train

		}

	})

	

	console.log(`Need to move  ${needReset.length}`)
	needReset.forEach(function(element,idx){

		tail = findTail(list);

		console.log(`Tail is ${tail.id}`)

		if(tail.id){
			tail = $(tail);
		  console.log(`Time to move element ${element.id} to offsetLeft of ${tail[0].id} with offset Left of ${tail.offset().left}`)
		  $(element).css({left:tail[0].offsetLeft + $(element).outerWidth()})

		  tail = element;
		}

	})

	
	//sort by position number asc
	var inAscOrder = list.children('.dropped-object').toArray().sort(function(first,second){
		if(first.offsetLeft < second.offsetLeft){
			return -1;
		} 
		if( first.offsetLeft > second.offsetLeft){
			return 1;
		}

		return 0;
	})

	for(elem in inAscOrder){

		//$(inAscOrder[elem]).css({left:elem * $(inAscOrder[elem]).outerWidth()})
	}

	

	
}


function resetForRight(container){

	list =$(container);

	for(idx=0; idx < list.children(".dropped-object").not("[alias^=CNTRL]").length; idx++){

		tail = list.children(".dropped-object").not("[alias^=CNTRL]").last();
		head = list.children(".dropped-object").not("[alias^=CNTRL]").first();

		if(tail.position().left > list.position().left + list.outerWidth(true)){
	
			tail.css({left:head.position().left - tail.outerWidth(true)});

			list.prepend(tail);			

		}
		
	}

	var canViewAtOneTime = parseInt(list.width() / head.width()) >= 1 ? parseInt(list.width() / head.width()) : 1;

	 numberHidden = list.children(".dropped-object").not("[alias^=CNTRL]").length - canViewAtOneTime;
	//alert("Not notVisible "+ (list.children(".dropped-object").not("[alias^=CNTRL]").length -  canViewAtOneTime))
	//$(tail).insertBefore(head)
	numberToSlide = canViewAtOneTime;
    howFarLeft = 0;
}


function getTransitionDuration( element, with_delay )
{
	var el       = $( element );
	var prefixes = '-moz-,-webkit-,-ms-,-o-,-khtml-,'.split( ',' );
	var result   = 0;

	duration = $(el).attr("transition-duration");

	if(duration){
		$(el).css("transition-duration",duration);
	}

	log.debug(`Callxy to transition-duration getTransitionDuration() ${el.css("-webkit-transition-duration")}`)

	for ( var i = 0; i < prefixes.length; i++ )
	{
		log.debug(`Searching transition duration [${prefixes[i]}transition-duration]`)
		var duration = el.css(`${prefixes[i]}transition-duration`);
		log.debug(`Result transition duration [${prefixes[i]}transition-duration] is ${duration}`)
		
		if(parseFloat(duration) == 0){
			duration = "0";
		}

		if ( duration )
		{
			duration = ( duration.indexOf( 'ms' ) >- 1 ) ? parseFloat( duration ) : parseFloat( duration ) * 1000;

			if ( with_delay )
			{
				var delay = el.css( '-' + prefixes[i] + '-transition-delay' );
				duration += ( delay.indexOf( 'ms' ) >- 1 ) ? parseFloat( delay ) : parseFloat( delay ) * 1000;
			}

			//result = `${duration/1000}s`;
			result = duration

			break;
		}
	}



	return result;
}



/*Go right*/
function goRight(list){
	//alert("right here")

		//if we got here via button push
	if(list.target != undefined){
		list = $(list.target);
	}


	if(SLIDER_isPaused(list) ||  SLIDERS[list.attr("id")].playing){
		log.debug(`User Hovering over list or it is playing`);
		return;
	}

	SLIDERS[list.attr("id")].playing = true;


	list = list.target ? $(list.target).parents("[type=LIST]").first() : $(list);


	speed = parseInt(list.attr("slider-speed")) > 0 ? list.attr("slider-speed") : "3000";

	log.debug("SLIDER5.js:Speed is " + speed)

	resetForRight(list);

	list.children(".dropped-object").not("[alias^=CNTRL]").each(function(it){$(this).animate({left:$(this).position().left + $(this).outerWidth(true) * numberToSlide },parseInt(speed),"swing",function(cmp){
		
		 SLIDERS[list.attr("id")].playing = false;
	})})


}

var unPackListHack = function(event){

	list = $(event.target);

	goLeft(list);
}

function SLIDER_pause(list){

    if(list == undefined || SLIDERS[list.attr("id")] == undefined){
    	return;
    }


    log.debug(`LIST ID IS ${list.attr("id")}`);

	SLIDERS[list.attr("id")].paused = true;

}

function SLIDER_play(list){

	if(list == undefined || SLIDERS[list.attr("id")] == undefined){
    	return;
    }

    log.debug(`LIST ID IS ${list.attr("id")}`);
    
	SLIDERS[list.attr("id")].paused = false;

}


function SLIDER_isPaused(list){

	if(list == undefined || SLIDERS[list.attr("id")] == undefined){
    
    	return false;
    }

	return SLIDERS[list.attr("id")].paused;
}

function SLIDER_init(list){

	log.debug(`Initializing slider for ${list.attr('id')}`)

	var {handle} = undefined&SLIDERS[list.attr("id")];

	if(handle != undefined){

		SLIDER_deInit(list);
	}

	log.debug(`Made it this far before ${handle}`)

	var delay = list.attr("slider-delay");

	log.debug(`Delay is ${delay}`)


	//handle = setInterval(()=>{ list.attr("slider-direction") == "right" ? goRight(list): goLeft(list)},delay);

	log.debug(`Made it this far dude after ${handle}`)

	SLIDERS[list.attr("id")] = {handle:handle,paused:false,playing:false};

	//duration = (list.css("transition-duration"))
	

    //duration = parseFloat(duration) == 0 ? "0.6s" : duration;

    list.css({overflow:"hidden"});

    list.css("white-space","nowrap");

	if(list.find("[alias^=CNTRL]").length == 0){
		list.unbind("click",unPackListHack).on("click",unPackListHack);
	} else {
		list.find("[alias^=CNTRL]").each(function(id,button){
			SLIDER_setUpButton(button,list,true);
		})
	}

	list.on("dragstart resizestart",function(){
		
		SLIDER_pause($(this));
	}).on("dragstop resizestop",function(){
		
		SLIDER_play($(this));

	})

	list.children(".dropped-object").not("[alias^=CNTRL]").hover((e)=>{log.debug(`Pausing SLIDER. User Hovering over ${e.target.id}`);SLIDER_pause($(e.target).parent("[type=LIST]"));},(e)=>{SLIDER_play($(e.target).parent("[type=LIST]"));})

	list.children(".dropped-object").not("[alias^=CNTRL]").each(function(it){$(this).css({position:"absolute",left:it*$(this).outerWidth(true)})})


	var canViewAtOneTime = parseInt(list.width() / list.children(".dropped-object").not("[alias^=CNTRL]").first().width()) >= 1 ? parseInt(list.width() / list.children(".dropped-object").not("[alias^=CNTRL]").first().width()) : 1;
	

	numberHidden = list.children(".dropped-object").not("[alias^=CNTRL]").length - canViewAtOneTime;

	numberToSlide = canViewAtOneTime;	

	return list;
}

function SLIDER_deInit(list){

	var {handle} = SLIDERS[list.attr("id")];



	window.clearInterval(handle);



	list.css("white-space","normal");

	list.css({overflow:"auto","transition-duration":"0s"})

	list.children(".dropped-object").not("[alias^=CNTRL]").stop().css({left:0,top:0,position:"relative"});
	list.unbind("dragstart resizestop dragstop resizestart");
	list.unbind("click",unPackListHack)
	list.children("[alias=CNTRL-LEFT]").unbind('click',goLeft).css("visibility","hidden");
	list.children("[alias=CNTRL-RIGHT]").unbind('click',goRight).css("visibility","hidden");





}

function SLIDER_setUpButton(button,list,blockClick){
	//dontClick is true if we are just reloading page

	list = $(list);

	button = $(button);

	button.css("cursor","pointer")

	
	list.append(button);

	if(button.attr("alias").indexOf("left") > -1){

		//alert("In here " + button.attr("id") + " list is " + list.attr("id"))
		button.css({top:0,left:0,"z-index":800,height:list.children(".dropped-object").first().outerHeight()})
		button.unbind("click",goLeft);
		button.on("click",goLeft);
		if(!blockClick){
			button.click();
		} 
		//goLeft(list);
	} else {

		button.css({top:0,left:list.width()-button.width(),"z-index":800,height:list.children(".dropped-object").first().outerHeight()})
		button.unbind("click",goRight);
		button.on("click",goRight);
		if(!blockClick){
			button.click();
		}
	}

	list.unbind("click",unPackListHack);

	list.on("resizestop",function(){

		$(this).children("[alias=CNTRL-LEFT]").css({height:list.children(".dropped-object").first().outerHeight(),top:0,left:0,"z-index":800,"visibility":"visible"});
		$(this).children("[alias=CNTRL-RIGHT]").css({height:list.children(".dropped-object").first().outerHeight(),top:0,left:list.width()-button.width(),"z-index":800,"visibility":"visible"})
	})

}

/*Go right*/
function goLeft(list){

	//if we got here via button push
	if(list.target != undefined){
		list = $(list.target);
	}

	

	list.css({overflow:"hidden"})

	if(SLIDER_isPaused(list) /*||  SLIDERS[list.attr("id")].playing*/){
		log.debug(`User Hovering over list or it is playing`);
		return;
	}

	SLIDERS[list.attr("id")].playing = true;


	//In case, this was a onClick event on List
	list = list.target ? $(list.target).parents("[type=LIST]").first() : $(list);

	//speed = getTransitionDuration(list)
	speed = parseInt(list.attr("slider-speed")) > 0 ? list.attr("slider-speed") : "3000";

	log.debug("SLIDER5.js:Speed is really! " + speed)

	//resetForLeft(list);

	//get the difference

	list.width()  /* sum of the number of elems to slide. that difference if positive should be subtracted. if negative, added */

	var total = 0;
	var viewed = 0;


	var highestNegativePosition = 0;

	list.children(".dropped-object").not("[alias^=CNTRL]").each(function(){

		if($(this).position().left < 0){
				console.log(`Looping ${this.id} with offset ${$(this).offset().left} and position ${$(this).position().left}`)
				if(highestNegativePosition < $(this).position().left){
					highestNegativePosition = $(this).position().left;
				}

				if(highestNegativePosition == 0){
					highestNegativePosition = $(this).position().left;
				}
		}

	})

	//total = list.width() - total;

	total = list.width() - total;



	console.log(`Total is ${total}`)


	//list[0].scrollLeft -= list.children('.dropped-object').not("[alias^=CNTRL]").first().outerWidth();

	list.animate({scrollLeft:`+=${list.width() + highestNegativePosition -20}`},{duration:parseInt(speed),

		progress: ()=>{

			//list.css({overflow:"visible"});

			resetForLeft(list);
			//list.css({overflow:"visible"});
		}
	})

	/*

	list.children(".dropped-object").not("[alias^=CNTRL]").each(function(it){
		$(this).animate(
			{left:$(this).position().left  - $(this).outerWidth(true) * numberToSlide },
			{
				duration:parseInt(speed),
				easing:"swing",
				progress: ()=>{
					//resetForLeft(list);
					
				},
				always: ()=>{
					resetForLeft(list)
					SLIDERS[list.attr("id")].playing = false;	
				}
			}
			
	)})*/
}
