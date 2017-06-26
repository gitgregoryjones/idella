	
var numberToSlide = 0;
var howFarLeft = 0;

var numberHidden =0;



function resetForLeft(container){

	list =$(container);
	tail = list.children(".dropped-object").not("[alias^=cntrl]").last();
	head = list.children(".dropped-object").not("[alias^=cntrl]").first();

	
	var canViewAtOneTime = parseInt(list.width() / head.width())
	 numberHidden = list.children(".dropped-object").not("[alias^=cntrl]").length - canViewAtOneTime;
	
	numberToSlide = canViewAtOneTime;
	
}


function resetForRight(container){

	list =$(container);
	tail = list.children(".dropped-object").not("[alias^=cntrl]").last();
	head = list.children(".dropped-object").not("[alias^=cntrl]").first();

	var arr = [];

	list.children(".dropped-object").not("[alias^=cntrl]").each(function(i,c){
		arr[arr.length]=$(c);
	})

	var canViewAtOneTime = parseInt(list.width() / head.width())
	 numberHidden = list.children(".dropped-object").not("[alias^=cntrl]").length - canViewAtOneTime;
	//alert("Not notVisible "+ (list.children(".dropped-object").not("[alias^=cntrl]").length -  canViewAtOneTime))
	//$(tail).insertBefore(head)
	numberToSlide = canViewAtOneTime;
    howFarLeft = 0;

	for(idx=canViewAtOneTime; idx < list.children(".dropped-object").not("[alias^=cntrl]").length; idx++){
		$(list.children(".dropped-object").not("[alias^=cntrl]")[idx]).insertBefore(head)
		howFarLeft += $(list.children(".dropped-object").not("[alias^=cntrl]")[idx]).width();
		
	}

	list.children(".dropped-object").not("[alias^=cntrl]").css({left:howFarLeft/-1 + "px"})
	
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

	list = list.target ? $(list.target).parents("[type=LIST]").first() : $(list);

	var options ={}

	options["transition-duration"] =  $(list.css("transition-duration"));

	speed = getTransitionDuration(list)

	console.log("Speed is " + speed)

	resetForRight(list);

	list.children(".dropped-object").not("[alias^=cntrl]").animate({left:"+=" + (numberToSlide * list.children(".dropped-object").not("[alias^=cntrl]").first().width())} ,speed)

	.promise()
		.done(
			function(){
				//alert("Called once " + numberToSlide)
				for(i=0;i < (list.children(".dropped-object").not("[alias^=cntrl]").length - (numberToSlide- numberHidden));i++){
					//alert('what')
					//alert("number to Slide is " + numberToSlide + " hola " + list.children(".dropped-object").not("[alias^=cntrl]").first().attr("id") + " after " + list.children(".dropped-object").not("[alias^=cntrl]").last().attr("id"))
					list.children(".dropped-object").not("[alias^=cntrl]").first().insertAfter(list.children(".dropped-object").not("[alias^=cntrl]").last())
				}
				list.children(".dropped-object").not("[alias^=cntrl]").css({left:0})
			}
		)

}

var unPackListHack = function(event){

	list = $(event.target);

	goLeft(list);
}

function SLIDER_init(list){

	if(list.find("[alias^=cntrl]").length == 0){
		list.on("click",unPackListHack);
	} else {
		list.find("[alias^=cntrl]").each(function(id,button){
			SLIDER_setUpButton(button,list,true);
		})
	}

	list.on("dragstart resizestart",function(){
		$(this).css({"transition-duration":"0s"})
	}).on("dragstop resizestop",function(){
		$(this).css({"transition-duration":"0.6s"})
	})
}

function SLIDER_deInit(list){

	list.off("click",unPackListHack)
	list.children("[alias=cntrl-left]").off('click',goLeft).css("visibility","hidden");
	list.children("[alias=cntrl-right]").off('click',goRight).css("visibility","hidden");


}

function SLIDER_setUpButton(button,list,blockClick){
	//dontClick is true if we are just reloading page

	list = $(list);

	button = $(button);

	
	list.append(button);

	if(button.attr("alias").indexOf("left") > -1){

		//alert("In here " + button.attr("id") + " list is " + list.attr("id"))
		button.css({top:0,left:0,"z-index":800})
		button.off("click",goLeft);
		button.on("click",goLeft);
		if(!blockClick){
			button.click();
		} 
		//goLeft(list);
	} else {

		button.css({top:0,left:list.width()-button.width(),"z-index":800})
		button.off("click",goRight);
		button.on("click",goRight);
		if(!blockClick){
			button.click();
		}
	}

	list.off("click",unPackListHack);

	list.on("resizestop",function(){

		$(this).children("[alias=cntrl-left]").css({top:0,left:0,"z-index":800,"visibility":"visible"});
		$(this).children("[alias=cntrl-right]").css({top:0,left:list.width()-button.width(),"z-index":800,"visibility":"visible"})
	})

}

/*Go right*/
function goLeft(list){

	//In case, this was a onClick event on List
	list = list.target ? $(list.target).parents("[type=LIST]").first() : $(list);

	var options ={}

	options["transition-duration"] =  $(list.css("transition-duration"));

	speed = getTransitionDuration(list)

	console.log("Speed is " + speed)

	resetForLeft(list);

	head = $(list.children(".dropped-object").not("[alias^=cntrl]").first())

	list.children(".dropped-object").not("[alias^=cntrl]").animate({left:head.width()*numberToSlide/-1 + "px"},speed)

	.promise()
		.done(
			function(){
				log.debug("Called once")
				for(i=0;i < numberToSlide;i++){
					//alert("number to Slide is " + numberToSlide + " hola " + list.children(".dropped-object").not("[alias^=cntrl]").first().attr("id") + " after " + list.children(".dropped-object").not("[alias^=cntrl]").last().attr("id"))
					list.children(".dropped-object").not("[alias^=cntrl]").first().insertAfter(list.children(".dropped-object").not("[alias^=cntrl]").last())
				}
				list.children(".dropped-object").not("[alias^=cntrl]").css({left:0})
			}
		)

}
