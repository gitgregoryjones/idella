var grayOver = {};

function popup(evnt){



    var popId = $(evnt.target).attr('id');

    var key = `[data-popup-for=${popId}]`;

    $("#drawSpace").css({"overflow-y":"hidden"});

    //$("*").not(key).droppable("disable")
   

    var box = $(key)

    //alert(box.attr("id"))

    var title = $(`[data-title-for=${box.attr("id")}]`)

   // alert(title.length)

    var closeButton = $(`[data-close-button-for=${title.attr("id")}]`)

   // alert(closeButton.length)
    //Do initial setup if this notification has not been created before
    if(box.length == 0){

        
        
        box = configuredTool(whichTool("div")).appendTo("#body").css({
                        "width":$(window).width()/2,
                        height:$(window).height()/2,
                        "background-color":"white",
                        position:"absolute",
                        top:$(window).height()/2 - $(window).height()/2/2,
                        left:$(window).width()/2 - $(window).width()/2/2,
                        "z-index":9999999,
                        "border-radius":"10px"

                    }).attr("data-popup-for",popId); 

        title = configuredTool(whichTool("div")).appendTo(box).css({
                        "width":"100%",
                        height:"15%",
                        "border-top-left-radius":"10px",
                         "border-top-right-radius":"10px",
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
                        top:title.height()/2 - (title.height() * .8)/2

                    }).attr("data-title-string-for",$(title).attr("id")).text("Window Title")
 
        //#034C9E  lighter blue for closeButton

        closeButton = configuredTool(whichTool("T")).appendTo(title).css({
                        "width":"10%",
                        height:"10%",
                        "text-align":"center",
                        "color":"white",
                        "position":"relative",
                        left:"100%",

                        "font-size":title.height() * .8,
                        top:title.height()/2 - (title.height() * .8)/2

                    }).attr("data-close-button-for",$(title).attr("id")).text("")
                        .append($("<div>",{class:"fa fa-window-close",icon:"fa-window-close"}))


         

    }


   

    if($("#greybox").length == 0){

    grayOver = configuredTool(whichTool("div")).appendTo("body").css({
        width:$(document).width(),
        height:$(document).height(),
        position:"absolute",
        "overflow-y":"scroll",
        top:0,
        left:0,
        "background-color":"rgba(0,0,0,.5)",
        "z-index":"40000"
    }).attr("id","greybox").droppable("destroy")

    }

    var adjustedWidthPct = $(window).width() <= 700 ? .85 : .5;

    var adjustedHeightPct = $(window).height() <= 400 ? .85 : .5;

    box.css({"z-index":50000}).css({
                        "width":$(window).width() * adjustedWidthPct,
                        height:$(window).height()* adjustedHeightPct,
                        position:"absolute",
                        top:$(window).height()/2 - ($(window).height()* adjustedHeightPct)/2,
                        left:$(window).width()/2 - ($(window).width() * adjustedWidthPct)/2

                    }).fadeIn();



    title.css({
                        "width":"100%",
                        height:"15%",
                        "border-top-left-radius":"10px",
                         "border-top-right-radius":"10px",
                       
                       
                        top:0,
                        left:0

                    }).attr("data-title-for",$(box).attr("id")); 



     closeButton.css({
                        width:closeButton.css("font-size"),
                        height:$(closeButton).css("font-size"),
                        "text-align":"center",
                        
                        position:"relative",
                        left:title.width() - closeButton.width()*1.4,
                        cursor:"pointer",
                        "font-size":title.height() * .8,
                        top:title.height()/2 - (title.height() * .8)/2

                    })


     if(closeButton.data("clickset") != "true"){
        closeButton.on("click",function(){
            $(box).hide();
            enableScroll(); 
            $("#greybox").remove();
            $("#drawSpace").css({"overflow-y":"hidden"});
        })
     }


     closeButton.data("clickset","true")

    setUpDiv($(box))


    CUSTOM_PXTO_VIEWPORT(title,$(title).position().left,$(title).position().top)

    tStr = $(`[data-title-string-for=${title.attr("id")}]`)

    CUSTOM_PXTO_VIEWPORT(tStr,$(tStr).position().left,$(tStr).position().top)

    CUSTOM_PXTO_VIEWPORT($("#greybox"),$("#greybox").position().left,$("#greybox").position().top)

    

    if(!editing)
    disableScroll();

    
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