var rawHTML = "";



function PLUGINS_getPluginList(){

	var fileStr = "JW Player,fa-film,video\nSearch Field,fa-search,input";

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


function PLUGINS_getPlugin(parent,pluginName){
	parent = $(parent);
	var dir = pluginName.substring(0,pluginName.indexOf("-"));
	var plugin = pluginName.substring(pluginName.indexOf("-")+1).trim();
	
	log.warn("CLooking for file " + dir + "/" + plugin+ ".html")
	var file = dir + "/" + plugin+ ".html";

	var idsToReplace = [];

	$(parent).load(dir + "/" + plugin+ ".html",function(response, status, xhr){
		if(xhr.status != 200){
			console.log("WHAT!!!")
			log.error("Failure loading file " + file);
			log.error("Encountered error : " + xhr.status + " " + xhr.statusText)
		} else {


			console.log("UP IN HERE!")
			//overwrite ids
			rawHTML = response;
			content = $(rawHTML);
			//overwrite ids

			log.warn("What is ");
			log.warn(parent);
			log.warn("Content length is "+content.length)
			log.warn(content)


			content.each(function(idx,node){

				node = $(node);

				var oldId = node.attr("id");

				var newId = "ELEM_" + new Date().getTime()+idx;

				node.attr("id",newId); 

				log.warn("Looking for child node on plugin " + oldId)

				
				var currentObj = parent.find("#"+oldId).first();

				if(currentObj.attr("id")){
					console.log("COB = " + currentObj)
					currentObj.attr("id",newId);
					currentObj.addClass("plugin")
					idsToReplace[oldId] = newId;
					currentObj.attr("resize","true").attr("type",plugin);
					CUSTOM_PXTO_VIEWPORT($(currentObj),$(currentObj).position().left ,$(currentObj).position().top);
				}

			})

			//parent.resizable('destroy').resizable();

			console.log(content)
			//$(parent).children("script").appendTo($("head"))
			//now load JS
	


		
			file = dir + "/" + plugin + ".js";

			setTimeout(function(){

				$.get(file,function(response){
					
							var lastKeyWritten = 0;
							for(key in idsToReplace){
								
								lastKeyWritten = idsToReplace[key];
								console.log("lastKeyWritten = " + key)
								value = idsToReplace[key]
								reg = new RegExp(key,"g")
								//var currentJs = getJs($("#"+key));

								response = response.replace(reg,value)
							}		
						console.log(response)					
						console.log(" lastKeyWritten [" + lastKeyWritten + "] and parent is " + parent.attr("id"))
						if(lastKeyWritten != undefined && lastKeyWritten != "undefined" && lastKeyWritten != 0){
							//eval(script.html())
							for(key in idsToReplace){
								console.log("Writing key " + idsToReplace[key])
								$("#"+idsToReplace[key]).attr("resize","true").attr("type",plugin);
							}

							//saveJs($("#"+lastKeyWritten),script.html());
							
						}
						//eval(response)
						//$("#drawSpace").append($("<div id='plugin-scripts'>").append(script))
						parent.append($("<script>").append(response))
					

				},"text")
			},500)

			parent.resizable('destroy').resizable()

			
		}



		
	})

}