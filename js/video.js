var onMirror = false;

function playVideo() {
  video = document.getElementById('video');
  var url = document.getElementById('videoUrl').value;
  video.src = url;
  video.load();
  video.play();
}

function jumpVideo() {
  video = document.getElementById('video');
  var time = document.getElementById('videoTime').value;
  video.currentTime = time;
}

function rotateVideo() {
  video = document.getElementById('video');
  var angle = document.getElementById('videoAngle').value;
  
  // video.style['MozTransform']='rotate('+angle+'deg)';
  rotateSentence = "-moz-transform:rotate("+angle +"deg);-webkit-transform:rotate("+angle +"deg);-o-transform:rotate("+angle +"deg);-ms-transform:rotate("+angle +"deg);transform:rotate("+angle +"deg);"
  video.style.cssText = rotateSentence;
}

function extractVideo() {
  video = document.getElementById('video');
  var start = document.getElementById('beginTime').value;
  var end = document.getElementById('endTime').value;
  
  
  if(video.src==''){
      var sources = video.getElementsByTagName('source'); 
    var link = sources[0].src + '#t=' + start + ',' + end;
  }
  else{
    var link = videocustom.src + '#t=' + start + ',' + end;
  }

  var secondVideo = document.getElementById('secondVideo');
  secondVideo.style.display = "";
  secondVideo.src=link;
  
  secondVideo.load();
  secondVideo.play();
}

function toggleControls() {
  video = document.getElementById('video');
  if (video.hasAttribute("controls")) {
     video.removeAttribute("controls");  
  } else {
     video.setAttribute("controls","controls");   
  }
}

function mirror() {
  
  video = document.getElementById('video');
  if (isChrome || isSafari){
  if (onMirror == false){
      video.style.cssText = "-webkit-box-reflect: below 0px -webkit-linear-gradient(top, transparent, transparent 55%, white) 0 fill stretch;";
      video.style.marginBottom = "180px";
    }
    else{
      video.style.webkitBoxReflect = "none";
      video.style.marginBottom = "10px"; 
    }

    onMirror = !onMirror;
  }else{

      var context, rctxt, video;
      reflection = document.getElementById("reflection");

      

      if (onMirror)
        reflection.style.display = "none";
      else{

        video.play();
        
        reflection.style.display = "block";
        rctxt = reflection.getContext("2d");
        //var w = video.videoWidth;
        //var h = video.videoHeight;
        var h = 400;
        var w = 600;
        
        reflection.width = w;
        reflection.height = h;
        rctxt.translate(0,h);
        rctxt.scale(1,-1);
        paintFrame(video, rctxt, w, h);


      }

      onMirror = !onMirror;
  }
}

function paintFrame(video, rctxt, w, h) {
      
  rctxt.drawImage(video, 0, 0, w , h);
  rctxt.fill();

  if (video.paused || video.ended) {
    return;
  }

  setTimeout(function () {
   paintFrame(video, rctxt, w, h);
  }, 0);
}

var iCurrentVideo;
var links;
var videoList = [
  {
    name: "video/oceans", 
    id: 0
  }, 
  {
    name: "video/sintel_trailer", 
    id: 1
  },
  {
    name: "video/we_wish_you_a_merry_christmas", 
    id: 2
  }
];

var ext = ".";

var playlist;
var protocol;
var hostname;
var video;
var videoLabel;
var isChrome = false;
var isSafari = false;

function initVideoPlayer()
{
  if(navigator.userAgent.indexOf("Chrome") != -1)
  {
   isChrome = true;
  }

  if(navigator.userAgent.indexOf("Safari") != -1)
  {
    isSafari = true;
  }

  protocol = window.location.protocol;
  hostname = window.location.hostname;

  video = document.getElementById('video');
  playlist = document.querySelector("#playlist"); 
  playlist.addEventListener('ended',onend,false);

  var video_player = document.getElementById("video_player");
  
  links = video_player.getElementsByTagName('a');
  for (var i=0; i<links.length; i++) {
    links[i].onclick = handler;
  }

  iCurrentVideo = 0;

  videoLabel = document.getElementById('cur_Video_Name');

  playlist.onplay = function() { 
    videoLabel.innerHTML = "Playing: " + videoList[iCurrentVideo].name;
  };

  video.loadeddata = function(){
    // Let's wait another 100ms just in case?
    // setTimeout(function()
    // {
        // Create a canvas element, this is what user sees.
        alert("Loaded");
        var canvas = document.createElement("canvas");

        // Set it to same dimensions as video.
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;

        // Put it on page.
        document.getElementById("first_frame").innerHTML = "";
        document.getElementById("first_frame").appendChild(canvas);

        // Get the drawing context for canvas.
        var ctx = canvas.getContext("2d");

        // Draw the current frame of video onto canvas.
        ctx.drawImage(vid, 0, 0);

        // Done!
    // });
  };

  var mpeg4, h264, ogg, webm;
  if ( video.canPlayType ) {
      // Check for MPEG-4 support
      mpeg4 = "" !== video.canPlayType( 'video/mp4; codecs="mp4v.20.8"' );

      // Check for h264 support
      h264 = "" !== ( video.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
          || video.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) );

      // Check for Ogg support
      ogg = "" !== video.canPlayType( 'video/ogg; codecs="theora"' );

      // Check for Webm support
      webm = "" !== video.canPlayType( 'video/webm; codecs="vp8, vorbis"' );
      

      if (mpeg4)
        ext = ".mp4";

      if (h264)
        ext = ".mp4";

      if (ogg)
        ext = ".ogg";

      if (webm)
        ext = ".webm";

      
  }
}
  function onend(e){
    iCurrentVideo++;
    iCurrentVideo = iCurrentVideo%3;
    var iNextVideo = iCurrentVideo;

    playlist.src=links[iCurrentVideo].href + ext;
    videoLabel.innerHTML = "Playing: " + videoList[iCurrentVideo].name;
    playlist.load();
    playlist.play();
  }

  function handler(e) {

    e.preventDefault();
    filename = this.getAttribute("href");
    // video.removeAttribute("controls");
    //video.removeAttribute("poster");

    fullname = protocol + '//' + hostname + "/" + filename;

    for (var i=0; i<videoList.length; i++) {
      if (videoList[i].name == filename){
        iCurrentVideo = videoList[i].id;
        break;
      }
    }

    playlist.src = filename + ext;
    playlist.load();
    playlist.play();

    videoLabel.innerHTML = "Playing: " + videoList[iCurrentVideo].name;
  }



var scaleFactor = 0.25;
var snapshots = [];

function capture(video, scaleFactor) {
  if(scaleFactor == null){
      scaleFactor = 1;
  }
  var w = video.videoWidth * scaleFactor;
  var h = video.videoHeight * scaleFactor;
  var canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
  var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
  return canvas;
} 

/**
* Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
*/
function shoot(){
  var output = document.getElementById('output');
  var canvas = capture(video, scaleFactor);
      canvas.onclick = function(){
          window.open(this.toDataURL());
      };
  snapshots.unshift(canvas);
  output.innerHTML = '';
  for(var i=0; i<1; i++){
      output.appendChild(snapshots[i]);
  }
}
  
