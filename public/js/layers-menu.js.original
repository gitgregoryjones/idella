var LAYER_TOOL = [];

$(document).ready(function(){

	//reLoadLayers();
	log.debug("Initializing search-layers");

	

});


function reLoadLayers(){

	$( ".search-layers" ).catcomplete({
      
      source:[]
      
  	});

	log.debug(`Layer menu is ${$("#layer-menu").length}`);

	log.debug(`Dummy length is ${$("#maincontent > .dummy").length}`);

	log.debug(`Length of layers to draw is ${$("#content .dropped-object").length}`)

	

	if($("#maincontent > .dummy").length == 0){

		$("#maincontent").children("[layer]").each(function(it){
			if(it > 0){
				$(this).remove();
			}
		})
	}


	$("#content .dropped-object").each(function(){

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

function scrollToLayer(aToolId){

	t = $("#maincontent").offset().top;

	$("#maincontent").children("[layer]").each(
		function(it){
			log.debug(`Looking at layer ${$(this).attr("layer")}`)
			if($(this).attr("layer") == aToolId ){
				$("#maincontent").animate({scrollTop:it* $(this).height()},1000,function(){

				});
			}
		}
		);
}

function updateLayersTool(aToolId,aParentId){


				


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

				if( $("#maincontent").find("[layer="+$(aTool).attr("id")+"]").length > 0){;

					log.debug("Already Found this layer in layers menu abort. Highlighting it");
					$("#maincontent").find(".layer").removeClass("highlight");
					$("#maincontent").find("[layer="+$(aTool).attr("id")+"]").addClass("highlight");
					foundInMenu = true;
					//return;

				}else {

					log.debug("Did not find " + "[layer="+$(aTool).attr("id")+"]");

				}
                //From edit-body.html

                layer = $("#maincontent").children(".layer").first().clone(false).css({display:"block"});

                layer.find(".preview-window").text("");

                layer.find(".dropped-object").removeClass("overlay");
                //.css({display:"block"});
                layer.find(".fa-compress-alt").removeClass("fa-compress-alt")

				//setup layer unique id using aTool id
				$(layer).attr("layer",$(aTool).attr("id"));
				$(layer).attr("layer-type",$(aTool).attr("type"))

                pwindow = $(layer).find('.preview-window')

                eye = $(layer).find('.eye');

                expand = $(layer).find(".fa-arrows-alt-h").on("click",(e)=>{
                	log.debug(`looking at layer ${layer.attr("layer")}`)
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

               

                log.debug(`Window height ${pwindow.height()} and width ${pwindow.width()}`);

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

                     $(layer).find('.details > [type=text]').val(miniObj.text().toUpperCase());
				} 
				else {
					var label = $(miniObj).attr("alias") ? $(miniObj).attr("alias") : miniObj.attr("type");
                	
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

				$(layer).find('.details > [type=text]').on("mouseover",r_makeLayerTextInputField).attr("text-for",aToolId);

				$(layer).removeClass("dropped-object");

			     

                $(miniObj).css({float:"left", width:$(pwindow).width()-5, height:$(pwindow).height()-5, top:0, left:0}).find('[class^=ui]').remove();

				$("#maincontent").unbind("click");

				$(pwindow).unbind("click")

				$(layer).unbind("mouseover").on('mouseover',

					function(){

					r_hoverOverElement({target:aTool});
					//var border = $("<div>",{class:"highlight", "highlight-id":$(aTool).attr("id")});

					//$(".layer").removeClass("highlight");
					/*
					if($(aTool).attr("previous-style") == undefined){
						$(aTool).attr('previous-style',$(aTool).css("border"));
						//$(aTool).css({border:"solid red"});						
					}*/
					//$(aTool).addClass('highlight');	
					$(aTool).mouseover();

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
					

					
					
				}).unbind("mouseout").on('mouseout',function(){
					
					$(aTool).parent().find("[highlight-id]").remove();
					//$(aTool).removeClass('highlight');
					//$(aTool).css('border',$(aTool).attr("previous-style"));
					$(".layer").not("[active]").removeClass("highlight-layer");
					$(aTool).mouseout();
					//$(aTool).css('border',$(aTool).attr("previous-style"));


				}).find(".details").off().on("click",function(e){

					console.log("Clicked A Layer")
					//Do MouseOVer to make lock appear
					
					//$(".layer").removeClass("highlight");
					//$(aTool).css('border',$(aTool).attr("previous-style"));
					$(aTool).find("[id$=lock]").addClass("alreadyscrolled").click();
					
					//$(this).addClass("highlight");

					//$(".layer").not($(this)).hide();

					
					var jump = $(aTool);
					//CUSTOM_pressEscapeKey();
					var new_position = $(jump).offset().top;

					var final_position = new_position + $("#content").scrollTop() + new_position/2;

					
					log.debug(`New Position is ${new_position} and final is ${final_position}`);
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

				$(layer).find(".details > [type=text]").on("mouseover",r_makeLayerTextInputField)

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

				 if( $(aTool).is("[type=LIST]") ) {
                	$(layer).find(".runningman").show();
                	$(layer).find(".runningman").on("click",
                		function(e){

                			//e.stopPropogation();

                			if($(e.target).hasClass("fa-stop-circle")) {

                				SLIDER_deInit(aTool);

                				$(e.target).removeClass("fa fa-stop-circle").addClass("fa fa-play-circle");
                				//e.stopPropogation()
                			} else {
                				console.log("Starting Slider");
                				SLIDER_init(aTool);
                				$(e.target).removeClass("fa fa-play-circle").addClass("fa fa-stop-circle");
                				//e.stopPropogation();
                			}
                			
                		}
            		);
            	} else{
            		$(layer).find(".runningman").hide();
            	}

				//reverse the list
				//$("#layer-menu").children().each(function(i,li){$("#layer-menu").prepend(li)})
				var menu = $("#maincontent");

				$("#layer-menu").draggable()
					.css({"right":200,top:200});

				$(".layer").removeClass("highlight-layer");

				$(layer).addClass("highlight-layer");

				//$( ".search-layers" ).catcomplete("option", {source:fit()});

				return layer;
}
