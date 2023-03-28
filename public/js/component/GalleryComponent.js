


class GalleryComponent {

 constructor(id){

 		this.id = id;
 		this.str = `<div "id=${id}" class="gallery" type="GALLERY" style="width:90%; display:flex; justify:space-between"></div>`

 		//this.str += whichTool("TOGGLE").droppedModeHtml;

 		var gallery = $(this.str);

 		var list = $(whichTool("LIST").droppedModeHtml)

 		list.addClass("notresizable notdraggable").css({width:"100%",height:"100%"});

 		gallery.append(list);

 		this.str = gallery[0].outerHTML;


		 	
	}

	asHTML(){
		return this.str;
	}
	
}
GalleryComponent.counter = 0;
