
function PREVIEW_makeSaveableView(page){

		$(".widget-on,.widget-off").remove();

		$("[slash-for]").each(function(idx,it){
			var pkey = $(it).attr("slash-for");
			var parentObject = $(pkey);
			parentObject.show();
		})

		$("[slash-for]").remove();

		$(window).trigger(editing ? "editing" :"preview")

		$("#greybox").hide();

		$("[data-popup-for]").hide();

		$(page).find(".dropped-object").not(".tool").removeClass("debug-border-style").removeClass("squarepeg");

		$(page).find(".dropped-object,[class=submenu]").removeClass("submenu")
		try {$(page).find(".dropped-object").resizable("destroy");}catch(e){
			
			log.info("PREVIEW.js: " + e.stack)
		}
		
		$(page).find(".dropped-object").is(function(){
			log.debug("border is " + $(this).css("border-top-style"))
			hasDefaultBorder = $(this).css("border-top-style").indexOf("dashed") > -1
			log.debug($(this).attr("id") + " hasDefaultBorder " + hasDefaultBorder);
			if(hasDefaultBorder){
				$(this).addClass("noborder");
			}
			return hasDefaultBorder;
		})

		$(page).find("#drawSpace").css("background-image","none");
		//editing = false;
		//hide breakpoint indicator
		$(page).find(".responsive-design-tab").hide();

		//hide extended menu
		$(page).find("#extended-editing").hide();
		//Make Div hoverable but hide it until user hovers
		$(page).find("[overlay-for]").hide();
		//Anything with an overlay can not be resized in review mode
		//existence of resize anchors make onhover logic not work correctly
		//$(page).find("[overlay]").resizable("destroy")
		
		//DRAW_SPACE_deleteWorkspaceFromBody();
		$(page).find(".ui-icon").hide();

}


function PREVIEW_togglePreview(showPreview){


	if(showPreview){
		$(".widget-on,.widget-off").remove();

		$(".dropped-object").not(".tool").removeClass("debug-border-style").removeClass("squarepeg");
		$(".dropped-object,[class=submenu]").removeClass("submenu")

		$("[slash-for]").each(function(idx,it){
			var pkey = $(it).attr("slash-for");
			var parentObject = $(pkey);
			parentObject.show();
			$(this).hide();
		})
		
		/*  Commented out because I want user to be able to resize in preview mode but not live mode

		try {
			$(".dropped-object").each(function(idx,i){
				i = $(i)
				if(i.resizable("instance")){
					i.resizable("destroy");
				}

			})

		}catch(e){
			
			log.info("PREVIEW.js: " + e.stack)
		}
		*/
		
		$(".dropped-object").is(function(){
			log("border is " + $(this).css("border"))
			hasDefaultBorder = $(this).css("border-top-style").indexOf("dashed") > -1
			if(hasDefaultBorder){
				$(this).addClass("noborder");
			}
			return hasDefaultBorder;
		})

		$("#drawSpace").css("background-image","none");
		editing = false;
		//hide breakpoint indicator
		$(".responsive-design-tab").hide();

		//hide extended menu
		$("#extended-editing").hide();
		//Make Div hoverable but hide it until user hovers
		$("[overlay-for]").hide();
		//Anything with an overlay can not be resized in review mode
		//existence of resize anchors make onhover logic not work correctly
		try {
			$("[type=OVERLAY]").resizable("destroy")
		}catch(e){
			console.log("ignoring resize for overlays")
		}
		
		DRAW_SPACE_deleteWorkspaceFromBody();
		$(".ui-icon").hide();
		$(".ghost").hide();
		$("#myp").hide();
		$(".dropped-object").css("touch-action","auto")

		//Give User Visual Indicator They are in preview mode
		POPUP_greyOver({target:"window",callerType:"information"},function(greyBox){

			greyBox.find("[data-message-for-greybox]").text(" Preview Mode").addClass("fa fa-file-o")
			.css({"background-color":"navy","text-align":"center",transform:"rotate(-10deg)"})

			//Auto destroy greybox after 700 milliseconds by fading out and finally deleting from DOM and
			//stylesheet if added
			setTimeout(function(){

				greyBox.fadeOut(function(){
					deleteElement($(this))
				})
			},700)
		})

		$("#accordionSidebar,#idella-search").hide();

		$(window).trigger(editing ? "editing" :"preview")

	}else {
		
	
		//$(".dropped-object").not(".tool,[type=MENU-ITEM]").addClass("debug-border-style").addClass("squarepeg").removeClass("noborder");
		//$(".dropped-object").resizable().off("resizestop").on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC);
		//$(".dropped-object").resizable({disabled:false});
		$(".dropped-object").each(function(idx,it){
			it = $(it);			
			
			it.off("resizestop").on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC)
		
			it.not(".tool,[type=MENU-ITEM]").addClass("debug-border-style").addClass("squarepeg").removeClass("noborder");
			//
			it.is(function(){
				$(this).css("border-top-width") == "0" ? $(this).css({"border":"3px dashed black"}) : "";
				return true;
			})
		})
		
		//$(".dropped-object").removeClass("noborder")
		$(".responsive-design-tab").show()
		editing = true;
		DRAW_SPACE_addWorkSpaceToBody();
		$(".ui-icon").show();
		$(".ghost").show();

		$("[slash-for]").each(function(idx,it){
			var pkey = $(it).attr("slash-for");
			var parentObject = $(pkey);
			parentObject.hide();
			$(it).show().css({"z-index":parentObject.css("z-index")});
		})

		var total = 0;
		var clength = $("#content > .section").length;
	    $("#content > .section").each(function(index){
	        total += $(this).width();
	    })
	    $("body,#content").css({width:parseInt(total/clength)+5});


		//Give User Visual Indicator They are in preview mode
		POPUP_greyOver({target:"window",callerType:"edit-information"},function(greyBox){

			greyBox.find("[data-message-for-greybox]").text(" Preparing Edit Mode...").addClass("fa fa-edit")
			.css({"background-color":"black","text-align":"center",transform:"rotate(-10deg)"})

			//Auto destroy greybox after 700 milliseconds by fading out and finally deleting from DOM and
			//stylesheet if added
			
			setTimeout(function(){

				greyBox.fadeOut(function(){
					deleteElement($(this))
				})
			},1000)
			
		})

		$("#accordionSidebar,#idella-search").show();

		$(window).trigger(editing ? "editing" :"preview")


	}
}