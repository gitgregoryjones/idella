//Add comment
var cheerio = require('cheerio');

var $ = cheerio.load("<html></html>")

var events = [];

function _extend($){

	$.on = function(event,func){

		if($("[alias="+event+"]").length > 0){

			console.log("Register for Event " + event);
			b = {};
			b[event] = func;
			events.push(b);
			++$.numberRegistered;

		} else {
			console.log("Will not register event on " + event + " because Element is not on this page")
		}
	}

	$.clearEvents = function(){
		events = [];
	}

	$.numberRegistered = 0;

	$.trigger = function(event,whichPage,done){
		console.log("Triggered Event "+ event);
		for(i=0; i < events.length; i++){
			if(events[i].hasOwnProperty(event)){
				var backendDataPopulatedByUser = []
				//try {
					//call the on(whatever') method dynamically and pass the 'content' array, $ reference to page, done() callback and eventName
					events[i][event](backendDataPopulatedByUser,$,done,event,whichPage);
				//}catch(e){
					
				//	console.log("Failed to get data for event on("+event+")");
				//	console.log(e)
				//	throw 
				//	done(backendDataPopulatedByUser);
				///}
			}
		}
	}

	return $;
}


 module.exports._extend = _extend;
