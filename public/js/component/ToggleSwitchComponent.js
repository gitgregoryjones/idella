


class ToggleSwitchComponent {



	constructor(id,type){

	 	this.html = "";
	 	this.id = 0;
	 	

	 	this.id = `${id}_${++ToggleSwitchComponent.counter}` ;

	 	var str =  `<label id="${id}" class="notresizable dropped-object switch"><input id="${id}-input" class="" type="checkbox" checked><span type="toggle-button" id="${id}-span" class="slider round notresizable notdraggable dropped-object"></span></label>`;


		this.html = str;


		
	}

	asHTML(){

		return this.html;
	}


	
}
ToggleSwitchComponent.counter = 0;
