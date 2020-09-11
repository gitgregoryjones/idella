class CarWithAudio {


	constructor(id,speedInSecs,volume1To10,parkingBrake){

		if(!window.CarWithAudio){

			window.CarWithAudio = {canDrive:true};
		}

		if(!window.CarWithAudio[id]){
			console.log(`Create Movable Object for ${id}`);
			this.audio = $(`#${id}`).find("audio")[0];
			//this.audio.id = `audio-${id}`;
			//this.audio.setAttribute('src', audioFile);
			//this.audioLoaded = true;
			this.audio.volume = 0;
			this.car = $(`#${id}`);

			this.car.oldPosition = {left:0};
			this.car.attr("vehicle","true");
			this.speedInSecs = speedInSecs;
			this.volume1To10 = volume1To10;
			//this.car.append(this.getEqualizer(id,speedInSecs,volume1To10));
			if(parkingBrake)
			this.parkingBrake = parkingBrake;
			//remember old position of car to place it back here when editing
			//this.car.oldPosition = {left:this.car.position().left,top:this.car.position.top};
			
			//MouseEvents Car
			this.car.not("[parkingbrake]").off("mouseover").off("mouseleave").on("mouseover",()=>{

				this.car.find("[type=AUDIO]").show();
				
				//this.car.attr("old-z",this.car.css("zIndex"));

				//this.car.css("zIndex",600);

				CarWithAudio.stopMe(this.car.attr("id"));

			}).on("mouseleave",()=>{

				this.car.find("[type=AUDIO]").hide();


				//this.car.css("zIndex",this.car.attr("old-z"));

				//CarWithAudio.startMe(this.car.attr("id"));

			}).find("audio").hide()


			//$("[id^=equalizer]").hide();

			//this.car.append(this.getEqualizer(id,speedInSecs,volume1To10))
			//$("body").append($(this.audio));
			window.CarWithAudio[id] = this;

		} 

		window.CarWithAudio[id].car.find("[id^=speed]").slider("option","disabled",false);

		try {

		console.log(`Create Movable Object for ${id}`);

			this.driveRight(10,1);		

		}catch(e){
			console.log(`Error in movable object creation ${e}`);
		}

		return window.CarWithAudio[id];
	}

	static initialize(){

		$("[type=AUDIO]").each(function(id,div){
			if($(div).parent("[type]").first().attr("id") != undefined){
				new CarWithAudio($(div).parent("[type]").attr("id"),Math.floor(Math.random() * Math.floor(CarWithAudio.duration/1000)),5,$(div).attr("parkingBrake"));
			}
			$(div).on("mouseleave",(e)=>{
				$(e.target).parent().trigger("mouseleave");
			})
		})

		CarWithAudio.startVehicles();

	}

	static seeMe(){
		$("[type=AUDIO]").each((idx,elem)=>{

				elem = $(elem).parent();

				elem.off("mouseleave");
		});

		$("body").find("[id^=speed]").each((idx,elem)=>{
			try {
				$(elem).slider("option","disabled",true);
			}catch(e){log.debug(`Ignoring slider disabling error. jQuery.slider should handle this better ${e}`)}
		})
	}

	static stopMe(meId){

		var me = $(`#${meId}`);
		
		$(me).attr("brake","enable").stop();

	}

	static startMe(meId){

		console.log(`Starting one car ${meId}`)

		var elem = $(`#${meId}`);
	
		elem.removeAttr("brake");

		var ptr = window.CarWithAudio[elem.attr("id")];

		if(ptr.car.oldPosition && elem.attr("original-left") == 0) {
			
			console.log(`Setting the car to previous position`);

			elem.css({left:ptr.car.oldPosition.left,top:ptr.car.oldPosition.top});


		} 
		
		if(ptr.car.direction){
			if(ptr.car.direction == "left"){
				console.log(`Starting vehicle going left`);
				ptr.driveLeft();

			} else {
				console.log(`Starting vehicle going right`);
				ptr.driveRight();
			}

		} else {
			console.log(`Starting vehicle going right`);
			ptr.driveRight();
		}
	
	}

	static stopVehicles(){
	
		if(window.CarWithAudio){

			$("[type=AUDIO]").each((idx,elem)=>{

				elem = $(elem).parent();

				//elem.find("audio")[0].volume = 1;
				elem.find("audio")[0].pause();
				var theId = elem.attr("id");
					
				console.log(`Resetting vehicle ${theId}`);
				
				
				elem.stop();
				//$(elem).css({top:window.CarWithAudio[theId].car.oldPosition.top,left:window.CarWithAudio[theId].car.oldPosition.left})
				elem.attr("brake","enabled").not("[parkingbrake]").css({"left":"100",transform:"rotateY(0deg)"})

				// CUSTOM_PXTO_VIEWPORT(elem,elem.position().left,elem.position().top)
			}).show();
		}
	
	}

	static startVehicles(){

		var values = $(".dropped-object").map(function(index, el) { return $(el).width() });

		CarWithAudio.bodyWidth = Math.max.apply(null, values);

		$("[type=AUDIO]").each((idx,elem)=>{

			elem = $(elem).parent();

			elem.css({"z-index":"50000"})

			elem.removeAttr("brake");

			if(elem.attr("parkingbrake") != "on"){

				var ptr = window.CarWithAudio[elem.attr("id")];

				if(ptr.car.oldPosition && elem.attr("original-left") == 0) {
					
					console.log(`Setting the car to previous position`);

					elem.css({left:ptr.car.oldPosition.left,top:ptr.car.oldPosition.top});


				} 
				
				if(ptr.car.direction){
					if(ptr.car.direction == "left"){
						console.log(`Starting vehicle going left`);
						ptr.driveLeft();

					} else {
						console.log(`Starting vehicle going right`);
						ptr.driveRight();
					}

				} else {
					console.log(`Starting vehicle going right`);
					ptr.driveRight();
				}

			} else {

				elem.find("audio").each((idx,elem)=>{
			 //$(elem)[0].pause();
			 	$(elem)[0].play();
				//$(elem)[0].loop = true;
				//$(elem).show();
				//elem.volume=0.3;
			})
		}
			
			/*
		$("[id*=audio]").each((idx,elem)=>{
			 //$(elem)[0].pause();
		});*/
	}).hide();
	}

	 driveLeft(){

	 
	 	window.CarWithAudio[$(this.car).attr("id")].car.direction = "left";


	 	console.log(`driving left Homey.  Should not repeat a bunch ${++CarWithAudio.counter}`);

	 	if($("[vehicle]").attr("brake") == "enabled"){
	 		// if vehicle stops off screen, this will bring it back on screen
	 		CarWithAudio.stopVehicles();
	 		console.log("driving disabled");
	 		return;
	 	}

		var loweringVolume = false;

		console.log(`Audio id is ${this.audio.id} and looking for #${this.audio.id}`);
		
		console.log($(`#${this.audio.id}`));

		this.audio.currentTime = $(`#${this.audio.id}`)[0].hasAttribute("cTime") ? $(`#${this.audio.id}`).attr("cTime")  + this.speedInSecs : 0;

		console.log(`Left: Current Time of audio is ${this.audio.currentTime}`)

		$(this.car).css("transform","rotateY(0deg)");
											  
		$(this.car).animate({left:-$(this.car).width() * 2},{duration: CarWithAudio.duration / window.CarWithAudio[$(this.car).attr("id")].speedInSecs,
			progress:()=>{

				var elem = $(this.car);

				window.CarWithAudio[elem.attr("id")].car.oldPosition.left = elem.position().left;
				window.CarWithAudio[elem.attr("id")].car.oldPosition.top = elem.position().top;

				if(this.audio.paused ){
					//audio.currentTime = 90;
					this.audio.play();
					console.log(`Increasing Volume to ${this.volume1To10}..coming from offscreen right headed Left <==`);
					console.log(`Right: Volume is ${this.audio.volume}`)
					$(this.audio).animate({volume: this.volume1To10/10}, {duration:3000});
					

				} else if($(this.car).position().left < 0 && !loweringVolume){
					//audio.pause();
					loweringVolume = true;

					$(this.audio).animate({volume: 0}, {duration:3000});

					console.log("Reducing Volume Exited Stage Left <==")
				} 
			},complete:()=>{this.audio.pause(); console.log(this.car);$(`#${this.audio.id}`).attr("cTime",this.audio.currentTime); loweringVolume = false; console.log(`Completed driving Right ${++CarWithAudio.counter}`);
				//setTimeout(()=>{this.driveRight();},100)
				this.driveRight();
				 }})

	}

	driveRight(){

	
		window.CarWithAudio[$(this.car).attr("id")].car.direction = "right";

		console.log(`driving right Homey.  Should not repeat a bunch ${++CarWithAudio.counter}`);

		if($("[vehicle]").attr("brake") == "enabled"){
			CarWithAudio.stopVehicles();
	 		console.log("driving disabled");
	 		return;
	 	}

		var loweringVolume = false;

		console.log(`Audio id is ${this.audio.id} and looking for #${this.audio.id}`);
		console.log($(`#${this.audio.id}`));


		this.audio.currentTime = $(`#${this.audio.id}`)[0].hasAttribute("cTime") ? $(`#${this.audio.id}`).attr("cTime") + this.speedInSecs : 0;

		console.log(`Right: Current Time of audio is ${this.audio.currentTime}`)

		$(this.car).css("transform","rotateY(180deg)");

		

		console.log(`Duration ${CarWithAudio.duration} and car speed in secondes ${window.CarWithAudio[$(this.car).attr("id")].speedInSecs}`);
		console.log(`Math is Duration(milliseconds)/speedInSeconds ${CarWithAudio.duration/window.CarWithAudio[$(this.car).attr("id")].speedInSecs}`);


		$(this.car).animate({left:$(this.car).width() + CarWithAudio.bodyWidth},
			{
				duration:CarWithAudio.duration/window.CarWithAudio[$(this.car).attr("id")].speedInSecs,

				progress:()=>{

					var elem = $(this.car);

						window.CarWithAudio[elem.attr("id")].car.oldPosition.left = elem.position().left;
						
						window.CarWithAudio[elem.attr("id")].car.oldPosition.top = elem.position().top;

				


					if(this.audio.paused){
						
						this.audio.play();
						console.log("Increasing Volume Entering from Offscreen Left headed right Right ==>");
						$(this.audio).animate({volume: this.volume1To10/10}, {duration:3000});
						
					}else if($(this.car).position().left > $("body").width() - $(this.car).width() && !loweringVolume){
						loweringVolume = true;

						console.log("Decreasing Volume Leaving Offscreen from Left headed Right ==>");
						console.log(`Left: Volume is ${this.audio.volume}`)
						$(this.audio).animate({volume:0.0}, {duration:3000});

					}
				},
				complete:()=>{this.audio.pause();$(`#${this.audio.id}`).attr("cTime",this.audio.currentTime); loweringVolume = false; console.log(`Completed driving Right ${++CarWithAudio.counter}`);
						//setTimeout(()=>{this.driveLeft();},100)
						this.driveLeft();
				;}
			}
		)

	}
}

CarWithAudio.counter = 0;
CarWithAudio.bodyWidth = 0;
CarWithAudio.duration = 60000;
