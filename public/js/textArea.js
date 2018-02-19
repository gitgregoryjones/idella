

var TEXTAREA_init = function(textarea){

    $(textarea).keydown(function(e) {

       $(document).unbind("keydown");

        var area = $(e).data("textareaset")

       
            if(e.keyCode === 9) { // tab was pressed
                // get caret position/selection
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var $this = $(this);
                var value = $this.val();

                // set textarea value to: text before caret + tab + text after caret
                $this.val(value.substring(0, start)
                            + "\t"
                            + value.substring(end));

                // put caret at right position again (add one for the tab)
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                e.preventDefault();
            }
            $(e).data("textareaset","on");

        

      
    }).on("mouseleave",function(){
       
            $(document).off("keydown").on("keydown",CUSTOM_KEYDOWN_LOGIC)
        

    })
}

$("textarea").each(function(idx,it){
    TEXTAREA_init(it);
})