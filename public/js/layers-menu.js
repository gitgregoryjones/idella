var LAYER_TOOL = [];

$(document).ready(function(){

	//reLoadLayers();
	console.log("Loaded layers");

});


function reLoadLayers(){

	console.log(`Layer menu is ${$("#layer-menu").length}`);

	$(".dropped-object").not('#drawSpace,#editSpace,#workspace').each(function(index){

				updateLayersTool($(this).attr("id"));
	});

}



function updateLayersTool(aToolId){

				//first Add Layer Menu Div if it does not exist
				//var menu = $("#layer-menu").length == 0 ? $("<div>",{id:"layer-menu"}) : $("#layer-menu");

				//$("#drawSpace").append(menu);


				var aTool = $(`#${aToolId}`);

				<!-- Setup Layers //-->
				console.log("Building tool for layer " + $(aTool).attr("id"));

				if($("#layer-menu").find("[layer="+$(aTool).attr("id")+"]").length > 0){;

					console.log("Already Found this layer in layers menu abort. Highlighting it");
					$("#layer-menu").find("[layer]").removeClass("highlight");
					$("#layer-menu").find("[layer="+$(aTool).attr("id")+"]").addClass("highlight");
					
					return;

				}else {

					console.log("Did not find " + "[layer="+$(aTool).attr("id")+"]");

				}
                //From edit-body.html

                layer = $(".template-layer").first().clone(false).css({display:"block"}).addClass("example-layer").removeClass("template-layer");

				//setup layer unique id using aTool id
				$(layer).attr("layer",$(aTool).attr("id"));

                                pwindow = $(layer).find('.preview-window')

                                eye = $(layer).find('.eye');

                                console.log(`Window height ${pwindow.height()} and width ${pwindow.width()}`);

                                miniObj = $(aTool).clone(false);

				$(miniObj).attr("id","mylayer-"+$(miniObj).attr("id"));

				if($(miniObj).attr("type") == "T"){
                                	$(pwindow).children().remove()
					$(pwindow).text("T");
					$(pwindow).css({top:12});
                                	$(layer).find('.details').text(miniObj.text());
				} else {
                                	$(layer).find('.details').text(miniObj.attr('type') + "-" + miniObj.attr("id"));
                                	$(pwindow).append(miniObj);
				}

				$(layer).removeClass("dropped-object");


                                $("#layer-menu").prepend(layer);

				


                                $(miniObj).css({float:"left", width:$(pwindow).width()-5, height:$(pwindow).height()-5, top:0, left:0}).find('[class^=ui]').remove();

				$("#layer-menu").off("click");

				$(pwindow).off("click");

				$(layer).on('mouseover',function(){
					$(aTool).attr('previous-style',$(aTool).css("border"));
					$(aTool).css({border:"solid white"});
					$(aTool).mouseover();
					NOTES_delete();
				}).on('mouseout',function(){
					$(aTool).css('border',$(aTool).attr("previous-style"));
					$(aTool).mouseout();

				}).on("click",function(){
					$(aTool).mouseover();
					$(aTool).find("[id$=lock]").click();
					$(".example-layer").removeClass("highlight");
					$(this).addClass("highlight");
					var jump = $(aTool);
					//CUSTOM_pressEscapeKey();
					var new_position = $(jump).offset().top;

					var final_position = new_position + $("#drawSpace").scrollTop();

					
					console.log(`New Position is ${new_position} and final is ${final_position}`);
					$('#drawSpace').stop().animate({ scrollTop: final_position}, 500,function(){
						NOTES_makeNote($(aTool),true);
						
						$(aTool).mouseover();
						CUSTOM_pressEscapeKey();
					});
    
    				//e.preventDefault();

				});

				$(aTool).on("remove",function(){

					var key = $(this).attr("id");

					console.log(`Looking for this layer to remove #${key} from #layer-menu`);
	
					$("#layer-menu").find(`[layer=${key}]`).remove();

				});


				//show hide when clicking eye

				$(eye).on("click",function(){
					if($(aTool).css("display") == "none"){
						$(aTool).css({display:"block"});
						$(this).removeClass("fa-eye-slash");
						$(this).addClass("fa-eye");
					} else {
						$(aTool).css({display:"none"});
						$(this).removeClass("fa-eye");
						$(this).addClass("fa-eye-slash");
					}
				});

				//reverse the list
				//$("#layer-menu").children().each(function(i,li){$("#layer-menu").prepend(li)})

				$("#layer-menu").draggable();

				//$("#layer-menu").off("click");


}
