



function toString(control){

    var val = "";

    var stopPoint = 0;

   // alert(`old control is ${control.attr("type")} `)

    switch(control.attr("type").toLowerCase()){

        
        case "select":
            stopPoint = control.find("option").length - 1
            var idx = 0;
            control.find("option").each(function(idx,it){
                it = $(it);
                if(it.attr("value") != "none"){
                    val += it.text() + (idx < stopPoint ? "," : "");
                }
                idx++;
                
            })

        break;
        case "textarea":
             var splitChar = control.val().indexOf("\n") > 0 ? "\n" : ",";
             var idx = 0;
             stopPoint = control.val().split(splitChar).length -1;
             control.val().split(splitChar).forEach(function(value){
                 val += value + (idx < stopPoint ? "," : "");
                 idx++;
             })
        break;
        default:
            val = control.val();
        break;
    }
    log.trace(`Returning toString() ${val} from control conversion function toString`)
    return val;

}
/*
*
*   @param  wrapperElem     the parent element for the new control once the control is created based on type
*   @param  typeOfControl   String representing the type of form field user wishes to create ("TEXT","TEXTAREA","RADIO","CHECKBOX")   
*
*/
function CONTROLS_makeFormFieldFor(wrapperElem,typeOfField){
    wrapperElem = $(wrapperElem);

    var tool = {};

   // alert(` typeof control is ${typeOfField}`)

    switch(typeOfField.toUpperCase()){
        case    "SELECT-OLD":
                tool = configuredTool(whichTool("LIST"))
                    .resizable("destroy").draggable("destroy").removeClass("dropped-object").removeClass("ui-droppable").removeClass("squarepeg")
                    tool.attr("type",typeOfField)
                    var oldCntrl = wrapperElem.find("[type]").first();
                    oldCntrl = oldCntrl.remove();
                    //val = oldCntrl.val();
                    wrapperElem.append(tool);
                    tool.css({"width":"100%","height":"100%","background-color":"white"})
                    txt = wrapperElem.parent(".group-container").find("[class*=-label]").trigger("input")

                    val = toString(oldCntrl);

                    if(val.length > 0){
                        //tool.val(val)
                        
                        var splitChar = val.indexOf("\n") > 0 ? "\n" : ",";

                        var tokLen = val.split(splitChar).length;
                        val.split(splitChar).forEach(function(val){
                            var option = configuredTool(whichTool("DIV")).attr("type","option")
                              .resizable("destroy").draggable("destroy")
                            option.text(val)
                            tool.append(option);
                            option.attr("hover","color:white;background-color:navy");
                            option.css({"text-align":"center","background-color":"silver","font-size":(tool.height()/tokLen)*.75,"width":"80%",height:tool.height()/tokLen})
                            option.removeClass("debug-border-style").removeClass("dropped-object").removeClass("squarepeg")
                        //CUSTOM_PXTO_VIEWPORT(option)
                            option.on("mouseenter",function(){
                                    option.css({color:"white","background-color":"navy"})
                                    //option.addClass("fa fa-check");
                            }).on("mouseleave",function(){
                                    option.css({color:"black","background-color":"silver"})
                                    //option.removeClass("fa fa-check");
                            })

                        })
                      
                        
                    }
        break;
        case "SELECT":
                 tool = configuredTool(whichTool(typeOfField.toUpperCase())).draggable("destroy").resizable("destroy")
                 tool.attr("name",wrapperElem.attr("name"))
                 tool.append($("<option>",{value:"none"}).text("none selected"))
                 tool.css({width:"100%",height:"100%"}).removeClass("dropped-object").removeClass("ui-droppable")
                 //tool.wrap("<div class='dropped-object squarepeg'></div>");
                    var oldCntrl = wrapperElem.find("[type]").first();
                    oldCntrl = oldCntrl.remove();
                    val = toString(oldCntrl);


                    if(val.length > 0){
                        //tool.val(val)
                        
                        var splitChar = val.indexOf("\n") > 0 ? "\n" : ",";

                        var tokLen = val.split(splitChar).length;
                        val.split(splitChar).forEach(function(val){
                            var option = $("<option>",{value:val,type:"option"}).text(val)

                            option.on("mouseenter",function(){
                                NOTES_makeNote(this);
                            })
                           
                            tool.append(option);
                           
                        //CUSTOM_PXTO_VIEWPORT(option)
                            option.on("mouseenter",function(){
                                    //option.css({color:"white","background-color":"navy"})
                                    //option.addClass("fa fa-check");
                            }).on("mouseleave",function(){
                                    //option.css({color:"black","background-color":"silver"})
                                    //option.removeClass("fa fa-check");
                            })

                        })
                    }
                    wrapperElem.append(tool);

        break;
        /* IF U NEED ANY SPECIAL LOGIC FOR A TYPE UNCOMMENT THIS SECTION, ADD THE TYPE AND HANDLE THE OBJEC

        case    "TEXTAREA":
        
                    tool = configuredTool(whichTool(typeOfField)).off();

                   // var str = wrapperElem.find("[type]").first().data("toString");
                   // if(str){
                     //   tool.val(str);
                    //}
                    var oldCntrl = wrapperElem.find("[type]").first();
                    oldCntrl = oldCntrl.remove();
                    wrapperElem.append(tool);
                    tool.css({"width":"100%","height":"100%"})
                    //alert(wrapperElem.wrap('').parent().html())
                   // wrapperElem.resizable("enable")
                    //setUpGroupContainer($(wrapperElem.parent(".group-container")),true);
        break;*/
        default:
        
                    tool = configuredTool(whichTool(typeOfField)).resizable("destroy").draggable("destroy").droppable("destroy")
                            .removeClass("dropped-object").off()

                    var oldCntrl = wrapperElem.find("[type]").first();
                    oldCntrl = oldCntrl.remove();
                    val = toString(oldCntrl);
                    wrapperElem.append(tool);
                    tool.css({"width":"100%","height":"100%"})
                    TEXTAREA_init(tool)
                    txt = wrapperElem.parent(".group-container").find("[class*=-label]").trigger("input")
                    if(val.length > 0){
                        tool.val(val)
                    }
        break;
    }

}


function CONTROLS_initControlData(){

}