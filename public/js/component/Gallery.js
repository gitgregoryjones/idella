


class Gallery {

 constructor(div){

		 	div.css("width","400px")

		    var left = whichTool("DIV");
		    left = configuredTool(left);
		    left.css({"width":"25px","background-color":"black",opacity:".3"}).attr('alias',"cntrl-left")
		        .attr("onhover","opacity:1")
		     dropTool(left,{target:div,clientX:currentX,clientY:currentY});


		    var right = whichTool("DIV");
		    right = configuredTool(right);
		    right.css({"width":"25px","background-color":"black",opacity:".3"}).attr('alias',"cntrl-right")
		        .attr("onhover","opacity:1")
		    dropTool(right,{target:div,clientX:currentX,clientY:currentY});
		   
		    var limit = 8;
		    var whiteSpace = "nowrap";

		    if($(this).hasClass("adaptive")){
		        limit = 4;
		    }

		    for(i=0; i < limit; i++){
		        var bImg = whichTool("IMG")
		        bImg = configuredTool(bImg);
		        if($(this).hasClass("adaptive")){
		            bImg.css({"height":"200px","width":"200px"})
		        }
		       
		        div.append(bImg);
		        CUSTOM_PXTO_VIEWPORT(bImg,bImg.offset().left,bImg.offset().top)
		    }

		   CUSTOM_PXTO_VIEWPORT(div,div.offset().left,div.offset().top)

	}

	
}
Gallery.counter = 0;
