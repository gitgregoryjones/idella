var grayOver = {};

$(window).on("previews",function(){
    
     $("form").removeClass("editing")

     $("textarea").each(function(idx,it){
        TEXTAREA_init(it)
     })

     $(".group-container").each(function(idx,it){
        it = $(it);
        
        it.removeClass("editing")
        
        if(it.resizable("instance")){
            it.resizable("destroy");
        }
        if(it.draggable("instance")){
            it.draggable("destroy");
        }
    })


})

$(window).on("editing",function(){
    
    //$("form").addClass("editing")

    /*
    $("textarea").each(function(idx,it){
        TEXTAREA_init(it)
     })

    $(".group-container").each(function(idx,it){
        $(it).addClass("editing");
       setUpGroupContainer($(it),true);
    })*/
   
})

var times = [];
function lap(step){
    
    if(times.length > 0){
        var last =times[times.length-1];
        var currMeasure = new Date().getTime();
        var curr = {step:step,time:new Date().getTime(),stepElapsed:currMeasure - last.time, totalElapsed:currMeasure - times[0].time  }
        times.push(curr);
    } else{
        times.push({step:step,time:new Date().getTime(),totalElapsed:0})
    }

   
}

function report (){
   
    console.log(`Good times \n ${JSON.stringify(times)} `);
    log.warn(times)
    times = []
}
/*
*   Event object {target:"",options:{promptMsg:""}}
*/
function POPUP_win(evnt,callback){

    var popId = evnt.callerType ? evnt.callerType : $(evnt.target).attr('id');

    var key = `[data-popup-for=${popId}]`;

    $("#drawSpace").css({"overflow-y":"hidden"});

    var sTime = new Date().getTime();

    var eTime = 0;

    

    console.log(`Starttime ${sTime}`)

    var box = $(key) 

    //alert(box.attr("id"))

    var title = box.find("[data-title-for]")

    var titleString = box.find("[data-title-string-for]")

   // alert(title.length)

    var closeButton = box.find("[data-close-button-for]")

    var sendButton = box.find("[data-send-button-for]")

    var cancelButton = box.find("[data-cancel-button-for]")

    var controlRow = box.find("[data-control-row-for]")

    var form = box.find("[data-form-for]")
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

        lap("before box")
    
        box = configuredTool(whichTool("div")).appendTo("#body").css({
                        "width":$(window).width() * .90,
                        height:$(window).height() * .70,
                        "overflow-y":"scroll",
                        "background-color":"white",
                        position:"absolute",
                        top:$(window).height() * .90,
                        left:$(window).width()/2 - $(window).width()/2/2,
                        "z-index":9999999,
                        "border-radius":"10px"

                    }).attr("data-popup-for",popId);

        lap("after box");

        lap("before form");

        form = configuredTool(whichTool("form")).attr("data-form-for",$(box).attr("id")).appendTo(box)
                    .css({width:($(window).width()*.85),height:($(window).height()*.65)});

       

        lap("after form");

        lap("before title");

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


         form.css({position:"absolute",top:title.height(),left:box.width()/2 - form.width()/2})
                         form.attr("type","LIST");

        lap("after title");

        lap("before string");

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
 
        lap("after string");
        //#034C9E  lighter blue for closeButton

        lap("before close");

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

        lap("after close");

        lap("before control");

          controlRow = configuredTool(whichTool("div")).appendTo(form).css({
                        "width":$(box).width(),
                        height:"10%",
                        "background-color":"transparent",
                        position:"absolute",
                        top:box.height()- (box.height() * .2),
                        "margin":"10px",
                        left:0
                    }).attr("data-control-row-for",$(box).attr("id"))

        lap("after control")

        lap("before send");

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

         lap("after send");

         lap("before cancel")

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

         lap("after cancel");

    }


    var adjustedWidthPct = $(window).width() <= 700 ? .85 : .5;

    var adjustedHeightPct = $(window).height() <= 400 ? .85 : .9;


    if(!box.is("[data-popup-for]")){
        $("#greybox").hide();
        box.hide();
        return;
    }



    setUpPopUpButtons();

//Set Up Form Fields

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


    //Only Call specific callers
    //ie 
    //_js
    //_notification
    //_alert
    //_contact
    

    if(evnt.callerType){
  


        $(window).trigger(`${evnt.callerType}beforeDialogShow`,[box,$(evnt.target),evnt]);
    }



    box.css({"z-index":50000}).css({
                       // "width":$(window).width() * adjustedWidthPct,
                       // height:$(window).height()* adjustedHeightPct,
                        //"background-color":"purple",
                        position:"absolute",
                        top:($(window).height()/2 - ($(window).height()* adjustedHeightPct)/2) + window.scrollY ,
                        left:$(window).width()/2 - ($(box).width())/2
                    //Now that box has rendered.  Draw Child Elements and save positions
                    }).fadeIn(function(){

                         lap("positioning after fadeIn");

                         box.find(".group-container").each(function(idx,it){
                            it = $(it).removeClass("editing")
                            setUpGroupContainer($(it),true);
                        })

                      
                        
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

                        }).attr("onhover","color:" + cancelButton.css("background-color"))

                    
                       
                        CUSTOM_PXTO_VIEWPORT(box)

                        CUSTOM_PXTO_VIEWPORT(sendButton)
                        CUSTOM_PXTO_VIEWPORT(cancelButton)
                        CUSTOM_PXTO_VIEWPORT(titleString)
                        CUSTOM_PXTO_VIEWPORT(controlRow)
                        CUSTOM_PXTO_VIEWPORT(title)
                        CUSTOM_PXTO_VIEWPORT(closeButton)
                        CUSTOM_PXTO_VIEWPORT($("#greybox"))
                        CUSTOM_PXTO_VIEWPORT(form)

                        //$(window).trigger(editing ? "editing" :"preview")


                        eTime = new Date().getTime();

                        console.log(`Endtime ${eTime} for Starttime ${sTime}  trip time ${eTime - sTime}`)

                        lap("preparing for callback...done");

                        if(callback)
                            callback(box,evnt)

                        report();

                       
                    })
                  

               
                        //box.data("resizeset","true")

     

}

var popup = POPUP_win;

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