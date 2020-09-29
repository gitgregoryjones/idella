//Load 

$(document).on("translateTxt",function(event,txtElem){
	log.debug("Caught translate txt event for " + txtElem.text())


	//////////DISABLED FOR NOW!!!! MAYBE RENABLE WHEN I WANT TO PAY FOR THIS SERVICE
	//return;

	translateTxt(txtElem,function(serverContent){
		if(serverContent){
			//$(list).children("[type]").remove();
			if(serverContent != null){
				txtElem.text(serverContent)
			} else {
				log.warn("No translation found for txt " + txtElem.text())
			}
			
			//recursivePopulate(serverContent, $(list))
		} else {
			log.info("No translation txt found for txt  " + txtElem.text())
		}
	})
})




function setCookies(url,callback){

	$.ajax( {url:url,
     method: 'GET',
     
     success: function(data){
     	console.log("I'm going now ")
     	console.log(callback)
     	callback(data)
     },
     error:function(err,text,code){
     	console.log(code)
     	//console.log(err)
     }
  })
}


/* Get Content from Translation Service */
function translateTxt(txtElem,callback){

	var content = {};

	log.info("I am Retrieving content for [" + txtElem.text().toLowerCase().trim() + "]");

	var proxy = "php-simple-proxy.php";

	var cookieUrl = "https://www.bing.com/translator"
	//var query = "select * from html where url=";

	var url = 'https://www.bing.com/translator/api/Translate/TranslateArray?coat=blue&from=-&to=es';

	/*
	$.ajax({url:"php-simple-proxy.php?url=http://www.bing.com/translator",
			xhrFields: { withCredentials: true },
			error:function(err,txt,code){console.log(code)},
			success:function(data){console.log(data.contents)}
		})*/
	/*
	setCookies("php-simple-proxy.php?send_session=1&full_headers=1&send_cookies=1&url=https://www.bing.com/translator",function(data){
		console.log("Next Step")
		$.ajax({url:"php-simple-proxy.php?send_session-1&full_headers=1&send_cookies=1&url=https://www.bing.com/translator/api/Translate/TranslateArray?coat=blue&from=-&to=es",
			method:"POST",
			data:JSON.stringify([{"id":99162322,"text":"hello"}]),
			xhrFields: { withCredentials: true },
			error:function(err,txt,code){console.log(code)},
			success:function(data){console.log("done")}
		})
	})*/


	callback(null)

}



