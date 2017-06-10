console.log("Trying to see if myVid and player loaded");
console.log($("#myVid").parent())


  var player = jwplayer('myVid');
  //Que First File and Play
  player.setup({
    file: '//content.jwplatform.com/videos/jumBvHdL-cIp6U8lV.mp4',
    image: "//content.jwplatform.com/thumbs/xJ7Wcodt-720.jpg"
  });

  player.addButton(
    //This portion is what designates the graphic used for the button
    "//icons.jwplayer.com/icons/white/download.svg",
    //This portion determines the text that appears as a tooltip
    "Download Video",
    //This portion designates the functionality of the button itself
    function() {
      //With the below code, we're grabbing the file that's currently playing
      window.location.href = player.getPlaylistItem()['file'];
    },
    //And finally, here we set the unique ID of the button itself.
    "download"
  );


  //Test some playlists later
  var playlistOne = [{
  "file": "//content.jwplatform.com/videos/C4lp6Dtd-640.mp4", 
  "image": "//content.jwplatform.com/thumbs/C4lp6Dtd-640.jpg", 
  "title": "Tears of Steel"
  }];

  var playlistTwo = [{
  "file": "//content.jwplatform.com/videos/bkaovAYt-640.mp4", 
  "image":"//content.jwplatform.com/thumbs/bkaovAYt-640.jpg", 
  "title": "Big Buck Bunny"
  }];

  var playlistThree = [{
  "file":"//content.jwplatform.com/videos/kaUXWqTZ-640.mp4", 
  "image":"//content.jwplatform.com/thumbs/kaUXWqTZ-640.jpg", 
  "title": "Elephant's Dream"
  },{
  "file": "//content.jwplatform.com/videos/C4lp6Dtd-640.mp4", 
  "image": "//content.jwplatform.com/thumbs/C4lp6Dtd-640.jpg", 
  "title": "Tears of Steel"
  },{
  "file": "//content.jwplatform.com/videos/bkaovAYt-640.mp4", 
  "image":"//content.jwplatform.com/thumbs/bkaovAYt-640.jpg", 
  "title": "Big Buck Bunny"
  }];

//container is always available via plugin
//w = $("#myVid").parents("[type=T]").width() * (100 / document.documentElement.clientWidth);
//h = $("#myVid").parents("[type=T]").height() * (100 / document.documentElement.clientWidth);
//$("#myVid").css({height:h+"vw",width:w+"vw"})
