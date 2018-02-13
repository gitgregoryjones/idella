/*
*
*   @param  wrapperElem     the parent element for the new control once the control is created based on type
*   @param  typeOfControl   String representing the type of form field user wishes to create ("TEXT","TEXTAREA","RADIO","CHECKBOX")   
*
*/
function CONTROLS_makeFormFieldFor(wrapperElem,typeOfField){
    wrapperElem = $(wrapperElem);

    var tool = {};

    switch(typeOfField.toUpperCase()){
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
        break;
    }

}


function CONTROLS_initControlData(){

}