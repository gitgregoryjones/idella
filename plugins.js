var rawHTML = "";
var resizedPlugin = false;


function PLUGINS_getPluginList(){

	var fileStr = "JW Player,fa-film,video\nSearch Field,fa-search,input\nText Field,fa-square-o,textfield"
		+ "\nDialog,fa-window,dialog\nAlt Video,fa-film,altvideo\nTextfield,fa-window,textarea\n";

	lines = fileStr.split("\n");

	pList = []

	for(line in lines){
		plugin = {};
		records = lines[line].split(",")
		if(records.length == 3){
			
				plugin.alias = records[0];
				plugin.icon = records[1];
				plugin.file = records[2];

				pList[pList.length] = plugin;
			
		} else {
			log.error("This line is improperly formatted. Expected a line with values separated by 2 commas.  Received this: ")
			log.error(line);
		}

	}

	return pList;

}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}


function PLUGINS_getPlugin(parent,pluginName){

	var def = [];
	var res = "";
	var js = "";


	parent = $(parent);

	tempDiv = $("<div>");

	var dir = pluginName.substring(0,pluginName.indexOf("-"));
	var plugin = pluginName.substring(pluginName.indexOf("-")+1).trim();

	var responses = [];

	var fileExtensions = {}
	fileExtensions[".html"] = {wrapper:null};
	fileExtensions[".css"] = {wrapper:"<style>"};
	fileExtensions[".js"] = {wrapper:"<script>"};

	var validFilesExtensions = [];

	for(idx in fileExtensions){

		if(UrlExists(dir + "/" + plugin+ idx)){
    			fileExtensions[idx].available = true;
    			
    			
		} else {
			console.log("ignoring file " + dir + "/" + plugin + idx + " because user did not create");
		}
	}


	//redundant because of WHEN and failure weird logic for jQuery 1.12+.  One day i can put this in a loop
	//and FileExtensions will have value when method returns.
	//Promise?
	
	if(fileExtensions[".html"].available){
		def.push($.get(dir + "/" + plugin+ ".html", function(response) {
					res += response;
	    			
			}, 'text').fail(function(){console.log('error retrieving .html for '+ dir + "/" + plugin)}));
	}

	if(fileExtensions[".css"].available){
		def.push($.get(dir + "/" + plugin+ ".css", function(response) {
					res += "<style>" + response + "</style>";
	    			
			}, 'text').fail(function(){console.log('error retrieving .css for '+ dir + "/" + plugin)}));
	}

	if(fileExtensions[".js"].available){
		def.push($.get(dir + "/" + plugin+ ".js", function(response) {
					js += "<script>" + response + "</script>";
	    			
			}, 'text').fail(function(){console.log('error retrieving .js for '+ dir + "/" + plugin)}));
	}
	

	
	var idsToReplace = {};



	$.when.apply($, def).done(function() {

		parent.find("._container").remove();

    	container = $("<div>").css({width:"100%",height:"100%"}).addClass("_container").append(res)

    	console.log(fileExtensions)

    	parent.append(container);

    	ids = {};

    	//load id array
    	parent.find("[id]").each(function(idx,child){
    		child = $(child);

    		newId = "ELEM_" + new Date().getTime() + idx;

    		id[child.attr('id')] = newId;

    		pattern = "\"" + child.attr("id") + "\"|'" + child.attr('id') + "'";

    		js = js.replace(new RegExp(pattern,"g"),"\""+newId+"\"")

    		pattern = "\"#"+child.attr("id") + "\"";

    		//Do # syntax
    		js = js.replace(new RegExp(pattern,"g"),"\"#"+newId+"\"")

    		var theClassObject = CONVERT_STYLE_TO_CLASS_OBJECT(child);

    		theClassObject.cssRule = theClassObject.cssRule.replace("."+child.attr("id"),"."+newId);
    		
    		child.attr("id",newId).addClass(newId)
    		
    		
    		if(idx > 0 && child.attr("noresize") == null){
    			//Now overwrite id just before save to CSS file
    			child.addClass("dropped-object")
    			setUpDiv(child);
    		}


    		CSS_TEXT_saveCss(child, theClassObject)


    	})

    

    	parent.find("style").remove();

		//Do Special RESIZE LOGIC;
		parent.on("resizestart",function(){
			if(!$("#group-resize").is(":checked")){
				$("#group-resize").click();
				resizedPlugin = true;
			}
		}).on("resizestop",function(){
			//uncheck group resize if plugin checked it without user input
			if(resizedPlugin){
				$("#group-resize").click();
			}
		})

		$("._container").append(js)
/*
		setTimeout(function(){
			parent.append(js);
		},1000)*/
		
		//never gets in here.  Asynch blah blah
	
	});

}