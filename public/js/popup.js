var grayOver = {};

function popup(evnt){



    var popId = $(evnt.target).attr('id');

    var key = `[data-popup-for=${popId}]`;

    $("#drawSpace").css({"overflow-y":"hidden"});

    //$("*").not(key).droppable("disable")
   

    var box = $(key)

    //alert(box.attr("id"))

    var title = $(`[data-title-for=${box.attr("id")}]`)

    titleString = $(`[data-title-string-for=${title.attr("id")}]`)

   // alert(title.length)

    var closeButton = $(`[data-close-button-for=${title.attr("id")}]`)

    var sendButton = $(`[data-send-button-for=${box.attr("id")}]`)

    var cancelButton = $(`[data-cancel-button-for=${box.attr("id")}]`)

    var controlRow = $(`[data-control-row-for=${box.attr("id")}]`)

    var form = $(`[data-form-for=${box.attr("id")}]`)
   // var iFrame = $(`[data-iframe-for=${box.attr("id")}]`)

   var grayOver = $("#greybox")

    if($("#greybox").length == 0){

        grayOver = configuredTool(whichTool("div")).appendTo("body").css({
            width:$(document).width(),
            height:$(document).height(),
            position:"absolute",
            "overflow-y":"scroll",
            border:"none",
            top:0,
            left:0,
            "background-color":"rgba(0,0,0,.5)",
            "z-index":"40000"
        }).attr("id","greybox")

    }

    grayOver.removeClass("debug-border-style").droppable("disable")

   // alert(closeButton.length)
    //Do initial setup if this notification has not been created before
    if(box.length == 0){


    
        box = configuredTool(whichTool("div")).appendTo("#body").css({
                        "width":$(window).width() * .90,
                        height:$(window).height() * .90,
                        "overflow-y":"scroll",
                        "background-color":"white",
                        position:"absolute",
                        top:$(window).height() * .90,
                        left:$(window).width()/2 - $(window).width()/2/2,
                        "z-index":9999999,
                        "border-radius":"10px"

                    }).attr("data-popup-for",popId);

        form = configuredTool(whichTool("form")).attr("data-form-for",$(box).attr("id")).appendTo(box)
                    .css({width:($(window).width()*.85),height:($(window).height()*.85)});

        title = configuredTool(whichTool("div")).appendTo(box).css({
                        "width":"100%",
                        height:"15%",
                        "border-top-left-radius":"5px",
                         "border-top-right-radius":"5px",
                        "background-color":"#3275BD",
                        "box-shadow":"rgb(0, 0, 0) 1px 1px 1px 0px",
                        position:"relative",
                        top:0,
                        left:0

                    }).attr("data-title-for",box.attr("id")); 


        titleString  = configuredTool(whichTool("T")).appendTo(title).css({
                        width:"80%",
                        height:title.height() * .6,
                        "text-align":"left",
                        "color":"white",
                        "position":"absolute",
                        left:"5%",
                        "font-family":"lato",
                        "font-size":title.height() * .5,
                        top:title.height()/2 - (title.height() *.4)/2

                    }).attr("data-title-string-for",$(title).attr("id")).text("Window Title")
 
        //#034C9E  lighter blue for closeButton

        closeButton = configuredTool(whichTool("T")).appendTo(title).css({
                        "width":"10%",
                        height:"10%",
                        "text-align":"center",
                        "color":"white",
                        "position":"absolute",

                        "font-size":title.height() * .5,
                        top:title.height()/2 - (title.height() * .4)/2

                    }).attr("data-close-button-for",$(title).attr("id")).text("")
                        .append($("<div>",{class:"fa fa-window-close",icon:"fa-window-close"}))


          controlRow = configuredTool(whichTool("div")).appendTo(box).css({
                        "width":$(box).width(),
                        height:"10%",
                        "background-color":"transparent",
                        position:"absolute",
                        top:box.height()- (box.height() * .2),
                        "margin":"10px",
                        left:0
                    }).attr("data-control-row-for",$(box).attr("id"))


         sendButton = configuredTool(whichTool("T")).appendTo(controlRow).css({
                        "width":"30%",
                        height:$(box).height()*.10,
                        "text-align":"center",
                        "background-color":"silver",
                        "font-family":"lato",
                        "border-radius":"10px",
                        
                        "color":"white",
                        "position":"absolute",
                        left:$(controlRow).width()/2 - $(controlRow).width() *.4,
                        "line-height":"2",
                        "font-size":title.height() * .30
                       

                    }).attr("onhover","background-color:rgb(50, 117, 189)").attr("data-send-button-for",$(box).attr("id")).text("Save")

         cancelButton = configuredTool(whichTool("T")).appendTo(controlRow).css({
                        "width":"30%",
                        height:$(box).height()*.10,
                        "text-align":"center",
                        "background-color":"silver",
                        "font-family":"lato",
                        "border-radius":"10px",
                        
                        "color":"white",
                        "position":"absolute",
                        left:$(controlRow).width()/2 ,
                        "line-height":"2",
                        "font-size":title.height() * .30

                    }).attr("onhover","background-color:black").attr("data-cancel-button-for",$(box).attr("id")).text("Cancel")

         

    }


    var adjustedWidthPct = $(window).width() <= 700 ? .85 : .5;

    var adjustedHeightPct = $(window).height() <= 400 ? .85 : .9;

    box.css({"z-index":50000}).css({
                       // "width":$(window).width() * adjustedWidthPct,
                       // height:$(window).height()* adjustedHeightPct,
                        //"background-color":"purple",
                        position:"absolute",
                        top:($(window).height()/2 - ($(window).height()* adjustedHeightPct)/2) + window.scrollY ,
                        left:$(window).width()/2 - ($(box).width())/2
                    //Now that box has rendered.  Draw Child Elements and save positions
                    }).fadeIn(function(){

                         form.css({position:"absolute",top:title.height(),left:box.width()/2 - form.width()/2,"background-color":"rgba(3, 76, 158,.5)"})
                         form.attr("type","LIST");
                         if(!editing){
                            form.css({"background-color":"transparent"})
                         }
                         //box.children(".dropped-object").not("[data-title-string-for],[data-title-for]").appendTo(form);
                        
                         title.css({
                            "width":$(box).width(),
                            //height:"15%",
                            "border-top-left-radius":"10px",
                             "border-top-right-radius":"10px",
                           
                           
                            top:"-10px",
                            left:0

                        }).attr("data-title-for",$(box).attr("id")); 

                        closeButton.css({
                            left:$(box).width()- $(closeButton).width()*1.1,
                            height:title.height(),
                            cursor:"pointer"

                        })

                        setUpPopUpButtons();

                         

                        tStr = $(`[data-title-string-for=${title.attr("id")}]`)  

                       
                        CUSTOM_PXTO_VIEWPORT(box)

                        CUSTOM_PXTO_VIEWPORT(sendButton)
                        CUSTOM_PXTO_VIEWPORT(cancelButton)
                        CUSTOM_PXTO_VIEWPORT(titleString)
                        CUSTOM_PXTO_VIEWPORT(controlRow)
                        CUSTOM_PXTO_VIEWPORT(title)
                        CUSTOM_PXTO_VIEWPORT(closeButton)
                        CUSTOM_PXTO_VIEWPORT($("#greybox"))
                        CUSTOM_PXTO_VIEWPORT(form)
                    })
                    /*
                    if(!editing){
                            box.addClass("noborder")
                            title.addClass("noborder")
                            grayOver.addClass("noborder")
                            disableScroll();
                           
                           
                        } else {
                            box.removeClass("noborder")
                            title.removeClass("noborder")
                            grayOver.removeClass("noborder")
                            
                            
                    }*/

                       //don't allow resize of box
                    if(box.data("eventsAdded") == "on"){

                        box.resizable("disable").draggable("disable")
                        box.droppable("option","scope","dialog")
                        title.resizable("disable").draggable("disable")
                        titleString.resizable("disable")
                        closeButton.resizable("disable").draggable("disable")
                        form.draggable("disable").resizable("disable")

                        //
                        //if(box.data("resizesets") != "true"){
                            
                        box.on("resize",function(){
                            $(title).css({width:box.width()})
                            closeButton.css({left:title.width() - closeButton.width()*1.1}); 
                            //box.css({left:$(window).width()/2 - ($(window).width() * box.width())/2}) 
                            box.css({left:$(window).width()/2 - (box.width())/2})   
                        }).on("resizestop",function(){

                           CUSTOM_PXTO_VIEWPORT(title)
                           CUSTOM_PXTO_VIEWPORT(closeButton) 
                        })
                         //}

                        
                        cancelButton.on("click",function(){
                            closeButton.click();
                            cancelButton.data("clickenabled","on");
                        })

                        box.data("eventsAdded","on");
                         
                     }
                        //box.data("resizeset","true")

     

}


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null;
    window.ontouchmove = null;  
    document.onkeydown = null;  
}