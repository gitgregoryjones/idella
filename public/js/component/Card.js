
class Card {

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

 			Card.counter++;

 			this.html = `<card id="${id}-${Card.counter}" class="card dropped-object" type="CARD">
						  <div id="${id}-photo-${Card.counter}" class="dropped-object notdraggable resizable photo" type="IMG"></div>
						  
						  <div id="${id}-container-${Card.counter}" class="container notresizable notdraggable" type="DIV">
						    <div id="${id}-headline-container-${Card.counter}" class="dropped-object headline notresizable notdraggable" type="T"><div lines="1" chars="0" style="display:inline-block width:100%" contenteditable=\"false\" id="text-${id}" class="text-detail">Enter Text</div></div>
						    <div id="${id}-subtext-container-${Card.counter}" class="dropped-object subtext notdraggable notresizable" type="T"><div lines="1" chars="0" style="display:inline-block width:100%" contenteditable=\"false\" id="text-${id}" class="text-detail">Enter Text</div></div>
						  </div>
						</card>`;

}


 asHTML(){

		return this.html;
 }
	
}
Card.counter = 0;
