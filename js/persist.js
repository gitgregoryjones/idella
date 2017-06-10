
function persistElement(element){

	//log.trace(element)

	var obj = CONVERT_STYLE_TO_CLASS_OBJECT(element)

	obj = trimObject(obj)

	element.children(".dropped-object").each(function(idx,child){
		child = $(child)
		var type = child.attr("type").toLowerCase() + "s"
		log.trace("Type of child array " + type)
		obj[type] = obj[type] ? obj[type] : []
		//obj[type].push({weight:200,height:100})
		log.trace("Type of child array " + obj[type])
		log.trace("returned ")
		var c =persistElement(child)
		//log.trace(c)
		obj[type].push(c) 
	})

	return(obj)
}

function toJSON(element){
	return JSON.stringify(persistElement(element))
}

function trimObject(obj,customFields){

	var tObj = {}

	//fieldsToPersist = customFields ? customFields : standardFields;
	fieldsToPersist = standardFields.split(";")

	log.trace(standardFields)

	log.trace("fields to persist is:")
	log.trace(fieldsToPersist)

	$(fieldsToPersist).each(function(x,str){

	   key = str.substring(0,str.indexOf(":")).trim();

		var fieldname = key;

		log.trace(" Loop field " + fieldname)
		if(obj[fieldname]){
			if(fieldname == "class"){
				groups = obj[fieldname].match(/(fa-\S+)/)
				if(groups && groups[1])
					tObj[fieldname] = "fa " + groups[1]
			} else {
				tObj[fieldname] = obj[fieldname]
			}
		} 

	})
	return tObj;
}