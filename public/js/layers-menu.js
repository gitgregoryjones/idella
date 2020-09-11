var LAYER_TOOL = [];

$(document).ready(function(){

	//reLoadLayers();
	console.log("Loaded layers");

});


function reLoadLayers(){

	console.log(`Layer menu is ${$("#layer-menu").length}`);

	$("#maincontent").children("[layer]").each(function(it){
		if(it > 0){
			$(this).remove();
		}
	})


	$("#content .dropped-object").each(function(){

		updateLayersTool(this.id);

	})


	/*
	$(".dropped-object").not('#drawSpace,#editSpace,#workspace,#content').each(function(index){

				updateLayersTool($(this).attr("id"));
	});*/

	
	$("#maincontent").children(".layer").each(function(it){
		if($(this).attr("layer") == undefined){
			$(this).remove();
		}
	})
	
	$("#layer-menu").css({"z-index":99999})

	
	//bId = $("body").attr("type","body").attr("id");

	//updateLayersTool("body");

}

function scrollToLayer(aToolId){

	t = $("#maincontent").offset().top;

	$("#maincontent").children("[layer]").each(
		function(it){
			console.log(`Looking at layer ${$(this).attr("layer")}`)
			if($(this).attr("layer") == aToolId ){
				$("#maincontent").animate({scrollTop:it* $(this).height()},1000,function(){

				});
			}
		}
		);
}

function updateLayersTool(aToolId,aParentId){

				//first Add Layer Menu Div if it does not exist
				//var menu = $("#layer-menu").length == 0 ? $("<div>",{id:"layer-menu"}) : $("#layer-menu");

				//$("#drawSpace").append(menu);
				 $(".close-window").unbind("click").on("click",(e)=>{
		            
		            console.log(`Close Window Called`)
		            $(".iilayers").click();
		            
          		 })


				var aTool = $(`#${aToolId}`);

				<!-- Setup Layers //-->
				console.log("Building tool for layer " + $(aTool).attr("id"));

				if( $("#maincontent").find("[layer="+$(aTool).attr("id")+"]").length > 0){;

					console.log("Already Found this layer in layers menu abort. Highlighting it");
					$("#maincontent").find(".layer").removeClass("highlight");
					$("#maincontent").find("[layer="+$(aTool).attr("id")+"]").addClass("highlight");
					
					return;

				}else {

					console.log("Did not find " + "[layer="+$(aTool).attr("id")+"]");

				}
                //From edit-body.html

                layer = $("#maincontent").children(".layer").first().clone(false);

                layer.find(".preview-window").text("");

                layer.find(".dropped-object").removeClass("overlay");
                //.css({display:"block"});
                layer.find(".fa-compress-alt").removeClass("fa-compress-alt")

				//setup layer unique id using aTool id
				$(layer).attr("layer",$(aTool).attr("id"));

                pwindow = $(layer).find('.preview-window')

                eye = $(layer).find('.eye');

                expand = $(layer).find(".fa-arrows-alt-h").on("click",(e)=>{
                	console.log(`looking at layer ${layer.attr("layer")}`)
                	obj = $(e.target);
                	if(obj.hasClass('fa-compress-alt')){
                		obj.removeClass('fa-compress-alt');
                		$(`#${layer.attr("layer")}`).css({width:$(layer).attr("compressX")});
                	} else{
                		obj.addClass("fa-compress-alt");
                		layer.attr("compressX",$(`#${layer.attr("layer")}`).css("width"))
                		$(`#${layer.attr("layer")}`).css({width:"100%",left:0});
                	}
                	
                })

                if( $(aTool).is("[type=LIST]") ) {
                	$(layer).find(".fa-running").show();
                	$(layer).find(".fa-running").on("click",
                		(e)=>{
                			if($(e.target).hasClass("fa-stop-circle")) {
                				SLIDER_deInit(aTool);
                				$(e.target).removeClass("fa-stop-circle");
                				//e.stopPropogation()
                			} else {
                				SLIDER_init(aTool);
                				$(e.target).addClass("fa-stop-circle");
                				//e.stopPropogation();
                			}
                			
                		}
            		);
            	} else{
            		$(layer).find(".fa-running").hide();
            	}

                console.log(`Window height ${pwindow.height()} and width ${pwindow.width()}`);

                miniObj = $(aTool).clone(false);

				$(miniObj).attr("id","z"+$(miniObj).attr("id"));


				$(miniObj).find("audio").remove();
				$(miniObj).find("[type=AUDIO]").remove();
				if($(miniObj).is("[type=AUDIO]")){
					$(miniObj).attr("type","SOUND");
				}

				if($(miniObj).attr("type") == "T"){
					$(pwindow).children().remove()
					$(pwindow).text("T");
					//$(pwindow).css({top:12,"padding-top":20});

                     $(layer).find('.details').text(miniObj.text());
				} 
				else {
					var label = $(miniObj).attr("alias") ? $(miniObj).attr("alias") : miniObj.attr("type");
                	
                	$(miniObj).find("audio").remove();
                	//$(miniObj).find("[type=AUDIO]").attr("type","SOUND");
                	//if($(miniObj).is("[TYPE=AUDIO]")){
                	//	miniObj.attr("type","SOUND");
                	//}
                	//$(layer).find('.details').text(miniObj.attr('type') + "-" + miniObj.attr("id"));
                	$(layer).find('.details').text(label);
                	$(pwindow).append(miniObj);

                	//Make sure images appear in preview window since we may have inherited
                	//margin settings from real object while cloning.
                	//Overwrite margin settings for preview window
                	//$(pwindow);
				}

				$(layer).removeClass("dropped-object");

			     

                $(miniObj).css({float:"left", width:$(pwindow).width()-5, height:$(pwindow).height()-5, top:0, left:0}).find('[class^=ui]').remove();

				$("#maincontent").unbind("click");

				$(pwindow).unbind("click")

				$(layer).unbind("mouseover").on('mouseover',function(){
					
					$(aTool).attr('previous-style',$(aTool).css("border"));
					//$(aTool).css({border:"solid red"});
					$(aTool).addClass('highlight');
					$(aTool).mouseover();
					
					
				}).unbind("mouseout").on('mouseout',function(){
					$(aTool).css('border',$(aTool).attr("previous-style"));
					$(aTool).mouseout();
					$(aTool).removeClass('highlight');

				}).unbind("click").on("click",function(e){

					//$(aTool).mouseover();
					$(aTool).find("[id$=lock]").addClass("alreadyscrolled").click();
					$(".layer").removeClass("highlight");
					$(this).addClass("highlight");

					//$(".layer").not($(this)).hide();

					
					var jump = $(aTool);
					//CUSTOM_pressEscapeKey();
					var new_position = $(jump).offset().top;

					var final_position = new_position + $("#content").scrollTop() + new_position/2;

					
					console.log(`New Position is ${new_position} and final is ${final_position}`);
					/*$('#drawSpace').stop().animate({ scrollTop: final_position}, 500,function(){
						NOTES_makeNote($(aTool),true);
						
						$(aTool).mouseover();
						//CUSTOM_pressEscapeKey();
						//$("[data-action=lessOptions]").click();
					});*/
					$("body,html").animate(
				      {
				        scrollTop: $(`#${aToolId}`).offset().top
				      },
				      800, //speed

				    );



    
    				//e.preventDefault();

				});

				$(layer).find(".details").on("clicker",
					(e)=>{
						
						$(document).unbind("keydown");
						txt = $(e.target).text(); 
						$(e.target).html(""); 
						txt = $(`<input type='text' value='${txt}' pid='${aToolId}'>`);
						txt.on("mouseleave",(inp)=>{
							$(`#${aToolId}`).attr("alias",$(inp.target).val());
							$(e.target).html($(inp.target).val());
							txt.remove();
							$(document).unbind("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)

						})

						$(e.target).append(txt);
						txt.putCursorAtEnd();
						e.stopPropogation();
						
				})

				//Append The Layer Finally
				if(aParentId){
					console.log(`Layer ${layer.id} Parent was found ${aParentId}`);
					console.log(`Running $("layer.insertAfter("[layer=${aParentId}]")`);
					
					layer.insertAfter(`[layer=${aParentId}]`);
					
						
				} else {
					console.log(`Layer Parent was NOT found ${aParentId}`);
					$("#maincontent").append(layer);
				}
               

				$(layer).find(".dropped-object").css({"margin-top":"0px","margin-left":"0px","width":"100%",height:"100%"})

				$(aTool).on("remove",function(){

					var key = $(this).attr("id");

					log.debug(`Looking for this layer to remove #${key} from #layer-menu`);
	
					$("#maincontent").find(`[layer=${key}]`).remove();

				});


				//show hide when clicking eye

				$(eye).on("click",function(){
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

				//reverse the list
				//$("#layer-menu").children().each(function(i,li){$("#layer-menu").prepend(li)})
				var menu = $("#maincontent");

				$("#layer-menu").draggable()
					.css({"right":200,top:200});

				
}
