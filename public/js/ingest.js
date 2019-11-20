
function INGEST_populateList(child,list,idx){

	var template = list.length > 0 ? $(list.children("[type]").not("[alias^=cntrl]").first()).clone() : whichTool("IMG");

	template.attr("extends",list.children("[type]").first().attr("id"))

	template.attr("id",list.attr("id") + "-" + idx);


	INGEST_populateObject(child,template);

	list.append(template);
	//INGEST_populateObject()

}

/**
*	Takes a valid JSON/javascript and writes to object.  If object is a list or has children that are a list, it will write to the children by calling
*   INGEST_popluateList(child,list,idx)
*
*	 param	content: "valid json object", 
*    param	object:   jQuery reference to object where content will be copied, 
*/
function INGEST_populateObject(content, object){

	object = $(object);
	
	if($(object).length == 0){

		console.log("Skipping this alias " + $(object).attr("alias") + " because Element not found on page");

	} else {
		//Do simple copy
		for(key in content){

			if(Array.isArray(content[key])){

				console.log("FOUND ARRAY FOR " + key)

				if( object.attr("type") == "LIST"){

					children = content[key];
					var before = object.children("[type]").not("[alias^=cntrl]").length;
					console.log("BEFORE IS " + before)
					for(childIdx in children){
						child = children[childIdx];
						//Populate Gallery
						INGEST_populateList(child,object,childIdx);
					}

					var after = object.children("[type]").not("[alias^=cntrl]").length;
					console.log("AFTER IS " + after)

					for(i=0;i<before;i++){
						c =object.children("[type]").not("[alias^=cntrl]").first();
						c = $(c);
						c.remove();
					}

				} else {
					//populate list of simple objects
					var lookupKey = key.toUpperCase();
					if(lookupKey.endsWith("S")){
						lookupKey = lookupKey.substring(0,lookupKey.indexOf("S"));
						console.log("Lookup KEY is " + lookupKey)

						var cList = object.find("[type="+lookupKey+"]")

						console.log("[type="+lookupKey + "]  length is " + cList.length) 

						console.log("lookupKey is " + lookupKey + " and content[key] is " + JSON.stringify(content[key]))

						var i = 0;

						var theList = content[key];

						cList.each(function(idx,pageObject){
							pageObject = $(pageObject);
							var theContent = theList.pop()
							console.log("page Object was " + pageObject.length + " id " + pageObject.attr("id")) 
							console.log("The content is " + theContent);
							INGEST_populateObject(theContent,pageObject);
							++i;

						})
					}
					

				}

			} else {

				if(CSSTEXT_validStyles.hasOwnProperty(key)){
					console.log("SETTING ANOTHER KEY AS CSS "+ key + " with value " + content[key]);
					object.css(key,content[key])
				} else if(key.toLowerCase() != "id" && key.toLowerCase() !="alias"  && key.toLowerCase() != "type"){
					console.log("SETTING ANOTHER KEY AS attribute "+ key + " with value " + content[key]);
					if(key == "href") {
						$(object).children("[type=anchor]").attr('href',content[key]);
					}

					if(key == "text"){
						object.text("text",content[key]);
						object.attr("edittxt",content[key])

					}
					object.attr(key,content[key])
				}
			}



		}

		return;
	}
}
	

