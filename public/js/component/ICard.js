
class ICard {

 style = `.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}`	

 constructor(id){

 			this.id = id;

 			ICard.counter++;

 			this.html = `<icard id="${id}-${ICard.counter}" class="icard dropped-object" type="ICARD">
						  <div id="${id}-photo-${ICard.counter}" class="dropped-object notdraggable resizable photo" type="IMG"></div>
						  
						  <div id="${id}-container-${ICard.counter}" class="container notresizable notdraggable" type="DIV">
						    <div id="${id}-headline-container-${ICard.counter}" class="dropped-object headline notresizable notdraggable" type="T"><div lines="1" chars="0" style="display:inline-block width:100%" contenteditable=\"false\" id="text-${id}" class="text-detail">Enter Text</div></div>
						    <div id="${id}-subtext-container-${ICard.counter}" class="dropped-object subtext notdraggable notresizable" type="T"><div lines="1" chars="0" style="display:inline-block width:100%" contenteditable=\"false\" id="text-${id}" class="text-detail">Enter Text</div></div>
						  </div>
						</icard>`;

}


 asHTML(){

		return this.html;
 }
	
}
ICard.counter = 0;
