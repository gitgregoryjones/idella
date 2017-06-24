//Load 

$(document).on("translateTxt",function(event,txtElem){
	log.warn("Caught translate txt event for " + txtElem.text())


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
			log.warn("No server content found for txt  " + txtElem.text())
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

	log.warn("I am Retrieving content for [" + txtElem.text().toLowerCase() + "]");

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

	setCookies("php-simple-proxy.php?send_session=1&full_headers=1&send_cookies=1&url=https://www.bing.com/translator",function(data){
		console.log("Next Step")
		$.ajax({url:"php-simple-proxy.php?send_session-1&full_headers=1&send_cookies=1&url=https://www.bing.com/translator/api/Translate/TranslateArray?coat=blue&from=-&to=es",
			method:"POST",
			data:JSON.stringify([{"id":99162322,"text":"hello"}]),
			xhrFields: { withCredentials: true },
			error:function(err,txt,code){console.log(code)},
			success:function(data){console.log("done")}
		})
	})


	//var escapeTxt = escape(txtElem.text());

	//console.log(escapeTxt)
/*
	setCookies(proxy + "?url="+cookieUrl,function(){
		$.ajax({
			method: "POST",
			 xhrFields: { withCredentials: true },
		    beforeSend: function(request) {
		        //request.setRequestHeader("Referer","https://translate.google.com/");
		        //request.setRequestHeader("Origin","https://translate.google.com/");
				//request.setRequestHeader("x-requested-with"," https://translate.google.com/")
				request.setRequestHeader("Host","https://www.bing.com")

		     //   request.setRequestHeader("User-Agent","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.101 Safari/537.36")
		    },
		    contentType:"application/json",
		    data:JSON.stringify([{"id":99162322,"text":"hello"}]),
		    //dataType: "json",
		    //url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20'https%3A%2F%2Ftranslate.google.com%2Ftranslate_a%2Ft%3Fclient%3Dt%26sl%3Den%26tl%3Des%26hl%3Den%26v%3D1.0%26source%3Dis%26tk%3D430644.56844%26q%3Dwatch%2520trailer'&format=json&diagnostics=true&callback=?",
		    //url: "https://query.yahooapis.com/v1/public/yql?q="+escape(query)+"'"+escape(url) + "'&format=json&diagnostics=true&callback=?",

		    url: proxy + "?url="+url,
		   // url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20'https%3A%2F%2Ftranslate.google.com%2Ftranslate_a%2Ft%3Fclient%3Dt%26sl%3Den%26tl%3Des%26hl%3Den%26v%3D1.0%26source%3Dis%26tk%3D430644.56844%26q%3D"+escapeTxt + "'&format=json&diagnostics=true&callback=?",
		    success: function(data) {
		    	//console.log("Called URl " + url)
		    	console.log(data)
		        callback(data.items[0].text)
		    },
		    fail: function(e){
		    	log.error("Encountered error calling translate service");
				log.error(e)
		    	callback(null)
		    }
		});
	})*/

}



