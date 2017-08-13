//.*(BEGIN\sELEM_1482071966106)(.+)(END\sELEM_1482071966106).*

function saveJs(theElem, script){


	id = $(theElem).attr("id")

	re = new RegExp('<!-- BEGIN\\s'+id+'\\s//-->([\\s\\S]+)<!-- END\\s'+id+'//-->','img')

	
	console.log("Entering save JS with id " + id)


	theFunction = "<!-- BEGIN " + id + " //-->\n\n!editing&&$(document).ready(\n\tfunction(){\n" + script.trim() + "\n})<!-- END "+ id + "//-->";

	//eval(theFunction)

	//test to see if style is not found, add it.  If found, replace it
	if($("script.default").html().match(re) == null){
		console.log("Did not find match ")
		$("script.default").append(theFunction);
	}else {
		$("script.default").html($("script.default").html().replace(re,theFunction))
	}

	//localStorage.setItem("javaScript_"+id,script)

	log.debug("SAVJS.js: Leaving save JS with id " + id)

}

function getJs(theElem){

	id = $(theElem).attr("id")

	re = new RegExp('<!-- BEGIN\\s'+id+'\\s//-->([\\s\\S]+)<!-- END\\s'+id+'//-->','img')

	script = $("script.default").html();

	groups = re.exec($("script.default").html())

	log.debug("SAVJS.js: After applying regex " + re + " groups is " + groups);

	if(groups != null){

		content = groups[1].trim().replace("!editing&&$(document).ready(\n\tfunction(){\n","");
		lastBrace = content.lastIndexOf("})");

		content = content.substring(0,lastBrace);

		log.debug("SAVJS.js: Really Returning " + content)

		return content;

	} else {
		//try to read from localStorage		
		return localStorage.getItem("javaScript_"+id);
		
	}

}

function loadAllJs(){

	$(".dropped-object,.plugin").each(function(index,elem){

		thejs = getJs(elem);
		log.debug("SAVJS.js: The JS is " + thejs)
		if(thejs != null && thejs.length > 0){
			eval(thejs)
			saveJs(elem,thejs);
		}
	})

}