/*
*   Event object {target:"",options:{promptMsg:""}}
*/
function POPUP_greyOver(evnt,callback){

   var grayOver = $("#greybox")

   var textMessage = {};

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

        grayOver.removeClass("debug-border-style").droppable("disable")

        textMessage = $(`<div id='textMessage' data-message-for-greybox="${grayOver.attr("id")}">selector ->[data-message-for-greybox]</div>`)
       
        grayOver.append(textMessage);

        textMessage.css({"font-size":"48px",width:"80%",color:"white", border:"3px solid white",padding:"20px",position:"absolute"})

        textMessage.css({top:$(window).height()/2 - textMessage.height()/2, left:$(window).width()/2 - textMessage.width()/2})
        
        log.debug(textMessage.width() + " 1/2 of window width " + $(window).width()/2 + " window width " + $(window).width())

       

    }

   textMessage = $(`[data-message-for-greybox=${grayOver.attr("id")}]`);


    if(evnt.callerType){
  
        $(window).trigger(`${evnt.callerType}beforeGreyBoxShow`,[grayOver,$(evnt.target),evnt]);
    }


    grayOver.fadeIn(function(){

        $(window).trigger(`${evnt.callerType}afterGreyBoxShow`,[grayOver,$(evnt.target),evnt]);


        CUSTOM_PXTO_VIEWPORT(grayOver)

        if(callback){

            callback(grayOver)

        }
    })

    return grayOver;


}