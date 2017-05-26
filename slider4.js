
var numberToSlide = 0;
var howFarLeft = 0;

var numberHidden =0;

function resetForLeft(container){

	list =$(container);
	tail = list.children(".dropped-object").last();
	head = list.children(".dropped-object").first();

	
	var canViewAtOneTime = parseInt(list.width() / head.width())
	 numberHidden = list.children(".dropped-object").length - canViewAtOneTime;
	
	numberToSlide = canViewAtOneTime;
	
}


function resetForRight(container){

	list =$(container);
	tail = list.children(".dropped-object").last();
	head = list.children(".dropped-object").first();

	var arr = [];

	list.children(".dropped-object").each(function(i,c){
		arr[arr.length]=$(c);
	})

	var canViewAtOneTime = parseInt(list.width() / head.width())
	 numberHidden = list.children(".dropped-object").length - canViewAtOneTime;
	//alert("Not notVisible "+ (list.children(".dropped-object").length -  canViewAtOneTime))
	//$(tail).insertBefore(head)
	numberToSlide = canViewAtOneTime;
    howFarLeft = 0;

	for(idx=canViewAtOneTime; idx < list.children(".dropped-object").length; idx++){
		$(list.children(".dropped-object")[idx]).insertBefore(head)
		howFarLeft += $(list.children(".dropped-object")[idx]).width();
		
	}

	list.children(".dropped-object").css({left:howFarLeft/-1 + "px"})
	
}



/*Go right*/
function goRight(list){

	var options ={}

	options["transition-duration"] =  ".6s";

	resetForRight(list);

	list.children(".dropped-object").animate({left:"+=" + (numberToSlide * list.children(".dropped-object").first().width()) ,duration:"slow"})

	.promise()
		.done(
			function(){
				//alert("Called once " + numberToSlide)
				for(i=0;i < (list.children(".dropped-object").length - (numberToSlide- numberHidden));i++){
					//alert('what')
					//alert("number to Slide is " + numberToSlide + " hola " + list.children(".dropped-object").first().attr("id") + " after " + list.children(".dropped-object").last().attr("id"))
					list.children(".dropped-object").first().insertAfter(list.children(".dropped-object").last())
				}
				list.children(".dropped-object").css({left:0})
			}
		)

}

/*Go right*/
function goLeft(list){

	var options ={}

	options["transition-duration"] =  ".6s";

	resetForLeft(list);

	head = $(list.children(".dropped-object").first())

	list.children(".dropped-object").animate({left:head.width()*numberToSlide/-1 + "px",duration:"slow"})

	.promise()
		.done(
			function(){
				log.debug("Called once")
				for(i=0;i < numberToSlide;i++){
					//alert("number to Slide is " + numberToSlide + " hola " + list.children(".dropped-object").first().attr("id") + " after " + list.children(".dropped-object").last().attr("id"))
					list.children(".dropped-object").first().insertAfter(list.children(".dropped-object").last())
				}
				list.children(".dropped-object").css({left:0})
			}
		)

}
