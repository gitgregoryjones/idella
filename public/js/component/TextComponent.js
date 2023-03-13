


class TextComponent {


 

 constructor(id){

 	this.html = "";
 	this.id = 0;
 	

 	this.id = id;

	 var str =  `<div class="outer"><div lines="1" chars="0" style="display:inline-block width:100%" contenteditable=\"false\" id="text-${id}" class="text-detail">Enter Text</div><div>`;

	

	//log.debug(`Created HTML String called ${str}`)

	this.html = str;


	}

	asHTML(){

		return this.html;
	}

	
}

