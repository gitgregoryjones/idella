//stylesTabs.js
var commonTabLabel = "common"

var data = [];

$(document).on("initializationComplete",function(){


	console.log($("#autocomplete"))
	console.log("hep AutoComplete")	

    $.widget( "custom.catcomplete", $.ui.autocomplete, {
      _create: function() {
        this._super();
        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
      },
      _renderMenu: function( ul, items ) {
        var that = this,
          currentCategory = "";
        $.each( items, function( index, item ) {
          var li;
          if ( item.category != currentCategory ) {
            ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
            currentCategory = item.category;
          }
          li = that._renderItemData( ul, item );
          if ( item.category ) {
            li.attr( "aria-label", item.category + " : " + item.label );
          }
        });
      }
    });

    
    getCSSData()
    log.trace("Got getCSSData()")
    log.debug(data)

    //Do Autocomplete search stuff
   $( "#autocomplete" ).catcomplete({
    	delay: 0,
    	source: data,
    	select: userChoice
 	});

})
 

function userChoice(event,ui){

	log.trace("Made i oout")

	$("#answer").show()

	var label = ui.item.label;

	log.trace({label:label})

	var parent =  $( ".adialog" ).data().theClickedElement;

	var myValue = !$(parent).css(label) ? $(parent).attr(label) : $(parent).css(label);

	log.trace("MY VALUE IS " + myValue)

	log.trace({parent:parent,myValue:myValue,label:label})

	var myField = $("<input>",{value:myValue}).addClass("user-entry-content").on('input',function(evnt){
				//evnt.preventDefault();
				if(label == "class"){

					var tempV = $(evnt.target).val()
					//do nothing.  wait until class is complete
					$(parent).addClass(tempV)
					$(parent).attr("user-classes",tempV)	
				}else if(label == "src" || label == "align"){

					$(parent).find(".content-image").attr(label,$(evnt.target).val())
					//https://www.uvm.edu/~bnelson/computer/html/wrappingtextaroundimages.html
					if(label == "align"){
						$(parent).find("br").attr(clear,$(evnt.target).val())
					}
					

				}else if(label == "color"){
						$(parent).css("-webkit-text-fill-color",$(evnt.target).val())
					
				} else {

					//if this is a custom css option. ie how we define components, write as attribute
					if(!$(parent).css(label)){
						$(parent).attr(label,$(evnt.target).val())
					} else {
					$(parent).css(label,$(evnt.target).val())
					//if this is a custom css option. ie how we define components, write as attribute
					}
				}
				log("Firing : " + label + " ==> " + $(evnt.target).val())
				log("Webkit : " + $(parent).css("-webkit-text-fill-color"))

				if($(".changesToggle").is(":checked")){
					log.trace("Style is checked ")
					//myStyle = CONVERT_STYLE_TO_CLASS_OBJECT($(parent))
					myStyle = {}
					myStyle[label] = $(evnt.target).val()
					log.trace(myStyle)
					//delete myStyle.top;
					//delete myStyle.left;
					log.trace("I see this many copies of " + $(parent).attr("id") + " : " + $("[extends='"+$(parent).attr("id")+ "']").not($(parent)).length)
					//Any copies of this parent
					$("[extends='"+$(parent).attr("id")+ "']").not($(parent)).css(myStyle);

					//Any copies currently being edited

					//copy to others just in case we are editing a copy
					originalParentId = $(parent).attr("extends");

					$("[extends='"+originalParentId+"']").not($(parent)).css(myStyle);

					//Copy to parent in case we are editing a copy and not the parent directly
					$("#"+originalParentId).css(myStyle)

					copiesModified = true;
				}
		}).on("change",function(evnt){
			//only used to write class info here.  Everything else should use on.input
			if($(parent.attr("user-classes") && $(parent).attr("user-classes").trim().length > 0)){
				$(parent).attr("class",$(parent).attr("user-classes"))
				$(parent).removeAttr("user-classes")
			}

			if(label == "slider-auto-slide"){
				$.event.trigger("genericSliderReady",[$(event.target)])
			}

			if($(parent).is("[type=VID]")){
				$(parent).find("video")[0].load()
			}

		})

		$(".user-entry-label").html(label)

		$(".user-entry-content").replaceWith(myField)
} 

/*
* Get Available CSS Fields into Autocomplete format
*/
function getCSSData(elem){

	//parent = elem ? elem : $( ".adialog" ).data().theClickedElement;

	styleMeta = CONVERT_STYLE_TO_CLASS_OBJECT($("<div>"),true);

	defaultTabs = ["slider",commonTabLabel,"misc","font","text","border","background","-webkit"]

	$.each(styleMeta,function(label,value){
		log("The label is " + label + " and value " + value)
		
		var common = null;

		if(label.startsWith("common-")){
			log.debug("stylesAutoComplete.js Moving this field to common tab for easier access")
			common = label.substring(label.indexOf("-")+1);
			log.debug("Label is now " + common)
			label = common;
		}

		//Add Tab Content dynamically equal to style Groups
		tabLabel = label.indexOf("-") > -1 ? label.substring(0,label.indexOf("-")) : label;


		if(label.indexOf("-") == -1){
			tabLabel = "misc";
		}

		if(tabLabel.length == 0){

			tabLabel = "-webkit"
		}

		tabLabel = tabLabel.toUpperCase();

		data.push({label:label,category: common == null ? tabLabel : commonTabLabel}) 
	

	})

}






	






