


class ListComponent {


 constructor(id,type){

 	this.html = "";
 	this.id = 0;
 	

 	this.id = id;

 	var str =  `<div id="${id}" class="adaptive" type="LIST"></div>`;

	var list = $(str);


	for(i=0; i < 4; i++){

		list.append($(whichTool("ICARD").droppedModeHtml));
	}



	this.html = list[0].outerHTML;


	}

	asHTML(){

		return this.html;
	}

	
}

