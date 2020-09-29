


class Equalizer {


 static convertRawToURL(base64Raw,sitename,newFileName){

 	log.debug(`Filename for audio is ${newFileName}`)



 	return new Promise((resolve,reject)=>{

	 	$.ajax({
			    type: "POST",
			    url: "/revisions/audio",
			    contentType: "application/json; charset=utf-8",
			    dataType:"json",
			    headers: {
			    	"x-site-name":sitename
			    },
			    data:JSON.stringify({filename:newFileName,raw:base64Raw})
			   
			
			}).done(function(data){
			
				resolve(data);

			}).fail(function(x,t,e){
				log.debug("Error getting all sites :" + t)
				log.debug(e);
				reject(e);
		});
	});
 }	

 constructor(id){

 	this.html = "";
 	this.id = 0;
 	this.speed = 0;
 	this.audio = null;
 	this.parked = false;


 	this.id = id;

	 var str =  `<div id="equalizer-${id}" type="${type}" class="equalizer" style="padding: 0px;">
	 	<!-- Audio Element //-->
	 	<audio id="track-${id}" class="content-image" src="http://soundbible.com/mp3/descending_craft-Sonidor-991848481.mp3" type="video/mp4">Your browser does not support the audio element.</audio>
		<!-- Header //-->
		<div style="width: 100%; height: 10%; color: rgb(255, 255, 255); background-color: rgb(0, 0, 0); border-top-left-radius: 20px; border-top-right-radius: 20px;">
			<!--- Container Left 1 //-->
			<div style="float: left;">
				<!-- Volume Up //-->
				<span class="fa fa-volume-up" style="color: rgb(255, 255, 255); padding-top: 5px; padding-left: 20px; width: 20px; height: 20px;"></span>
			</div>
			<!-- Container 2 //-->
			<div style="float: left;">
				<!-- Turtle //-->
				<img src="/rabbit.png" style="padding-top: 5px; padding-left: 30px; width: 30px; height: 25px;">
			</div>
		</div>
		<!-- Volume Slider //-->
		<div id="volume-${id}" class="fa fa-bullhorn" style="margin: 20px; color: rgb(0, 0, 0);"></div>
		<div id="speed-${id}" class="fa fa-battery" style="margin: 0px; color: rgb(0, 0, 0);"></div>
		
		<!-- Footer //-->
		<div style="width: 100%; height: 25%; color: rgb(255, 255, 255); background-color: rgb(0, 0, 0); border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
			<div align="center" id="control-${id}" style="width:100%; text-align:center; margin-top:20px; font-size:25px" class="fa fa-pause-circle-o" onclick="if(document.getElementById('track-${id}').paused){$('#control-${id}').removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');document.getElementById('track-${id}').play()}else{$('#control-${id}').removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');document.getElementById('track-${id}').pause()}"/>
		</div>
	</div>`;

	log.debug(`Equalizer count is now ${++Equalizer.counter}`)

	//log.debug(`Created HTML String called ${str}`)

	this.html = str;


	}

	asHTML(){

		return this.html;
	}

	static initJS(volume,speed){

		log.debug(`Called Equalizer HTML ${++Equalizer.counter} times`);

		this.speed = speed;

		$("body").find("[id^=volume]").each((idx,elem)=>{

			$(elem).slider({
		        value: volume * 10,
		        range: "min",
		        animate: true,
		        orientation: "vertical",
		        slide:(evnt,ui)=>{
		        	$(elem).parent().find("audio")[0].volume = ui.value/100;
		        	$(elem).parent().find("audio")[0].loop = true;
		        	//this.volume1To10 = ui.value/10;
		        }
      		})
		}).css({margin:20,color:"black"});

		$("body").find("[id^=speed]").each((idx,elem)=>{
				log.debug(`Building Volume for ${$(elem).parentsUntil("[vehicle]").parent().attr("id")}`)
				$(elem).slider({
		        value: speed,
		        //range: true,
		        min: 1,
		        max: 5,
		        animate: true,
		        disabled: window.CarWithAudio ? false: true,
		        orientation: "vertical",
		        slide:(evnt,ui)=>{


		        	window.CarWithAudio[$(elem).parentsUntil("[vehicle]").parent().attr("id")].speedInSecs = parseInt(ui.value);
		        	
		        }
      	})
		}).css({margin:20,color:"black"});
		
	}
}
Equalizer.counter = 0;
