setEndOfContenteditable = function(contentEditableElementId)
    {

      
        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {   
        selection = window.getSelection(); 
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(document.getElementById(contentEditableElementId));//Select the entire contents of the element with the range
            //range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            //get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        { 
            selection = window.getSelection();        
            range = document.createRange();
            range.selectNodeContents(document.getElementById(contentEditableElementId));
            selection.removeAllRanges();
            selection.addRange(range);
            
        }
    }
