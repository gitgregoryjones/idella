


class CustomShape {


 

 constructor(id){

 	this.html = "";
 	this.id = 0;
 	

 	this.id = id;

	 var str =  `<div><svg width="100%" height="100%" class="polygon svg-${this.id}">
				  <polygon class="shape-ELEM_1601083722784" points="96.00694900390624,-3.993050996093757 150.00002151367187,175.90279250976562 10.000021513671868,52.89931350585937 167.01393752929687,54.89583450195312 30.989584501953118,172.88194900390624"></polygon>
				  
				  Sorry, your browser does not support inline SVG.
				</svg><div>`;

	

	//log.debug(`Created HTML String called ${str}`)

	this.html = str;


	}

	asHTML(){

		return this.html;
	}

	
}

