
var numberToSlide = 0;
var howFarLeft = 0;

var numberHidden =0;

SLIDERS = {};


function resetForLeft(container){

	list =$(container);
	

	for(idx=0; idx < list.children(".dropped-object").not("[alias^=cntrl]").length; idx++){

		tail = list.children(".dropped-object").not("[alias^=cntrl]").last();
		head = list.children(`.dropped-object`).not("[alias^=cntrl]").first();

		if(head.position().left + head.outerWidth(true) < list.position().left){
	
			head.css({left:tail.position().left + tail.outerWidth(true)});

			list.append(head);
						
		}
		
	}

	var canViewAtOneTime = parseInt(list.width() / head.width())
	 numberHidden = list.children(".dropped-object").not("[alias^=cntrl]").length - canViewAtOneTime;

	numberToSlide = canViewAtOneTime;	
}


function resetForRight(container){

	list =$(container);

	for(idx=0; idx < list.children(".dropped-object").not("[alias^=cntrl]").length; idx++){

		tail = list.children(".dropped-object").not("[alias^=cntrl]").last();
		head = list.children(".dropped-object").not("[alias^=cntrl]").first();

		if(tail.position().left > list.position().left + list.outerWidth(true)){
	
			tail.css({left:head.position().left - tail.outerWidth(true)});

			list.prepend(tail);			

		}
		
	}

	var canViewAtOneTime = parseInt(list.width() / head.width())
	 numberHidden = list.children(".dropped-object").not("[alias^=cntrl]").length - canViewAtOneTime;
	//alert("Not notVisible "+ (list.children(".dropped-object").not("[alias^=cntrl]").length -  canViewAtOneTime))
	//$(tail).insertBefore(head)
	numberToSlide = canViewAtOneTime;
    howFarLeft = 0;
}


function getTransitionDuration( element, with_delay )
{
	var el       = $( element );
	var prefixes = 'moz webkit ms o khtml'.split( ' ' );
	var result   = 0;

	for ( var i = 0; i < prefixes.length; i++ )
	{
		var duration = el.css( '-' + prefixes[i] + '-transition-duration' );

		if ( duration )
		{
			duration = ( duration.indexOf( 'ms' ) >- 1 ) ? parseFloat( duration ) : parseFloat( duration ) * 1000;

			if ( with_delay )
			{
				var delay = el.css( '-' + prefixes[i] + '-transition-delay' );
				duration += ( delay.indexOf( 'ms' ) >- 1 ) ? parseFloat( delay ) : parseFloat( delay ) * 1000;
			}

			result = duration;

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


	if(SLIDER_isPaused(list)){
		console.log(`User Hovering over list`);
		return;
	}

	list = list.target ? $(list.target).parents("[type=LIST]").first() : $(list);

	var options ={}

	options["transition-duration"] =  $(list.css("transition-duration"));

	speed = getTransitionDuration(list)

	log.debug("SLIDER4.js:Speed is " + speed)

	resetForRight(list);

	list.children(".dropped-object").not("[alias^=cntrl]").each(function(it){$(this).animate({left:$(this).position().left  + $(this).outerWidth(true) * numberToSlide },speed)})


}

var unPackListHack = function(event){

	list = $(event.target);

	goLeft(list);
}

function SLIDER_pause(list){

    if(list == undefined || SLIDERS[list.attr("id")] == undefined){
    	return;
    }


    console.log(`LIST ID IS ${list.attr("id")}`);

	SLIDERS[list.attr("id")].paused = true;

}

function SLIDER_play(list){

	if(list == undefined || SLIDERS[list.attr("id")] == undefined){
    	return;
    }

    console.log(`LIST ID IS ${list.attr("id")}`);
    
	SLIDERS[list.attr("id")].paused = false;

}

function SLIDER_isPaused(list){

	if(list == undefined || SLIDERS[list.attr("id")] == undefined){
    
    	return false;
    }

	return SLIDERS[list.attr("id")].paused;
}

function SLIDER_init(list){

	console.log(`Initializing slider for ${list.attr('id')}`)

	var {handle} = undefined&SLIDERS[list.attr("id")];

	if(handle != undefined){

		SLIDER_deInit(list);
	}

	console.log(`Made it this far before ${handle}`)

	handle = setInterval(()=>{goLeft(list)},2000);

	console.log(`Made it this far dude after ${handle}`)

	SLIDERS[list.attr("id")] = {handle:handle,paused:false};

	duration = (list.css("transition-duration"))

    duration = parseFloat(duration) == 0 ? "0.6s" : duration;

    list.css({overflow:"hidden","transition-duration":duration})

    list.css("white-space","nowrap");

	if(list.find("[alias^=cntrl]").length == 0){
		list.on("click",unPackListHack);
	} else {
		list.find("[alias^=cntrl]").each(function(id,button){
			SLIDER_setUpButton(button,list,true);
		})
	}

	list.on("dragstart resizestart",function(){
		$(this).css({"transition-duration":"0s"})
		SLIDER_pause($(this));
	}).on("dragstop resizestop",function(){
		$(this).css({"transition-duration":"0.6s"})
		SLIDER_play($(this));

	})

	list.children(".dropped-object").not("[alias^=cntrl]").hover((e)=>{SLIDER_pause($(e.target).parent("[type=LIST]"));},(e)=>{SLIDER_play($(e.target).parent("[type=LIST]"));})

	list.children(".dropped-object").not("[alias^=cntrl]").each(function(it){$(this).css({position:"absolute",left:it*$(this).outerWidth(true)})})
}

function SLIDER_deInit(list){

	var {handle} = SLIDERS[list.attr("id")];



	window.clearInterval(handle);

	list.css("white-space","normal");
	list.css({overflow:"auto","transition-duration":"0s"})

	list.off("click",unPackListHack)
	list.children("[alias=cntrl-left]").off('click',goLeft).css("visibility","hidden");
	list.children("[alias=cntrl-right]").off('click',goRight).css("visibility","hidden");

	list.children(".dropped-object").not("[alias^=cntrl]").css({left:0,position:"relative"});


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
		button.off("click",goRight);
		button.on("click",goRight);
		if(!blockClick){
			button.click();
		}
	}

	list.off("click",unPackListHack);

	list.on("resizestop",function(){

		$(this).children("[alias=cntrl-left]").css({height:list.children(".dropped-object").first().outerHeight(),top:0,left:0,"z-index":800,"visibility":"visible"});
		$(this).children("[alias=cntrl-right]").css({height:list.children(".dropped-object").first().outerHeight(),top:0,left:list.width()-button.width(),"z-index":800,"visibility":"visible"})
	})

}

/*Go right*/
function goLeft(list){

	//if we got here via button push
	if(list.target != undefined){
		list = $(list.target);
	}

	

	if(SLIDER_isPaused(list)){
		console.log(`User Hovering over list`);
		return;
	}

	//In case, this was a onClick event on List
	list = list.target ? $(list.target).parents("[type=LIST]").first() : $(list);

	var options ={}

	options["transition-duration"] =  $(list.css("transition-duration"));

	speed = getTransitionDuration(list)

	log.debug("SLIDER4.js:Speed is " + speed)

	resetForLeft(list);

	list.children(".dropped-object").not("[alias^=cntrl]").each(function(it){$(this).animate({left:$(this).position().left  - $(this).outerWidth(true) * numberToSlide },speed)})
}
