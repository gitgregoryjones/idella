GLOBAL_NO_EDIT = false;

/*
*
*   options :{
*       target - element to target
*       callerType - String literal for type of popup (_js, _prompt, etc)
*       promptMsg - String for title on notification types 
*   }
*
*
*/



 //Listen for Event Just Before Dialog is shown to user and move stuff around
 //and add specific fields for JS dialog 
$(window).off("_promptbeforeDialogShow").on("_promptbeforeDialogShow",function(evnt,box,element,config){
      

        var displayId = element.attr("type") + "#" + element.attr("id");

        var form = box.find("form")
        var field =  form.find("[type=FIELD]");
        var control = field.find("[id*=-control]")
        var actionRow = box.find("[data-control-row-for]");
        var label = field.find("[id*=-label]")
        var winTitleArea = box.find("[data-title-for]");

        var title = box.find("[data-title-string-for]")
                .text(`${ element.attr("alias")   ? element.attr("alias") : displayId }`).fadeIn();
                      //  title.css({"font-size":title.height()*.30});
        var closeButton = box.find("[data-close-button-for]")

        var sendButton = box.find("[data-send-button-for]")

        var cancelButton = box.find("[data-cancel-button-for]")

        var controlRow = box.find("[data-control-row-for]")


        if(box.find(".functionArea").length == 0){

            box.css({width:"600px",height:"300px"})
            
            closeButton = box.find("[data-close-button-for]")

            sendButton = box.find("[data-send-button-for]")

            cancelButton = box.find("[data-cancel-button-for]")

            controlRow = box.find("[data-control-row-for]")

            winTitleArea.css({height:"25%"})
            
            currentCtx = box.find("form");

            //Make a FIELD TYPE
            $("[data-action=drop][type=FIELD]").click();


            
            form = box.find("form").css({width:box.width()*.9})

            control = form.find("[id*=-control]")
            label = form.find("[id*=-label]").remove()                       

            currentCtx = control;

             control.addClass("functionArea")
                    .removeClass("submenu").removeClass("squarepeg")
          
            $("[data-action=insertBefore]").click();

           

            currentCtx = controlRow;

            //$("[data-action=insertBefore]").click();
            $("[data-action=insertAfter]").click();


            controlRow.css({width:form.width()})

            cancelButton.css({width:form.width()*.3,left:controlRow.width()/2})
            
            sendButton.css({width:form.width()*.3,left:controlRow.width()/2 - $(controlRow).width() *.4,})      
            //remove default click events
            field =  form.find("[type=FIELD]");

            //Do size setup
           // var titleStr = box.find("[data-title-string-for]")
             //           titleStr.text("What is the site name?")

            //Control
            control.css({width:box.find("form").width()*.95,height:"60px"});

            
            control.find("input").css({height:"100%",width:"95%","font-size":control.height()*.5});
            // control.find("[type=FIELD]").css({width:form.width()}).trigger("resizestop");
       
            //FIELD
            field.css({height:parseInt(control.height()),width:form.width()*.95}) 

            form.css({height:field.height() + actionRow.height()})

           // box.css({height:form.height() + winTitleArea.height() + controlRow.height(), "padding-bottom":"60px"})
            
          
            
        }



          if(box.resizable("instance")){
                box.resizable("destroy")          
            }

            if(box.draggable("instance")){
                box.draggable("destroy")
            }

            box.removeClass("submenu").removeClass("dropped-object")
                    .off().removeClass("squarepeg").css({"border":"1px solid black"});



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
        box.find(".dropped-object").removeClass("dropped-object")        

        control.find("input").attr("placeholder",config.options.promptMsg ? config.options.promptMsg : "Notification")
        title.text(config.options.promptMsg ? config.options.promptMsg : "Notification")
        //SetUp Text Area
        //TEXTAREA_init(control.find("input").first())
})


//When Dialog is Closed, Clean up Resources
$(window).off("_promptdialogClosed").on("_promptdialogClosed",function(){
           // title.text("").hide();
            //textarea.val("")
})



function prompt(question,callbackAnswer){

    MAKE_PROMPT_FOR_INPUT_BOX_for({target:$(window),callerType:"_prompt",promptMsg:question},callbackAnswer);
}


function MAKE_PROMPT_FOR_INPUT_BOX_for(options,callbackForTextResponse){



    POPUP_win({target:$(".dropped-object").first(),callerType:"_prompt",options:options},function(box){

        
         $("[data-action=lessOptions]").click();
        $(".widget-off,.widget-on").remove();


        //After box is rendered  Override Click event on save button
        box.find("input").focus();
         //Do Save Button
        var save = box.find("[data-send-button-for]")

        save.off();

        save.on("click",function(){

            

            try{
      
                    box.find("[data-close-button-for]").click();

                    callbackForTextResponse(box.find("input").val())

            }catch(error){
               
                
            }
        })

    })
}