<!-- begin snippet: js hide: false console: false babel: false -->

var currentX = 0;
var currentY = 0;
currentCtx = {};

OVERRIDE_CTX_MENU = true;

var ignoreDoublePasteEvent = "";
ignoreDoubleCopyEvent = ""

/*
*  Can this object be moved before or after it's sibling?
*  Currently, the criteria is "Is this object the child of a list or SELECT type"
*
*/

function objectIsReordable(obj){

    return obj.parent(".dropped-object").is("[type=LIST],[type=SELECT]") || obj.hasClass("section")
}


<!-- language: lang-js -->
$(document).on("initializationComplete",function(){

    $("[data-action]").on("mouseenter",function(){
        if(!$(this).parent().is(".mini-me")){
            $(".mini-me").hide();
        }
        
    })

    
    $("[submenu]").on("mouseenter",function(){

            var menu = $(`.${$(this).attr("submenu")}`).show();


            var mLeft = $(this).offset().left + menu.width();
            var mTop = $(this).offset().top  - $(this).height() + $("#drawSpace").scrollTop();

            log.debug(`mLeft is ${mLeft} and top is ${mTop}`)
            if(mLeft + $(".custom-menu").width() > $(document).width()){
                mLeft = $(this).offset().left - menu.width();
            }


             if(mTop + menu.height() > $(document).height() + $("#drawSpace").scrollTop()){
                mTop = mTop - menu.height() + $(this).height();
            }

            //Last Check is the menu going to overrun edit space
            if($("#editSpace").is(":visible") && mTop + menu.height() > $("#editSpace").offset().top){
                 mTop = mTop - menu.height() + $(this).height();
            }

            menu.css(
                {left:mLeft,
                    top:mTop,
                    "z-index":99999991
            })
    })




   /*
    $("[data-action=drop]").on("mouseenter",function(){
        
       
            $(this).css({"opacity":"1"})
            $(this).parent().css({"background-color":"transparent"})
            $(this).css("color","#0060FF")
            
       

        $(".mini-me").hide();

    }).on("mouseleave",function(){
        
            $(this).css({"background-color": "initial",color:"initial","opacity":".5"})
        
    })*/

   
    log.debug("CONTEXTMENU.js: Caught Initialization done event");
    // JAVASCRIPT (jQuery)

    // Trigger action when the contexmenu is about to be shown
    $(document).contextmenu( function (event) {

        $(".custom-menu").hide();

        NOTES_delete();

        //This flag is set in drawSpace.js when user hovering over editSpace area.  Just show default browser context menu
        if(!OVERRIDE_CTX_MENU){
            return;
        }


        if(DRAW_SPACE_advancedShowing ){
            log.debug("CONTEXTMENU.js: Hiding menu because user is modifying advanced settings")
            return;
        }
    
        currentCtx = CUSTOM_currentlyMousingOverElementId ? $("#"+CUSTOM_currentlyMousingOverElementId) : $(event.target)
        currentX = event.clientX;
        currentY = event.clientY;

        currentY = event.clientY + window.scrollY

       // $(document).unbind("keydown")
        // Avoid the real one
        event.preventDefault();
        event.stopPropagation();

       
        if(!editing || currentCtx.id == "body" ){
            $(".editonly").hide()
        }else {

            $(".editonly").show()
            if(!CUSTOM_lastCopyElement && localStorage.getItem('copy-buffer')){
                log.debug("I see a copy buffer");
               CUSTOM_lastCopyElement =  $(localStorage.getItem('copy-buffer'))

            }


            if(!CUSTOM_lastCopyElement){
                $("[data-action=paste]").hide()
            }
        }

        $("[data-action=drop][type=FIELD]").hide()

        $("#editSpace").is(":visible") ? $("[data-action=lessOptions]").show() 
                    && $("[data-action=moreOptions]").hide() : $("[data-action=moreOptions]").show() && $("[data-action=lessOptions]").hide()

        if(editing){

               //only show convert to scroller option for list types
            if(currentCtx.is("[type=LIST]")){
                log.debug("Showing list option")
                $("[data-action=scroller]").show()
                if(currentCtx.is("[data-form-for]")) {
                    
                    $("[data-action=drop][type=FIELD]").show()
                } 
            }
             else if( objectIsReordable(currentCtx) ){
                $("[data-action*=insert]").show();
                $("[submenu=sort-menu]").show().removeClass("greyout");          
            } else

          

        
            if(!currentCtx.parent().is("[type=LIST]")) {
                log.debug("Hiding list option")
                $("[data-action=scroller]").hide()
                //Hide Insert Sub Menus
                $("[data-action*=insert]").hide()
                //Show Insert Main Menu
                $("[submenu=sort-menu]").show().addClass("greyout");

            }



            if(currentCtx.is(".ghost")){
                $("[data-action]").not('.ghostok').hide()
                $("[data-action]").filter('.shapes div').show()

            } else {
                 $("[data-action='ghost']").show();
            }


        }
     
        //The top
        var topOff = event.pageY - window.scrollY;

        var leftPos = event.pageX;

        /*
        if( $("#editSpace").length > 0 && (event.pageY + parseFloat($(".custom-menu").height())) > $("#editSpace").offset().top){
            topOff = event.pageY - $(".custom-menu").height()
        }
        */

        var contextMenuWidth = leftPos + $(".custom-menu").width();
       
        var contextMenu = $(".custom-menu");

        log.debug(`Context Menu width is ${contextMenuWidth} and doc width ${$(document).width()} left ${leftPos} `)
        if(contextMenuWidth > $(document).width()){
            
            leftPos = leftPos - contextMenu.width()
            contextMenu.css({left:leftPos - contextMenu.width()})
        }
   
        if(topOff + contextMenu.height() > $(document).height() + $("#drawSpace").scrollTop() ){
                topOff = topOff - contextMenu.height();
        }

        //Last Check is the menu going to overrun edit space
        if($("#editSpace").is(":visible") && topOff + contextMenu.height() > $("#editSpace").offset().top){
             topOff = topOff - contextMenu.height();
        }

        // Show contextmenu
        $(".custom-menu").finish().toggle(100).
        
        // In the right position (the mouse)
        css({
            top: topOff,
            position:"fixed",
            left: leftPos,
            "z-index":10000000000
        });

         var uuid = currentCtx.attr("alias") ? currentCtx.attr("alias") : currentCtx.attr("id");
         //Show Debug Menu Information 
         //$("#menu-debug-info").text(`[${uuid}]`)

    });


    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {
     
        //$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)        
        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu").length > 0) {
            
            // Hide it
            $(".custom-menu").hide(100,function(){
                $(".mini-me").hide(200);
            });
            
        }
    });

    $(document).bind("droppedEvent",function(e){
        $(".custom-menu").hide(100)
         $(".mini-me").hide(100);
    }).on("deleteEvent",function(event,args){
        log.trace("Caught deleteEvent " + args)
        log.trace(args)
        if(args == $(currentCtx).attr("id")){
            $("#quick-edit").remove();
        } 
    })



    // If the menu element is clicked
    $("[data-action]").off("click").click(function(event){
       // $(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)
        // This is the triggered action name

        switch($(this).attr("data-action")) {

            case "moreOptions":        
         //       $("#drawSpace").css({height:"75%"})
		
                $("#editSpace").fadeIn(function(){
                    writeTabs(currentCtx)
                    //Unlock this element               
                    $(".fa-lock").first().click();
                })
		

            break;

            case "lessOptions":
                $("#drawSpace").css({height:$(document).height()});
                $("#editSpace").css("transtion-duration","0.6s").fadeOut();
                
            break;
            // A case for each action. Your actions here
            case "first": alert("first"); break;
            case "insertBefore": 
                        //alert('inserting before ' + currentCtx.attr("id"))
                        //currentCtx.insertBefore(currentCtx.prevAll(":not(.ui-resizable-handle)").first())
                        currentCtx.insertBefore(currentCtx.prev());
                        if(currentCtx.is("[type=FIELD]")){

                            var isGroupContainer = currentCtx;

                            //For special Form Field types, do more processing before returning here.
                            //trigger CUSTOM_ON_RESIZE_GROUP_CONTAINER
                        
                            isGroupContainer.trigger("resizestop",[{element:isGroupContainer,
                                width:isGroupContainer.height(),width:isGroupContainer.width()}])
                            
                        } else {
                            CUSTOM_PXTO_VIEWPORT(currentCtx)
                        }  
                        //Unlock this element               
                        $(".fa-lock").first().click();
                        break;
             case "insertAfter": 
                        //currentCtx.insertAfter(currentCtx.nextAll(":not(.ui-resizable-handle)").first())
                        currentCtx.insertAfter(currentCtx.next());
                        if(currentCtx.is("[type=FIELD]")){

                            var isGroupContainer = currentCtx;

                            //For special Form Field types, do more processing before returning here.
                            //trigger CUSTOM_ON_RESIZE_GROUP_CONTAINER
                        
                            isGroupContainer.trigger("resizestop",[{element:isGroupContainer,
                                width:isGroupContainer.height(),width:isGroupContainer.width()}])
                           
                        } else {
                            CUSTOM_PXTO_VIEWPORT(currentCtx)
                        }
                       
                        //Unlock this element               
                        $(".fa-lock").first().click();
                      
                        break;
            case "drop": 
                        var aTool =  whichTool($(this).attr("type"));

                        aTool = configuredTool(aTool);

                        if(aTool.is("[type=NAVIGATION]")){
                            aTool.addClass("navigation-list");
                            setUpDiv(aTool);
                        }

                         currentCtx = CUSTOM_currentlyMousingOverElementId ? $("#"+CUSTOM_currentlyMousingOverElementId) : $(event.target)
                         
                         currentY = event.clientY + window.scrollY

                        

                        dropTool(aTool,{target:currentCtx,clientX:currentX,clientY:currentY});
                        
                        if(aTool.is("[type=NAVIGATION]")){
                            aTool.css({width:"100%",height:"150px"});
                            for(i=0;i<2;i++){
                                var item = configuredTool(whichTool("T"));
                                item.html("menu "+(i+1));
                                aTool.append(item);
                                item.addClass("menutext")
                                item.css({height:"30px",display:"inline-block","position":"relative","text-align":"center"})
                                item.attr("onhover","background-color:navy;color:white")
                              
                                setUpDiv(item);

                                CUSTOM_PXTO_VIEWPORT(item,item.offset().left,item.offset().top)
                            } 

                            //now convert to regular list for simplicity.
                            //Note IF Condition will be skipped because we are already in this IF statement. Ugly code
                            //but saves lines of code later
                            aTool.attr("type","LIST").addClass("navigation-list");


                            

                        } else
                        //add helpers
                        if(aTool.is("[type=LIST]")){

                            //add cntrl-s
                            aTool.css("width",aTool.width()*2)

                            var left = whichTool("DIV");
                            left = configuredTool(left);
                            left.css({"width":"25px","background-color":"black",opacity:".3"}).attr('alias',"cntrl-left")
                                .attr("onhover","opacity:1")
                             dropTool(left,{target:aTool,clientX:currentX,clientY:currentY});
                 

                            var right = whichTool("DIV");
                            right = configuredTool(right);
                            right.css({"width":"25px","background-color":"black",opacity:".3"}).attr('alias',"cntrl-right")
                                .attr("onhover","opacity:1")
                            dropTool(right,{target:aTool,clientX:currentX,clientY:currentY});
                           
                            var limit = 8;
                            var whiteSpace = "nowrap";

                            if($(this).hasClass("adaptive")){
                                limit = 4;
                            }

                            for(i=0; i < limit; i++){
                                var bImg = whichTool("IMG")
                                bImg = configuredTool(bImg);
                                if($(this).hasClass("adaptive")){
                                    bImg.css({"height":"120px","width":"120px"})
                                }
                               
                                aTool.append(bImg);
                                CUSTOM_PXTO_VIEWPORT(bImg,bImg.offset().left,bImg.offset().top)
                            }
                        
                           CUSTOM_PXTO_VIEWPORT(aTool,aTool.offset().left,aTool.offset().top)
                           
                        } else if(aTool.is("[type=FIELD]")){
                            if(aTool.attr("type") == "FIELD"){
                                //alert("Calling group container ")
                               setUpGroupContainer(aTool,true);
                               //Trigger input on label so that the placeholder is set for the control
                               aTool.find("[class*=-label]").css({"font-family":"lato"}).trigger("input")
                               aTool.trigger("dragstop");
                             }

                        } else if(aTool.is("[type=AUDIO]")){
    
                            Equalizer.initJS(8,5);

                        }


                        if($(event.target).parents("[data-action]").first().is("[archType]")){
                            var archType = $(event.target).parents("[data-action]").first().attr("archType")
                            addIdellaClassToElement("idella",`.${archType}`,aTool)
                           CUSTOM_PXTO_VIEWPORT(aTool)
                        }



                        /*
                        if(aTool.is("[type=T]")){
                            aTool.off("click")
                            .on("click",function(){
                                        $(this).attr("contenteditable","true"); 
                                        $(document).unbind("keydown",CUSTOM_KEYDOWN_LOGIC);
                                        $(this).focus();
                            }).on("mouseleave",function(){
                                        $(this).attr("contenteditable","false"); 
                                        $(document).bind("keydown",CUSTOM_KEYDOWN_LOGIC)
                                        //Do some parsing logic for fontawesome txt
                                        $(this).contents().filter(function() { 
                                    //Node.TEXT_NODE === 3
                                    return (this.nodeType === 3);
                                }).each(function () {
                                    // for each text node, do something with this.nodeValue
                                    
    
                                     //   const regex = /((fa-\w+)(?:-\w+)?)/igm;

                                     //   const subst = `<div icon="$1" class="fa $1"></div>`;

                                        //alert($(div).html())
                                        //this.nodeValue = (this.nodeValue.replace(regex,subst))
                                      //  $(this).replaceWith(this.nodeValue.replace(regex,subst))

                                    
                                });
                            }).on("input",function(){

                            })  
                        }*/

                        aTool.css("font-family","inherit")

                        if(aTool.is("[type=T]")){
                            aTool.css({"text-align":"center"});
                        }

                        currentCtx = aTool;
                        //Unlock this element               
                        $(".fa-lock").first().click();
                        break;
                        
                    
            case "ghost": GHOST_setUpElement($(currentCtx),event)
            break;
            /* Not needed. Called from DELETE case
            case "unghost": GHOST_delete($(currentCtx))
            break;*/
            case "addoverlay":
                overlay = OVERLAY_setUp($(currentCtx))
                currentCtx = overlay;
                //Unlock this element               
                $(".fa-lock").first().click();
                break;
            case "addsection":
                 var aTool =  whichTool("DIV");
                        aTool = configuredTool(aTool);
                        aTool.addClass("section")
                            .css({
                                width:$("#content").width(),
                                height:"700px",
                                position:"relative",
                                display:"inline-block",
                                "background-image": "linear-gradient(navy, white)"
                                //"background-color":"transparent"

                            });

                       // h1 = $("<h1>",{"font-color":"white"}).text("Drop Content Here")

                        //aTool.append(h1);
                        
                        //$("#drawSpace").append(aTool);
                        if($(".section").length == 0){
                            //dropTool(aTool,{target:$("#content"),clientX:0,clientY:0});
                            $("#content").append(aTool);
                        } else {
                            $("#content").attr("type","LIST");
                            $("#content").append(aTool);
                            //dropTop = $("#content").find(".section").last().offset().top+ $("#content").find(".section").last().height();
                            //dropLeft =  dropX = $("#content").find(".section").last().offset().left;
                            //dropTool(aTool,{target:$("#content"),clientX:0,clientY:0});
                        }
                        var total = 0;
                        $("#content").find(".section").each((idx,obj)=>{
                            log.debug(idx)
                             total += $(obj).height();
                        })
                        $("#content,body").css("height",total + 50);
                        updateLayersTool($(aTool).attr("id"));
                        setUpDiv(aTool);
                        console.log(`Expanded is Content body width is ${$("#content").width()}`)
                        CUSTOM_PXTO_VIEWPORT(aTool);
                        break;

            case "edit": 
                $("#quick-edit").remove();
                writeFields(currentCtx); 
                //Unlock this element               
                $(".fa-lock").first().click();
                break;
            case "copy": if(currentCtx.attr("type") != "canvas"){

                    if(ignoreDoubleCopyEvent == $(currentCtx).attr("id")){
                        return;
                    }

                    CUSTOM_lastCopyElement = recursiveCpy(currentCtx);


                    ignoreDoubleCopyEvent = $(currentCtx).attr("id");
                    
                    op = $(currentCtx).css("opacity");
                  
                    //Unlock this element               
                    $(".fa-lock").first().click();

                    $(currentCtx).animate({opacity:.3},600,"swing",function(){
                        $(currentCtx).css({opacity:op});
                        
                        var str = $(CUSTOM_lastCopyElement).clone().wrap('<div>').parent().html();
                        localStorage.setItem('copy-buffer',str)                        
                    });


                } 
                break;
            case "paste": if(currentCtx.hasClass("dropped-object"))
                { 
                    /*
                    if(ignoreDoublePasteEvent == CUSTOM_lastCopyElement){
                        return;
                    }


                    ignoreDoublePasteEvent = CUSTOM_lastCopyElement;


                    log.debug(`Pasted ${$(CUSTOM_lastCopyElement).attr("id")}`);



                    c = recursiveCpy(CUSTOM_lastCopyElement) ;  


                     if(c.attr("type") == "LIST"){
                         c.css("transition-duration","0s")
                    }
                    */
                   
                    c = $(localStorage.getItem("copy-buffer"));

                    
                    c = $(c[0].outerHTML.replace(/id="(\w+_\d+)"/gm,function(oldId){

                        log.debug(`Old Id is ${oldId}`)
                        var numberPart = oldId.replace(/"/g,"").substring(oldId.indexOf("_"));
                        log.debug(`Nubmer Part is ${numberPart}`)
                        var backwardsNumber = parseInt(Array.from(numberPart).reverse().join(""));
                        log.debug(`Nubmer Part Reversed is ${backwardsNumber}`)
                        backwardsNumber = backwardsNumber + (Math.ceil(Math.random() * 10) );
                        log.debug(`Final Id is ${backwardsNumber}`)
                        return `id="ELEM_${backwardsNumber}"`;

                    }));


                    log.debug(`WHAT New ID is ${c.attr("id")}`)

                    

                    c.find(".ui-resizable-handle, .widget-on, .widget-off").remove();

                    c = setUpDiv(c);

                    c.find(".dropped-object").each(function(idx){setUpDiv(this)});

                    if(c.is("[type=OVERLAY]")){
                        c.css({left:0,top:0,"width":currentCtx.width(),"height":currentCtx.height()})
                        c.attr('overlay-for',"#" + currentCtx.attr("id"));
                        currentCtx.attr("overlay",c.attr("id"));
                    }

                    CUSTOM_PXTO_VIEWPORT(c);

                    if(currentCtx.is("[type=LIST]")){
                         c.insertAfter(currentCtx.children(".dropped-object").last()).css({top:0,left:0});
                    } else {
                         c.appendTo(currentCtx).css(
                        {top:myPage.Y - currentCtx.offset().top - ($(".custom-menu").height()/2),left:myPage.X - currentCtx.offset().left }
                        );

                    }
                    
                   
                    //reloadLayers();
                    //CUSTOM_PXTO_VIEWPORT($(c),$(c).position().left ,$(c).position().top); 

                     if(c.attr("type") == "LIST"){
                        // SLIDER_init(c)
                    }
                    //alert(myPage.Y) 
                } 
                //Unlock this element               
               // $(".fa-lock").first().click();
                break;

       

            case "resize": $(".template").click();break;
            case "javascript": if(currentCtx.attr("type") != "canvas"){   
                    log.debug(`Current Context greg is ${$(currentCtx).attr("id")}`);

                    MAKE_JAVASCRIPT_BOX_for (currentCtx)     
                    //NOTES_delete();
                    //$("#editSpace").mouseleave();
                    //remove submenu class because we don't need it anymore
                    /* 
                $( ".adialog" ).data({"theClickedElement":$(hotObj),"actionType":$(this).attr("data-action")});
                    currentCtx.removeClass("submenu")
                //Signal open and set title
                $( "#jsdialog" ).dialog( "open" ).dialog("option","title","Enter Javascript for element #" 
                        + $(hotObj).attr("id"));
                    
                    }*/
                }
                    break;
           
            case "fulledit": hotObj = $(currentCtx);
                if($(this).html().indexOf("Open Inspector...") > -1 ){
                        $("#drawSpace").css({height:"70%","overflow-y":"scroll"});
                        $("#editSpace").css({height:"30%","overflow-y":"scroll"})
                        writeTabs(currentCtx); 

                        //Unlock this element               
                        $(".fa-lock").first().click();
                        $(this).html("Close Inspector")
                } else {
                        $(this).html("Open Inspector...")
                        $("#drawSpace").css({height:"100%","overflow-y":"none"});
                        $("#editSpace").css({height:"0%","overflow-y":"none"}) 
                }

                break;  
                // $(currentCtx).find("img")[0].click();break;
            case "preview": CUSTOM_pressEscapeKey(); closeMenu(); PREVIEW_togglePreview(editing);  break;
            case "delete": if(currentCtx.attr("type") != "canvas"){if(currentCtx.is(".ghost")){GHOST_delete(currentCtx)};deleteWithPrompt(currentCtx,true); NOTES_delete();} break;
            case "scroller": convertToScroller(); 
                  //Unlock this element               
                    $(".fa-lock").first().click();
                    break;
        }
      
        $(window).trigger(editing ? "editing" :"preview")

        
        
        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
       // $(".mini-me").hide(100);
      });

})

function convertToScroller(){

        currentCtx.attr("slider-container",currentCtx.attr("id"));

        currentCtx.attr("slider-direction","left");

        currentCtx.attr("slider-auto-slide",true)

        log.warn("Finished setting up LIST " + currentCtx.attr("id") + " for conversion.  Sending click event")

        $.event.trigger("genericSliderReady",[]);

}

function writeFields(){

     //write quick-edit fields

        var fields = [],locations = []

        var topLeft = {top:currentCtx.offset().top + (currentCtx.height() > 60 ? 0 : 60),left:currentCtx.offset().left,position:"absolute","z-index":"30000"}
        var topRight = {top:currentCtx.offset().top + (currentCtx.height() > 60 ? 0 : 60), left:currentCtx.offset().left + currentCtx.width() - (360 > currentCtx.width() ? 0 : 180 ),position:"absolute","z-index":"30000"};
        var midLeft = {top:currentCtx.offset().top + currentCtx.height()/2 + (currentCtx.height() > 60 ? 0 : 120),left:currentCtx.offset().left,position:"absolute","z-index":"30000"}
        var midRight = {top:currentCtx.offset().top + currentCtx.height()/2 + (currentCtx.height() > 60 ? 0 : 120),left:currentCtx.offset().left + currentCtx.width() - (360 > currentCtx.width() ? 0 : 180 ),position:"absolute","z-index":"30000"}
        var bottomLeft = {top:currentCtx.offset().top + currentCtx.height() + (currentCtx.height() > 60 ? 0 : 180),left:currentCtx.offset().left,position:"absolute","z-index":"30000"}
        var bottomRight = {top:currentCtx.offset().top + currentCtx.height() + (currentCtx.height() > 60 ? 0 : 180), left:currentCtx.offset().left + currentCtx.width() - (360 > currentCtx.width() ? 0 : 180 ),position:"absolute","z-index":"30000"};
        var extraBottomLeft = {top:currentCtx.offset().top + currentCtx.height() + 40 + (currentCtx.height() > 60 ? 0 : 240),left:currentCtx.offset().left,position:"absolute","z-index":"30000"}
        var extraBottomRight = {top:currentCtx.offset().top + currentCtx.height() + 40 + (currentCtx.height() > 60 ? 0 : 240), left:currentCtx.offset().left + currentCtx.width() - (360 > currentCtx.width() ? 0 : 180 ),position:"absolute","z-index":"30000"};
        
        locations.push(topLeft)
        locations.push(topRight)
        locations.push(midLeft)
        locations.push(midRight)
        locations.push(bottomLeft)
        locations.push(bottomRight)
        locations.push(extraBottomLeft)
        locations.push(extraBottomRight)


        fields[fields.length] = $("<input>",{value:"Alias:" + $(currentCtx).attr("alias"),label:"alias",class:"editonly"})

       



        if(!$(currentCtx).is("[type=T],[type=VID]") ){
            fields[fields.length] = $("<input>",{value:"Enter background-image",label:"background-image",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"Enter background color",label:"background-color",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"Enter font family",label:"font-family",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"Text color:"+$(currentCtx).css("color"),label:"color",class:"editonly"})

        } else if(!$(currentCtx).is("[type=VID]")){
            fields[fields.length] = $("<input>",{value:"Enter font family",label:"font-family",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"Enter font weight",label:"font-weight",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"Text color:"+$(currentCtx).css("color"),label:"color",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"Text transform:"+$(currentCtx).css("text-transform"),label:"text-transform",class:"editonly"})
        }

        if($(currentCtx).is("[type=ICON]")){
             fields[fields.length] = $("<input>",{value:"Enter Font Awesome Class",label:"class",class:"editonly"})
        }

        if($(currentCtx).is("[type=BTN]")){
             fields[fields.length] = $("<input>",{value:"Enter Scroller ID",label:"slider-container",class:"editonly"})
             fields[fields.length] = $("<input>",{value:"Enter Scroller Direction",label:"slider-direction",class:"editonly"})
        }

        if($(currentCtx).is("[type=VID],[type=IMG]")){
            fields[fields.length] = $("<input>",{value:"source:"+$(currentCtx).find(".content-image").attr("src"),label:"src",class:"editonly"})
        }

        if($(currentCtx).is("[type=VID]")){
            fields[fields.length] = $("<input>",{value:"autoplay:"+$(currentCtx).find("video").attr("autoplay"),label:"autoplay",class:"editonly"})
            fields[fields.length] = $("<input>",{value:"loop:"+$(currentCtx).find("video").attr("loop"),label:"loop",class:"editonly"})
        }
log.debug("CONTEXTMENU.js: I am writing fields of length " + fields.length)
        //fields[fields.length] = $("<label>",{text:"Edit Fields Like Me"}).append($("<input>",{type:"checkbox",name:"likeme",class:"editonly"}) )
        //fields[fields.length] = $("<label>",{text:"Edit Additional Fields"}).append($("<input>",{type:"checkbox",name:"additional",class:"editonly"}) )
        fields[fields.length] = $("<input>",{type:"button",value:"done",label:"background-color",class:"editonly"}).on("click",function(){
            $.event.trigger("deleteEvent",[$(currentCtx).attr("id")])
           // $(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)
            CUSTOM_PXTO_VIEWPORT($(currentCtx),$(currentCtx).position().left ,$(currentCtx).position().top);
        }).css({"background-color":"green","color":"white"})
        form = $("<form>",{id:"quick-edit","position":"absolute"})

        

        for(f=0; f < fields.length; f++){
            log.debug("CONTEXTMENU.js: Putting field at location")
            log.debug(locations[f])
            $(fields[f]).css(locations[f]).attr("currentCtx",$(currentCtx).attr("id"))            
            form.append(fields[f]);
        }
      //find top right
        

        $(body).append(form);

        $("#quick-edit input").on('input',function(evnt){
                //evnt.preventDefault();
                label = $(evnt.target).attr("label")

                if(label == "class"){
                    //do nothing.  wait until class is complete
                    //$(currentCtx).addClass($(evnt.target).val())
                    $(currentCtx).attr("user-classes",$(event.target).val())   
                } else if(label == "autoplay" || label == "loop"){

                    (currentCtx).find("video").attr(label,$(evnt.target).val() == "true")

                }else if(label == "src" || label == "align" ){

                    $(currentCtx).find(".content-image").attr(label,$(evnt.target).val())
                    //https://www.uvm.edu/~bnelson/computer/html/wrappingtextaroundimages.html
                    if(label == "align"){
                        $(currentCtx).find("br").attr(clear,$(evnt.target).val())
                    }
                    

                }  else if(label.startsWith("font") || label.startsWith("text")){
                     $(currentCtx).find("[type]").css(label,$(evnt.target).val())  
                } else if(label == "color"){
                    $(currentCtx).css({"-webkit-text-fill-color":$(evnt.target).val(),"color":$(evnt.target).val()})
                    $(currentCtx).find("[type]").css("-webkit-text-fill-color",$(evnt.target).val())                 
                    
                } else {

                    var theValue = $(evnt.target).val();

                    if(label == "background-image" && !theValue.startsWith("url(")){

                        theValue = "url(" + theValue + ")"

                        $(currentCtx).css("background-size","cover")

                    }

                    //if this is a custom css option. ie how we define components, write as attribute
                    if(!$(currentCtx).css(label)){
                        $(currentCtx).attr(label,theValue)
                    } else {
                    $(currentCtx).css(label,theValue)
                    //if this is a custom css option. ie how we define components, write as attribute
                    }
                }
                log.trace("Firing : " + label + " ==> " + $(evnt.target).val())
                log("Webkit : " + $(currentCtx).css("-webkit-text-fill-color"))

                if($(".changesToggle").is(":checked")){
                    log.trace("Style is checked ")
                    //myStyle = CONVERT_STYLE_TO_CLASS_OBJECT($(currentCtx))
                    myStyle = {}
                    myStyle[label] = $(evnt.target).val()
                    log.trace(myStyle)
                    //delete myStyle.top;
                    //delete myStyle.left;
                    log.trace("I see this many copies of " + $(currentCtx).attr("id") + " : " + $("[extends='"+$(currentCtx).attr("id")+ "']").not($(currentCtx)).length)
                    //Any copies of this currentCtx
                    $("[extends='"+$(currentCtx).attr("id")+ "']").not($(currentCtx)).css(myStyle);

                    //Any copies currently being edited

                    //copy to others just in case we are editing a copy
                    originalParentId = $(currentCtx).attr("extends");

                    $("[extends='"+originalParentId+"']").not($(currentCtx)).css(myStyle);

                    //Copy to currentCtx in case we are editing a copy and not the currentCtx directly
                    $("#"+originalParentId).css(myStyle)

                    copiesModified = true;
                }
        }).on("change",function(evnt){
            //$(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
          //  $(document).unbind("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)
            //only used to write class info here.  Everything else should use on.input
            if(label == "class" && $(currentCtx.attr("user-classes") && $(currentCtx).attr("user-classes").trim().length > 0)){
                //$(currentCtx).attr("class",$(currentCtx).attr("user-classes"))
                $(currentCtx).attr("class",$(currentCtx).attr("class").replace(/fa-[^fw]\S+/g,$(currentCtx).attr("user-classes") ) )
                //$(currentCtx).removeAttr("user-classes")
            }

            if(label == "slider-auto-slide"){
                $.event.trigger("genericSliderReady",[$(event.target)])
            }

            if($(currentCtx).is("[type=VID]")){
                $(currentCtx).find("video")[0].load()
            }

        }).on("click",function(event){
            $(document).unbind("keydown")
            $(this).attr("value","")
            
        }).on("mouseleave",function(){
            log.debug(`Leaving the writeFields field`);
             $(document).unbind("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)
        })

        $("#quick-edit input")[0].focus();


}
