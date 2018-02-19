GLOBAL_NO_EDIT = false;

/*
*
*   options :{
*       target - element to target
*       callerType - String literal for type of popup (_js, _notification, etc)
*       promptMsg - String for title on notification types 
*   }
*
*
*/



 //Listen for Event Just Before Dialog is shown to user and move stuff around
 //and add specific fields for JS dialog 
$(window).off("_msgbeforeDialogShow").on("_msgbeforeDialogShow",function(evnt,box,element,config){
      



        var displayId = element.attr("type") + "#" + element.attr("id");

        var form = box.find("form")
        var controlRow = box.find("[data-control-row-for]");
        var winTitleArea = box.find("[data-title-for]");

        var title = box.find("[data-title-string-for]")
                .text(`${ element.attr("alias")   ? element.attr("alias") : displayId }`).fadeIn();
                      //  title.css({"font-size":title.height()*.30});
        var closeButton = box.find("[data-close-button-for]")

        var sendButton = box.find("[data-send-button-for]")

        var cancelButton = box.find("[data-cancel-button-for]")

        var controlRow = box.find("[data-control-row-for]")


        if(box.find(".functionArea").length == 0){

            box.css({width:"700px",height:"300px"})
            
            closeButton = box.find("[data-close-button-for]")

            sendButton = box.find("[data-send-button-for]")

            cancelButton = box.find("[data-cancel-button-for]")

            controlRow = box.find("[data-control-row-for]")

            winTitleArea.css({height:"40%"})

           // title.css({"font-size":winTitleArea.height()*.5, width:"500px"})
            
            currentCtx = box.find("form");

            
            form = box.find("form").css({"margin-top":"100px",width:box.width()*.9})

            controlRow.css({width:form.width(),top:0})

            cancelButton.css({width:form.width()*.3,left:controlRow.width()/2})
            
            sendButton.css({width:form.width()*.3,left:controlRow.width()/2 - $(controlRow).width() *.4,}).text("Yes")      
      

            form.css({height:controlRow.height()})

           // box.css({height:form.height() + winTitleArea.height() + controlRow.height(), "padding-bottom":"60px"})
            
            if(box.resizable("instance")){
                box.resizable("destroy")          
            }

            if(box.draggable("instance")){
                box.draggable("destroy")
            }

            box.removeClass("submenu").removeClass("dropped-object")
                    .off().removeClass("squarepeg").css({"border":"none"});

            //Do children
            
             box.find(".dropped-object").each(function(idx,it){

                    it = $(it);
                    if(it.draggable("instance")){
                        it.draggable("destroy");
                    }

                    if(it.resizable("instance")){
                        it.resizable("destroy")   
                    }
                    it.removeClass("submenu")
                    .css({"border":"none"})
                    .removeClass("squarepeg").removeClass("dropped-object");

                 })
                  //box.find(".dropped-object:not([data-cancel-button-for],[data-close-button-for])").off("mouseenter");
            box.find(".dropped-object").removeClass("dropped-object");        
            
        }

        title.text(config.options.promptMsg ? config.options.promptMsg : "Prompt")
  
})


//When Dialog is Closed, Clean up Resources
$(window).off("_msgdialogClosed").on("_msgdialogClosed",function(){
      
})



function MAKE_MSG_BOX_for(options,callbackForTextResponse){



    POPUP_win({target:$(".dropped-object").first(),callerType:"_msg",options:options},function(box){

        
        //After box is rendered  Override Click event on save button

         //Do Save Button
        var save = box.find("[data-send-button-for]")

        save.off();

        save.on("click",function(){

            try{
      
                    box.find("[data-close-button-for]").click();

                    callbackForTextResponse(save.val())

            }catch(error){
               
                
            }
        })

    })
}