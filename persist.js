//Test
var cheerio = require('cheerio');

var standardFields = "id:0;extends:none;onhover:none;href:none;color:white;alias:none;background-color:none;background-image:none;src:none;text:none;width:0;height:0;";

function getSectionFromSheet($,element){


	myCSSLookupKey = element.attr("id");

	console.log("This is my cool key " + myCSSLookupKey)

	var re = new RegExp(myCSSLookupKey+'\\s+\\{[^}]+\\}','img')

	var thescript = "";

	
	thescript = $("style.generated");
	//thescript = $(styleSheetName);

	styleCss = thescript.html();

	var myObject = {}

	var matches = null;

	if((matches = styleCss.match(re)) != null){
		console.log("Found a match homey")
		console.log(matches.length)
		console.log(matches)
	


	clean = matches[0].replace(myCSSLookupKey + " {","");

	clean = clean.substring(0,clean.lastIndexOf("}"));

	console.log("Clean is " + clean)

	lines = clean.split("\n");
	console.log("Number of lines is " + lines.length)
	var myObject = {}
	lines.forEach(function(line){
		var label = line.substring(0,line.indexOf(":")).replace("\t","")
		var value = line.substring(line.indexOf(":")+1);
		//trim trailing ";" character
		value = value.substring(0,value.length-1)
		myObject[label] = value
	})



	element.children("[type]").each(function(idx,child){
		child = $(child)
		console.log(child)
		var type = child.attr("type").toLowerCase() + "s"
		console.log("Type of child array " + type)
		myObject[type] = myObject[type] ? myObject[type] : []
		//obj[type].push({weight:200,height:100})
		console.log("Type of child array " + myObject[type] + " is " + myObject[type].length)
		console.log("Working on child " + child.attr("id"))
		var c =getSectionFromSheet($,child)
		//log.trace(c)
		myObject[type].push(c) 
	})

	myObject = trimObject(myObject);


	console.log(myObject)
	}

	return myObject;

}


function trimObject(obj,customFields){

	var tObj = {}

	//fieldsToPersist = customFields ? customFields : standardFields;
	fieldsToPersist = standardFields.split(";")

	var cleanF = [];

	fieldsToPersist.forEach(function(str){
		key = str.substring(0,str.indexOf(":")).trim();
		cleanF.push(key);
	})

	console.log(standardFields)

	console.log("fields to persist is:")
	console.log(fieldsToPersist)
	console.log(obj)

	for(fieldname in obj){

		console.log("Looking at field " + fieldname)

	   //key = str.substring(0,str.indexOf(":")).trim();

		console.log(" Loop field " + fieldname)
		if( ( cleanF.indexOf(fieldname) > -1 && obj[fieldname] != "undefined" )|| Array.isArray(obj[fieldname])){
			//do nothing
		} else {
			delete obj[fieldname];
			console.log("Throwing away field " + fieldname + " value " + obj[fieldname])
		}

	}
	return obj;
}

 module.exports.getSectionFromSheet = getSectionFromSheet;
