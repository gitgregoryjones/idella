<!-- begin snippet: js hide: false console: false babel: false -->

var currentX = 0;
var currentY = 0;
var currentCtx = {};



<!-- language: lang-js -->
$(document).on("initializationComplete",function(){

    $("[data-action=drop]").css("opacity",".50")

   
    $("[data-action=drop]").on("mouseenter",function(){
        
        $(this).css({"opacity":"1"})
        $(this).parent().css({"background-color":"white"})


    }).on("mouseleave",function(){
        
        $(this).css({"background-color": "initial",color:"initial","opacity":".5"})
    })

   
    log.debug("CONTEXTMENU.js: Caught Initialization done event");
    // JAVASCRIPT (jQuery)

    // Trigger action when the contexmenu is about to be shown
    $(document).bind("contextmenu", function (event) {


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
                console.log("I see a copy buffer");
               CUSTOM_lastCopyElement =  $(localStorage.getItem('copy-buffer'))

            }


            if(!CUSTOM_lastCopyElement){
                $("[data-action=paste]").hide()
            }
        }

        if(editing){

               //only show convert to scroller option for list types
            if(currentCtx.is("[type=LIST]")){
                log.debug("Showing list option")
                $("[data-action=scroller]").show()
            } else {
                log.debug("Hiding list option")
                $("[data-action=scroller]").hide()
            }

            if(currentCtx.is(".ghost")){
                $("[data-action]").not('.ghostok').hide()
                $("[data-action]").filter('.shapes div').show()

            } else {
                 $("[data-action='ghost']").show();
            }
        }
     

   
        // Show contextmenu
        $(".custom-menu").finish().toggle(100).
        
        // In the right position (the mouse)
        css({
            top: event.pageY - window.scrollY,
            position:"fixed",
            left: event.pageX,
            "z-index":10000000000
        });
       
    

    });


    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {

        
        //$(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)
        
        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu").length > 0) {
            
            // Hide it
            $(".custom-menu").hide(100);
        }
    });

    $(document).bind("droppedEvent",function(e){
        $(".custom-menu").hide(100)
    }).on("deleteEvent",function(event,args){
        log.trace("Caught deleteEvent " + args)
        log.trace(args)
        if(args == $(currentCtx).attr("id")){
            $("#quick-edit").remove();
        } 
    })



    // If the menu element is clicked
    $("[data-action]").click(function(event){
       // $(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)
        // This is the triggered action name
        switch($(this).attr("data-action")) {
            
            // A case for each action. Your actions here
            case "first": alert("first"); break;
            case "drop": 
                        var aTool =  whichTool($(this).attr("type"));
                        aTool = configuredTool(aTool);
                        dropTool(aTool,{target:$("#drawSpace"),clientX:currentX,clientY:currentY});
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
                        
                            aTool.addClass("gallery");
                            aTool.css("height",aTool.height() * 1.25);
                            aTool.css("white-space",whiteSpace);
                            duration = (aTool.css("transition-duration"))
                
                            duration = parseFloat(duration) == 0 ? "0.6s" : duration;
                            aTool.css({overflow:"hidden","transition-duration":duration})
                            
                            SLIDER_init(aTool);

                            if($(this).hasClass("adaptive")){
                                aTool.removeClass("gallery");
                                aTool.css("white-space","normal");
                                aTool.css({overflow:"auto","transition-duration":"0s"})
                                SLIDER_deInit(aTool);
                                aTool.css({"overflow":"visible",
                                    "width":aTool.children("[type=IMG]").first().width()*2.25, "height":aTool.children("[type=IMG]").first().height()*2.25})
                                
                                right.remove();
                                left.remove();
                            }
                           
                        }


                        break;
                        
                    
            case "ghost": GHOST_setUpElement($(currentCtx),event)
            break;
            /* Not needed. Called from DELETE case
            case "unghost": GHOST_delete($(currentCtx))
            break;*/
            case "addoverlay":
                OVERLAY_setUp($(currentCtx))
                break;
            case "addsection":
                 var aTool =  whichTool("DIV");
                        aTool = configuredTool(aTool);
                        //$("#drawSpace").append(aTool);
                        var lastChildTop = 0;
                        var lastChildHeight = 0;
                        $(currentCtx).children(".dropped-object").each(function(idx,child){
                            child = $(child);
                            if(child.offset().top > lastChildTop){
                                lastChildTop = child.offset().top + child.height();
                                //lastChildHeight = child.height();
                            }
                        })
                        
                        $(aTool).css({"height":"300px","width":"100%","background-color":"#F0F0F0"})
                        dropTool(aTool,{target:$(currentCtx),clientX:0,clientY:lastChildTop});
                        if(!currentCtx.is(["type=LIST"])){
                            aTool.css("top",lastChildTop);
                        }else {
                            aTool.css("top",0);
                        }
                        $("#drawSpace").animate({
                            scrollTop: $(aTool).offset().top
                        }, 1000);
                        break;

            case "edit": 
                $("#quick-edit").remove();
                writeFields(currentCtx); 

                break;
            case "copy": if(currentCtx.attr("type") != "canvas"){
                    CUSTOM_lastCopyElement = recursiveCpy(currentCtx);
                    op = $(currentCtx).css("opacity");
                     
                     //var myClass = CONVERT_STYLE_TO_CLASS_OBJECT($(CUSTOM_lastCopyElement));
                     //copy = $(CUSTOM_lastCopyElement).clone(true);
                     //var myClass = CONVERT_STYLE_TO_CLASS_OBJECT(CUSTOM_lastCopyElement);
                     //CUSTOM_lastCopyElement.css(myClass);

                     var str = $(CUSTOM_lastCopyElement).clone().wrap('<div>').parent().html();
                    $(currentCtx).css("opacity","0");
                    $(currentCtx).animate({opacity:op},600)
                   
                    console.log(str);

                    localStorage.setItem('copy-buffer',str)

                } break;
            case "paste": if(currentCtx.hasClass("dropped-object"))
                { 
                    c = recursiveCpy(CUSTOM_lastCopyElement) ;  
                    c.appendTo(currentCtx).css(
                        {top:myPage.Y - currentCtx.offset().top - ($(".custom-menu").height()/2),left:myPage.X - currentCtx.offset().left }
                    );

                    if(c.is("[type=OVERLAY]")){
                        c.css({left:0,top:0,"width":currentCtx.width(),"height":currentCtx.height()})
                        c.attr('overlay-for',"#" + currentCtx.attr("id"));
                        currentCtx.attr("overlay",c.attr("id"));
                    }

                    CUSTOM_PXTO_VIEWPORT($(c),$(c).position().left ,$(c).position().top); 

                    //alert(myPage.Y) 
                } 
                break;

       

            case "resize": $(".template").click();break;
            case "javascript": if(currentCtx.attr("type") != "canvas"){         
                    //remove submenu class because we don't need it anymore
                $( ".adialog" ).data({"theClickedElement":$(hotObj),"actionType":$(this).attr("data-action")});
                    currentCtx.removeClass("submenu")
                //Signal open and set title
                $( "#jsdialog" ).dialog( "open" ).dialog("option","title","Enter Javascript for element #" 
                        + $(hotObj).attr("id"));

                    }break;
           
            case "fulledit": hotObj = $(currentCtx);
                if($(this).html().indexOf("Open Inspector...") > -1 ){
                        $("#drawSpace").css({height:"70%","overflow-y":"scroll"});
                        $("#editSpace").css({height:"30%","overflow-y":"scroll"})
                        writeTabs(currentCtx); 


                        $(this).html("Close Inspector")
                } else {
                        $(this).html("Open Inspector...")
                        $("#drawSpace").css({height:"100%","overflow-y":"none"});
                        $("#editSpace").css({height:"0%","overflow-y":"none"}) 
                }           
                break;  
                // $(currentCtx).find("img")[0].click();break;
            case "preview": CUSTOM_pressEscapeKey(); PREVIEW_togglePreview(editing);  break;
            case "delete": if(currentCtx.attr("type") != "canvas"){if(currentCtx.is(".ghost")){GHOST_delete(currentCtx)};deleteElement(currentCtx,true); NOTES_delete();} break;
            case "scroller": convertToScroller(); break;
        }
      
        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
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
            console.log(locations[f])
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
            $(document).off("keydown",CUSTOM_KEYDOWN_LOGIC);
            $(document).on("keydown",CUSTOM_KEYDOWN_LOGIC)
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
        })

        $("#quick-edit input")[0].focus();


}
