$(document).on("movies-available",function(event,list,callback){

	var list = $(list)

	var content = {};

	console.log("Retrieving content for [" + list.attr("alias") + "]")

	//Could Do Ajaxy stuff here
	/*
	content["movies"] = [
							{"id":"firstone","type":"DIV","background-size":"cover","background-image":"url(\"https://imgix-media.wbdnbo.net/art-collections/box/c76.png?w=350\")"},
							{"id":"ELEM_1485401888749","background-size":"cover","background-image":"url(\"https://imgix-media.wbdnbo.net/art-banners/131md.png\")","type":"DIV"}
						]
							
	content["featured-movie"] = [{"id":"ELEM_1498586723899","alias":"featured-movie","background-size":"cover","background-image":"url(\"https://static.giantbomb.com/uploads/scale_small/0/6087/2438704-1202149925_t.png\")","type":"DIV"}]
	

	content["logo"] = [{"id":"ELEM_1498534330405","href":"http://www.yahoo.com/index.html","anchors":[{"id":"anchor-ELEM_1498534330405","href":"http://www.yahoo.com/index.html"}]}]

	console.log("Leaving movies-available with content \n" + JSON.stringify(content));
	*/
		
	callback(content);

})


