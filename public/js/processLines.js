
var validCMDs = ["MOVE","ADD","CHANGE"]

function PROCESS_LINES_processInstruction( line ){

    var instruction = line.substr(0,line.lastIndexOf("."));

    var firstWord = line.substr(0,line.indexOf(" "));

    console.log("Found first word");

    if(validCMDs.includes(firstWord.toUpperCase())){

        console.log("Calling CMD " + firstWord);

        try {

        eval(`idella_${firstWord.toUpperCase()}(instruction)`);

        }catch(e){
            console.log("Failure running cmd " + instruction);
            console.log(e)
        }


    }
}

function idella_CHANGE(line){

    var regex = /CHANGE\s(\S+)\s+(\S+)\s+TO\s+(\S+).*/;

    var cmds = line.match(regex);

    var uuid = cmds[1];

    var style = cmds[2];

    var value = cmds[3];

    var finalCmd = `$("[alias=${uuid}]").css({"${style}":"${value}"})`;

    console.log("Running cmd " + finalCmd)

    var obj = eval(finalCmd)

    NOTES_makeNote(obj, true)

    CUSTOM_PXTO_VIEWPORT(obj)
    
}



function idella_MOVE(line){

    var regex = /MOVE\s+(\S+)\s+TO\s+(\d+),(\d+).*/;

    console.log("Called move for line " + line)


    var cmds = line.match(regex);

    var uuid = cmds[1];

    var xCoord = cmds[2];

    var yCoord = cmds[3];

    
    var finalCmd = `$("[alias=${uuid}]").css({left:${xCoord},top:${yCoord}})`;

    console.log("Running cmd " + finalCmd)

   

    var obj = eval(finalCmd)
    NOTES_makeNote(obj, true)

    CUSTOM_PXTO_VIEWPORT(obj)

}