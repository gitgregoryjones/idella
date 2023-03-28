var LAYER_TOOL = [];

window.allowedAmountToGrowOrShrink = 0;

window.expanded = true;

$(document).on("initializationComplete",function(){

	//reLoadLayers();
	log.debug("Initializing search-layers");


	$("#content").attr("expanded",true).css("width","100%")

	$("section.section").length == 0 ? $("[data-action=addsection]").click() : 0;

	

});


function centerMe(elem){
	var elem = $(elem);
    leftPos = $("#content").outerWidth( + $("#content")[0].offsetLeft/2 )

    //leftPos -= $("#content")[0].offsetLeft
    console.log(`Centering position ${leftPos} for elem ${elem.attr("id")}`)
    elem.css({left:leftPos - elem.outerWidth()/1.5});
    return leftPos;
}

function reLoadLayers(){

	$( ".search-layers" ).catcomplete({
      
      source:[]
      
  	});

	log.debug(`Layer menu is ${$("#layer-menu").length}`);

	log.debug(`Dummy length is ${$("#layer-content  .dummy").length}`);

	log.debug(`Length of layers to draw is ${$("#content .dropped-object").length}`)

	

	if($("#layer-content > .dummy").length == 0){

		$("#layer-content").children("[layer]").each(function(it){
			if(it > 0){
				$(this).remove();
			}
		})
	}


	$("#content").find(".dropped-object").each(function(){

		var theLayer = updateLayersTool(this.id);
	

	})

	$(".dummy").removeClass(".dummy");


	
	/*
	$(".dropped-object").not('#drawSpace,#editSpace,#workspace,#content').each(function(index){

				updateLayersTool($(this).attr("id"));
	});*/

	/*
	$("#maincontent").children(".layer").each(function(it){
		if($(this).attr("layer") == undefined){
			$(this).remove();
		}
	})*/
	
	$("#layer-menu").css({"z-index":99999})

	/*

     $("[type=LIST]").not("#content").find(".dropped-object").each(function(){
     	if(!$(this).hasClass("highlight-layer")) {
			$(`[layer=${$(this).attr("id")}]`).fadeOut()
			$(this).removeClass("open");
			$(this).addClass("closed");
		}

	})*/
			       

	
	//bId = $("body").attr("type","body").attr("id");

	//updateLayersTool("body");

}

function fit(){

		var lD = [];

		$(".layer").each(function(){
			lD.push({category:$(this).attr("layer-type"),label:$(this).find("[type=text]").val()})
		})

		console.log(lD)

		return lD;
}


function layerShowingAtPositionZero(){


	var atZero = false;



	var tester = $("#maincontent").attr("showing") == undefined ?  false : $("#maincontent").attr("showing");

	if(tester == false){
		return atZero;
	}

	if(Math.abs($(`#${tester}`).offset().top -   $("#maincontent").offset().top) < 60){
			atZero = true;
	}

	return atZero;
}


function scrollToLayer(aToolId){

	t = $("#maincontent").offset().top;


	var addToIt = 0;


	$("#maincontent").children("[layer]").each(
		function(it){
			log.debug(`Looking at layer ${$(this).attr("layer")} and layerShowingAtPositionZero is ${layerShowingAtPositionZero()}`)

			if($(this).attr("layer") !=  aToolId &&  $(this).is(".closed") ){

				addToIt += parseInt($(this).attr("children"));

			}

			if($(this).attr("layer") == aToolId  && !layerShowingAtPositionZero()){



			
					console.log(`Ok to Scroll to Layer ${$(this).attr("layer")} Distance = ${Math.abs(it - addToIt)} because it is ${it} and addToIt is ${addToIt}`)



					//$("#maincontent").animate({scrollTop:$(this).position().top	   },1000,function(){
					$("#maincontent").animate({scrollTop:Math.abs(it - addToIt) * $(this).outerHeight() + 55},1000,function(){
							//$("#maincontent").attr("showing",`z${aToolId}`);
							//$(".layer").hide();
							//break out of loop...we are done
							console.log(`Add to it is ${addToIt} and it is ${it}`)
							return false;
							//$(".mini-preview").css({width:"30px",height:"30px"})
					});


				
			}
		}
		);
}


function setRatios(content){

	content.oldMe = {width:content.outerWidth(), height:content.outerHeight()}

	var lRatio = content[0].offsetLeft/content.parent().outerWidth();

	var tRatio = content[0].offsetTop/content.parent().outerHeight();

	console.log(`Error computing size for element is ${JSON.stringify(content.oldMe)} for ${content.attr("id")} and  parent ${content.parent().attr("id")} is ${content.parent().outerWidth()}`)		

	content.oldMe.ratio = {left:lRatio, top:tRatio};

	console.log(`Error computing ratio for element is ${JSON.stringify(content.oldMe.ratio)} parent height was ${content.parent().outerHeight()}for ${content.attr("id")}`)



	var kids = []

	content.children(".dropped-object").each(function(iter){

		var child = $(this);

		console.log(`Error searching for #contentCopyFor-content/. Number found is ${child.parents("#contentCopyFor-content").length}`)


		if(child.parents("#contentCopyFor-content").length > 0){
			console.log(`Error Changing child id to copy id since a save is being performed on a background copy for ${"contentCopyFor-" + child.attr("id")}`)
			child.attr("id","contentCopyFor-" + child.attr("id"))

		}

		console.log(`Error setting coords on kids is ${child.attr("id")} for ${child.attr("alias")}`)

		kids.push(setRatios(child));

	})

	content.kids = kids;


	return content;
}

function resizeOrGrowElement(content,growMe){


	//console.log(`Error TIme TO DO IT The allowedAmountToGrow to grow or shrink is ${window.allowedAmountToGrowOrShrink}`)

	
	disableTransition(content);

	//content.css({opacity:1,"transition-duration":"0s","-webkit-transition-duration":"0s","-moz-transition-duration":"0s"});

	//console.log(`theClassObj is ${JSON.stringify(theClassObj)}`)


	//CSS_TEXT_saveCss(moveMe, theClassObj)*/

	/** Now expand or contract the Parent */
	if(growMe != undefined && growMe == true ) {

			content.css({width:content.oldMe.width/1.5, height:content.oldMe.height/1.5})
			//window.expanded = false;

	} else {
			console.log(`Error Expanded is time to grow up`)

			if(content[0].id == "content"){
				if(content.oldMe.width  * 1.5 > screen.width * 1.01){
					console.log(`Error Short circuit because this id [${content[0].id}] can't grow anymore ${content.oldMe.width}`);
					//return content;
				}
			}

			console.log(`Error Growing ${content[0].id} size will be ${content[0].offsetLeft}  divided by ${content.parent().outerWidth()} and width is ${content.oldMe.width} x 1.5`)
			content.css({width: content.oldMe.width  * 1.5 > screen.width * 1.0 ? content.parent().outerWidth() : content.oldMe.width * 1.5 , height:content.oldMe.height * 1.5})
			//window.expanded = true;
	}

	var newContentHeightAndWidthOffset= {
				left: content.oldMe.ratio.left * content.parent().outerWidth(),
				top: content.oldMe.ratio.top * content.parent().outerHeight()
	};

	console.log(`Error applying Left and Top offset ${newContentHeightAndWidthOffset} for ${content.attr("alias")}`)

	

	/* Set the Left and Top Offset for the Content */
	content.css({left:newContentHeightAndWidthOffset.left, top: newContentHeightAndWidthOffset.top})

	content.kids.forEach(function(child){

		//var child = $(this);

		console.log(`Error setting coords on child is ${child.attr("id")} for ${child.attr("alias")}`)

		resizeOrGrowElement(child,growMe);

	})

	//reset the old duration now that everything is resized
	//


	

	CUSTOM_ON_RESIZE_STOP_LOGIC({target:content[0]},{element:content})

	enableTransition(content)



	content.kids = kids;

	console.log(`Error newContentHeightAndWidth as parent is ${JSON.stringify(newContentHeightAndWidthOffset)} for ${content.attr("alias")}`)

	

	return content;


}


function shrinkOrGrowParent(content,growMe){

	if($("#content").attr("expanded") != undefined && $("#content").attr("expanded") === 'false' && growMe == false /* So backwards and nonintuitive..fix later*/){

		console.log(`Error Calling Short Circuit.  No Need to Grow Anymore from Edit Screen`)
		$("#content").attr("expanded",true);
		return;
	}

	console.log(`Error calling setRatios for Parent ${content.attr("id")} for ${content.attr("alias")}`)

	//ShowOverlays to get Proper Sizing for Save
	$("[type=OVERLAY]").show();



	content = setRatios(content);

	if(content.length == 0){
		console.log(`Short circuit on resizing called...exit`)
	}

	var kids = [];

	console.log(`Error calling Resize or Grow for Parent ${content.attr("id")} for ${content.attr("alias")}`)
	content = resizeOrGrowElement(content, growMe);

	$("[type=OVERLAY]").hide();

	$("[type=LIST] .gallery").each(function(){
		SLIDER_init($(this))
	})
	

}



function updateLayersTool(aToolId,aParentId){

		//expanded = true;

		console.log(`Expanded is A LOT ${ $("#content").attr("expanded")}`)

		//$("#content").css({width:"70%",left:0});
		/*

		$(".close-window").off().on("click",function(){

			var theHeight = $("#layer-menu").height() > 50 ? 50 : "100%";

			//$("#content").css("left","6rem").css({transform:"scale(1)"})
			
			
			if( $("#content").attr("expanded") == "true"){
				//We closed.  Put everything back
				console.log(`Error Expanded is NOT ${$("#content").attr("expanded")} and we are growing now`);

				shrinkOrGrowParent($("#content"),false);
				 $("#content").attr("expanded",false);
			} else {
				//$("#content").css("left","6rem").css({transform:"scale(.70)"}).css("transform-origin","middle")
				var element = document.getElementById("content");
				//element.scrollIntoView({behavior: "smooth"})
				console.log(`Error xpanded is ${$("#content").attr("expanded")} and we are shrinking now`)
				shrinkOrGrowParent($("#content"),true);
				$("#content").attr("expanded",true).css("top","6em");;

			}

			console.log(`Expanded is did we get here`)

			$("#layer-menu").animate({height:theHeight},200,"swing",function(){

				if($(".close-window").hasClass("fa-minus")){
					$(".close-window").removeClass("fa-minus").addClass("fa-plus");
				} else {
					$(".close-window").removeClass("fa-plus").addClass("fa-minus");
				}
				})
		});*/


				var foundInMenu = false;
				//first Add Layer Menu Div if it does not exist
				//var menu = $("#layer-menu").length == 0 ? $("<div>",{id:"layer-menu"}) : $("#layer-menu");

				//$("#drawSpace").append(menu);
				

				var aTool = $(`#${aToolId}`);


				if(aTool.is(".coordinate")){
					console.log(`Returning. We don't draw coordinates in menu`)
					return;
				}
				<!-- Setup Layers //-->
				log.warn("Building tool for layer " + $(aTool).attr("id"));

				if( $("#maincontent").find("[layer="+$(aTool).attr("id")+"]").length > 0){

					log.debug("Already Found this layer in layers menu abort. Highlighting it");
					$("#maincontent").find(".layer").removeClass("highlight");
					$("#maincontent").find("[layer="+$(aTool).attr("id")+"]").addClass("highlight");
					foundInMenu = true;
					//return;

				}else {

					log.debug("Did not find " + "[layer="+$(aTool).attr("id")+"]");

				}
                //From edit-body.html

                layer = $("#maincontent").find(".layer").first().clone(false);

                layer.css({display:"flex"})

                layer.find(".preview-window").text("");

                layer.find(".dropped-object").removeClass("overlay");
                //.css({display:"block"});
                layer.find(".fa-compress-alt").removeClass("fa-compress-alt")

                layer.removeClass("dummy");

				//setup layer unique id using aTool id
				$(layer).attr("layer",$(aTool).attr("id"));
				$(layer).attr("layer-type",$(aTool).attr("type"))

                pwindow = $(layer).find('.preview-window')

                eye = $(layer).find('.eye');

                expand = $(layer).find(".fa-arrows-alt-h").on("click",(e)=>{
                	e.stopPropagation();
                	log.debug(`looking at layer ${layer.attr("layer")}`)
                	obj = $(e.target);
                	if(obj.hasClass('fa-compress-alt')){
                		obj.removeClass('fa-compress-alt');
                		$(`#${layer.attr("layer")}`).css({width:$(layer).attr("compressX")});
                		$(`#${layer.attr("layer")}`).css({height:$(layer).attr("compressY")});
                	} else{
                		obj.addClass("fa-compress-alt");
                		layer.attr("compressX",$(`#${layer.attr("layer")}`).outerWidth())
                		layer.attr("compressY",$(`#${layer.attr("layer")}`).outerHeight())
                		$(`#${layer.attr("layer")}`).css({width:"100%", height:"100%",top:0,left:0});
                	}
                	
                })

                var centerIt = $(layer).find('.fa-align-center');

                centerIt.on("click",function(elem){

                	elem.stopPropagation();
                	var myLayer = $(elem.target).parents("[layer]").attr("layer");

                	console.log(`$(elem.target).parents("[layer]").lengh is ${$(elem.target).parents("[layer]").length}`)
                	console.log(`clicked ${$(elem.target).parents("[layer]").attr("layer")}`)
                	
                	centerMe("#"+myLayer);
                })

               

                log.debug(`Window height ${pwindow.height()} and width ${pwindow.width()}`);

                miniObj = $(aTool).clone(false);

                miniObj.find(".dropped-object").remove();

				$(miniObj).attr("id","z"+$(miniObj).attr("id"));

				var descendents = $(aTool).find(".dropped-object").length;

				$(layer).attr("children",descendents);


				$(miniObj).find("audio").remove();
				$(miniObj).find("[type=AUDIO]").remove();
				if($(miniObj).is("[type=AUDIO]")){
					$(miniObj).attr("type","SOUND");
				}

				if($(miniObj).attr("type") == "T"){
					$(pwindow).children().remove()
					$(pwindow).text("T");
					//$(pwindow).css({top:12,"padding-top":20});

                     $(layer).find('.details > [type=text]').val(miniObj.text().toUpperCase());
				} else if( $(miniObj).attr("type") == "LIST" || $(miniObj).attr("type") == "SECTION"){

					//$(pwindow).css({"background-image":"url(https://winaero.com/blog/wp-content/uploads/2019/01/windows-10-download-downloads-folder-icon.png")})
					var label = $(miniObj).attr("alias") ? $(miniObj).attr("alias") : $(miniObj).attr("type") == "LIST"?  "Gallery" : "Section";

					label+= ` (${descendents})`;
				
					  $(layer).find('.details > [type=text]').attr("text-for",$(aTool).attr("id")).val(label.toUpperCase());

					  if( $(miniObj).attr("type") == "SECTION"){
					  	$(pwindow).append(miniObj);
					  }

                	//$(pwindow).css({"background-repeat":"no-repeat","background-size":"contain","background-image":"url(https://icons-for-free.com/download-icon-data+document+documents+file+folder+icon-1320184630726303272_512.png"});

				}
				else  {
					var label = $(miniObj).attr("alias") ? $(miniObj).attr("alias") : miniObj.attr("type");

					label+=  descendents > 0 ? `(${descendents})` : "";
                	
                	$(miniObj).find("audio").remove();
                	//$(miniObj).find("[type=AUDIO]").attr("type","SOUND");
                	//if($(miniObj).is("[TYPE=AUDIO]")){
                	//	miniObj.attr("type","SOUND");
                	//}
                	//$(layer).find('.details').text(miniObj.attr('type') + "-" + miniObj.attr("id"));
                	$(layer).find('.details > [type=text]').attr("text-for",$(aTool).attr("id")).val(label.toUpperCase());

                	$(pwindow).append(miniObj);

                	//Make sure images appear in preview window since we may have inherited
                	//margin settings from real object while cloning.
                	//Overwrite margin settings for preview window
                	//$(pwindow);
				}

				//Hide MouseOver for this.  Kinda Confusing
				//$(layer).find('.details > [type=text]').on("mouseover",r_makeLayerTextInputField).attr("text-for",aToolId);



				$(layer).removeClass("dropped-object");

			     

                $(miniObj).css({float:"left", width:$(pwindow).width()-5, height:$(pwindow).height()-5, top:0, left:0}).find('[class^=ui]').remove();

				$("#maincontent").unbind("click");

				$(pwindow).unbind("click")

				$(layer).unbind("mouseover").on('mouseover',

					function(e){

					var jump = $(`#${$(e.target).attr("layer")}`);

					r_hoverOverElement({target:jump});
					//var border = $("<div>",{class:"highlight", "highlight-id":$(aTool).attr("id")});

					//$(".layer").removeClass("highlight");
					/*
					if($(aTool).attr("previous-style") == undefined){
						$(aTool).attr('previous-style',$(aTool).css("border"));
						//$(aTool).css({border:"solid red"});						
					}*/
					//$(aTool).addClass('highlight');	
					$(jump).mouseover();

					/*
					aTool = $(aTool);

					aTool.parent().append(border);

					border.css({
						width:aTool.width(),
						height:aTool.height(),
						top:aTool.position().top,
						left:aTool.position().left,
						position:aTool.css("position"),
						"z-index":aTool.css("z-index") + 1
					})*/
					

					
					
				}).unbind("mouseout").on('mouseout',function(e){

					var jump = $(`#${$(e.target).attr("layer")}`);
					
					$(jump).parent().find("[highlight-id]").remove();
					//$(aTool).removeClass('highlight');
					//$(aTool).css('border',$(aTool).attr("previous-style"));
					$(".layer").not("[active]").removeClass("highlight-layer");
					$(jump).mouseout();
					//$(aTool).css('border',$(aTool).attr("previous-style"));


				}).unbind("click").on("click",function(e){

					console.log(`Clicked A Layer ${$(this).attr("layer")}`)

					var jump = $(`#${$(this).attr("layer")}`);

					//$(this).parent().find(".preview-window").click();
					//Do MouseOVer to make lock appear
					
					//$(".layer").removeClass("highlight");
					//$(aTool).css('border',$(aTool).attr("previous-style"));
					/** alreadyScrolled can be added to keep the layer from scrolling since the user already is on the list**/
					//$(aTool).find("[id$=lock]").addClass("alreadyscrolled").click();
					$(jump).find("[id$=lock]").click();
					
					//$(this).addClass("highlight");

					//$(".layer").not($(this)).hide();


					
					
					//CUSTOM_pressEscapeKey();
					
					$("body,html").animate(
				      {
				        scrollTop: jump.offset().top - $(".navbar").outerHeight()
				      },
				      800, //speed

				    );



    
    				//e.preventDefault();

				});

				//Hide This Functionality
				//$(layer).find(".details > [type=text]").on("mouseover",r_makeLayerTextInputField)

				//Append The Layer Finally
				if(aParentId){
					log.debug(`Layer ${layer.id} Parent was found ${aParentId}`);
					log.debug(`Running $("layer.insertAfter("[layer=${aParentId}]")`);
					
					if(foundInMenu){
						log.debug(`Area 1 Replacing Layer ${layer.id}`);
						$(`#maincontent [layer=${aTool.attr("id")}]`).replaceWith(layer);

					} else {
						layer.insertAfter(`[layer=${aParentId}]`);
					}
					
					
						
				} else {

					log.debug(`Layer Parent was NOT found`);
					
					if(foundInMenu){
						log.debug(`Area 2 Replacing Layer #maincontent [layer=${aTool.attr("id")}]`);
						$(`#maincontent [layer=${aTool.attr("id")}]`).replaceWith(layer);

					} else {
						$("#maincontent").append(layer);
					}
					
				}
               

				$(layer).find(".dropped-object").css({"margin-top":"0px","margin-left":"0px","width":"100%",height:"100%"})

				$(aTool).on("remove",function(){

					var key = $(this).attr("id");

					log.debug(`Looking for this layer to remove #${key} from #layer-menu`);
	
					$("#maincontent").find(`[layer=${key}]`).remove();
					$("#editSpace").hide();

				});


				//show hide when clicking eye

				$(eye).on("click",function(e){

					e.stopPropagation();
					if($(aTool).css("display") == "none"){
						$(aTool).css({display:"block"});
						$(this).removeClass("fa-eye-slash");
						$(this).addClass("fa-eye");
						if($(aTool).attr("type") == "OVERLAY"){
							$("#showOverlays").click();
						}
					} else {
						$(aTool).css({display:"none"});
						$(this).removeClass("fa-eye");
						$(this).addClass("fa-eye-slash");
						if($(aTool).attr("type") == "OVERLAY"){
							$("#showOverlays").click();
						}
					}
				});

				 if( $(aTool).is("[type=LIST]") ) {
                	$(layer).find(".runningman").show();
                	$(layer).find(".runningman").on("click",

                		function(e){
                			e.stopPropagation();

                			//e.stopPropogation();

                			if($(e.target).hasClass("fa-stop-circle")) {
                				console.log(`Stopping Slider`)
                				SLIDER_deInit(aTool);

                				$(e.target).removeClass("fa fa-stop-circle").removeClass("gallery").addClass("fa fa-play-circle");
                				//e.stopPropogation()
                			} else {
                				console.log("Starting Slider");
                				SLIDER_init(aTool);
                				$(e.target).removeClass("fa fa-play-circle").addClass("fa fa-stop-circle").addClass("gallery");
                				//e.stopPropogation();
                			}
                			
                		}
            		);
            	} else{
            		$(layer).find(".runningman").hide();
            	}

            	if(aTool.is("[type=OVERLAY]")){

            		$(layer).find('.fa-align-center').remove();
            	}

				//reverse the list
				//$("#layer-menu").children().each(function(i,li){$("#layer-menu").prepend(li)})
				var menu = $("#maincontent");

				/*
				$("#layer-menu").draggable()
					.css({"right":200,top:200});*/

				$(".layer").removeClass("highlight-layer");

				$(layer).addClass("highlight-layer open");

				/*
				$(pwindow).on("click",function(){
					$(this).parent().find(".details").click()
				})*/

				

				$(pwindow).off("click",function(e){

					e.stopPropagation();


					if(parseInt($(e.target).parent().attr("children")) > 0){

								console.log(`Clicked me brudda`)
					    if($(this).parent().hasClass("open")){
					        $(`#${$(this).parent().attr("layer")}`).find(".dropped-object").each(function(){
					            $(`[layer=${$(this).attr("id")}]`).fadeOut()

					        })
					        $(this).parent().removeClass("open");
					        $(this).parent().addClass("closed");
					        $("#editSpace").fadeOut();
					    } else  if($(this).parent().hasClass("closed")){
					          $(`#${$(this).parent().attr("layer")}`).find(".dropped-object").each(function(){
					            $(`[layer=${$(this).attr("id")}]`).fadeIn()

					        })
					        //don't forget to close details if we are opening children  
					        
					        $(this).parent().removeClass("closed");
					        $(this).parent().addClass("open");
					    } else {
					    	//default to clicking the layer to move to the correct element in the UI
					    	$(this).parent().click();
					    }


					} else {
						$(e.target).parent().click();
					}

				
				})

				//$( ".search-layers" ).catcomplete("option", {source:fit()});


				return layer;
}
