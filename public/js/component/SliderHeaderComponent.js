


class SliderHeaderComponent {



	constructor(id,type){

	 	this.html = "";
	 	this.id = 0;
	 	

	 	this.id = `${id}_${++SliderHeaderComponent.counter}` ;

	 	var str =  `<slider-control id="${id}" class="notresizable slider-control"><div><span class="fa fa-times-circle-o"></span></div><div>Responsive</div></slider-control>`;

	 	var toggle = new ToggleSwitchComponent(`${this.id}-toggleswitch`).asHTML();


	 	var sc = $(str);


	 	toggle = $(toggle);

	 	toggle.removeClass("dropped-object").find(".dropped-object").removeClass("dropped-object")

	 	sc.append(toggle)

	 	sc.append(`<div class="item-count"><span class="fa fa-plus"></span>Add Slides:&nbsp<input type="text" placeholder="1" width="3" maxlength="2"/></div>`);

	 	


	 	this.html = sc[0].outerHTML;

	 	return this.html;


		
	}

	asHTML(){

		return this.html;
	}


	
}
SliderHeaderComponent.counter = 0;
