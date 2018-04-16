GLOBAL_NO_EDIT = false;






 //Listen for Event Just Before Dialog is shown to user and move stuff around
 //and add specific fields for JS dialog 
$(window).off("_jsbeforeDialogShow").on("_jsbeforeDialogShow",function(evnt,box,element){

        var displayId = element.attr("type") + "#" + element.attr("id");

        var form = box.find("form")
        var field =  form.find("[type=FIELD]");
        var control = field.find("[id*=-control]")
        var actionRow = box.find("[data-control-row-for]");
        var label = field.find("[id*=-label]")
        var winTitleArea = box.find("[data-title-for]").css({"background-color":"orange"});

        var title = box.find("[data-title-string-for]").css({"font-size":winTitleArea.height() *.3})
                .text(`${ element.attr("alias")   ? element.attr("alias") : displayId }`).fadeIn();
                  //  title.css({"font-size":title.height()*.30});

        if(box.find(".functionArea").length == 0){
            
            currentCtx = box.find("form");

            //Make a FIELD TYPE
            $("[data-action=drop][type=FIELD]").click();

            form = box.find("form")
            control = form.find("[id*=-control]")
            label = form.find("[id*=-label]")
                        .text("Javascript Playground")
                        .css({width:form.width()*.95,"font-size":"30px",color:"white","text-align":"center"})

            currentCtx = control;


            //var label = field.find("[id*=-label]").text("Javascript Playground").css({"text-align":"center"})
            
            CONTROLS_makeFormFieldFor(control,"textarea"); 

             control.addClass("functionArea")
                    .removeClass("submenu").removeClass("squarepeg")
          
            $("[data-action=insertBefore]").click();

            actionRow = form.find("[data-control-row-for]");

            currentCtx = actionRow;

            $("[data-action=insertAfter]").click();         
            //remove default click events
            field =  form.find("[type=FIELD]");

            //Do size setup
           // var titleStr = box.find("[data-title-string-for]")
             //           titleStr.css({"font-size":title.height() *.4})

            //Control
            control.css({width:box.find("form").width()*.95,height:box.find("form").height()*.7});
            // control.find("[type=FIELD]").css({width:form.width()}).trigger("resizestop");
       
            //FIELD
            field.css({height:parseInt(control.height()) + parseInt(label.height())
            ,width:form.width()*.95}) 

            label.css({width:field.width()*.95})

            form.css({height:field.height() + actionRow.height()})

            box.css({height:form.height() + winTitleArea.height() + actionRow.height(), "padding-bottom":"30px"})

        }


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
            

        //SetUp Text Area
        TEXTAREA_init(control.find("textarea").first())

        var textarea = box.find("textarea");

        //Reset TextArea in case of errors
        textarea.off("click").on("click",function(){
            title.text(`${ element.attr("alias")   ? element.attr("alias") : displayId }`).css({"text-decoration":"none"})
            winTitleArea.css({"background-color":"orange"})

        })

       
    


         //Do textarea
        box.find("textarea").val(getJs(element))
})


//When Dialog is Closed, Clean up Resources
$(window).off("_jsdialogClosed").on("_jsdialogClosed",function(){
           // title.text("").hide();
            //textarea.val("")
})



function MAKE_JAVASCRIPT_BOX_for(element){


    POPUP_win({target:element,callerType:"_js"},function(box){

        console.log(`Closing edit space because javascript box does not need it`)
        $("[data-action=lessOptions]").click();
        $(".widget-off,.widget-on").remove();

        box.find("form").addClass("editing")

         var title = box.find("[data-title-string-for]")

         var winTitleArea = box.find("[data-title-for]")
        //After box is rendered  Override Click event on save button

         //Do Save Button
        var save = box.find("[data-send-button-for]")

        save.off();

        save.on("click",function(){

            

            try{

                    var myRegexp = /\s*on\(\s*"(\s*\w+)"\s*,.+|on.\("(\w+)"\s*\)\.+/img

                    normalizedCopy = box.find("textarea").val().replace(/\n/g,"");

                    log.debug("Normalized JS function is " + normalizedCopy)

                    match = myRegexp.exec(normalizedCopy);

                    log.debug("MAKE_JAVASCRIPT_BOX_for.js:Match is " + match)

                    elemId= $(element).attr("id")
                    
                    var recompileCode = false;

                    eval(box.find("textarea").val())

                    var events = [];

                    for(e in $(element)[0]){
                        if(e.startsWith("on")){
                            events.push(e);
                            console.log(e)
                        }
                    }

                    while (match != null) {

                      // matched text: match[0]
                      // match start: match.index
                      // capturing group n: match[n]
                      log.debug("CUSTOMEVENTS.js:attempting to unbind any events of type ["+match[1] + "] attached to #" + elemId )

                      if(events.indexOf("on"+match[1]) > -1){
                       // alert('found bound event ' + match[1] + " for element " + $(element).attr("id"))
                        $(element).off(match[1])
                        //alert(dumbFunc)
                      }


                      if(match[1] == "hover"){
                        $("#"+elemId).unbind("mouseleave").unbind("mouseover")
                      }

                      //rebind our custom events
                      if(match[1] == "mouseenter" || match[1] == "mouseleave" || match[1] == "click"){
                            $("#"+elemId).on("mouseenter",CUSTOM_MOUSEENTER_LOGIC)
                                .on("mouseleave",CUSTOM_MOUSELEAVE_LOGIC)
                                //.on("click",genericSlide);
                      }
                      recompileCode = true;


                      match = myRegexp.exec(normalizedCopy);

                    
                    }

                    eval(box.find("textarea").val())

                    //Now that we are sure code is good.  Write it to storage.  It will be evaluated again by the browser
                    saveJs(element,box.find("textarea").val());
                
                    box.find("[data-close-button-for]").click();
                

            }catch(error){
                title.hide();
                title.css({"text-decoration":"underline"}).text(error).fadeIn();
                winTitleArea.css({"background-color":"red"})
                //box.find("textarea").val(error)
                
            }
        })

    })
}