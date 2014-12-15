var onMirror = false;

function playVideo() {
  var url = document.getElementById('videoUrl').value;
  video.src = url;
  video.load();
  video.play();
}

function jumpVideo() {
  var time = document.getElementById('videoTime').value;
  video.currentTime = time;
}

function rotateVideo() {
  var angle = document.getElementById('videoAngle').value;
  console.log(angle);
  // video.style['MozTransform']='rotate('+angle+'deg)';
  rotateSentence = "-moz-transform:rotate("+angle +"deg);-webkit-transform:rotate("+angle +"deg);-o-transform:rotate("+angle +"deg);-ms-transform:rotate("+angle +"deg);transform:rotate("+angle +"deg);"
  video.style.cssText = rotateSentence;
}

function extractVideo() {
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
  if (video.hasAttribute("controls")) {
     video.removeAttribute("controls");  
  } else {
     video.setAttribute("controls","controls");   
  }
}

function mirror() {
  
  if (onMirror == false){
    video.style.cssText = "-webkit-box-reflect: below 0px -webkit-linear-gradient(top, transparent, transparent 55%, white) 0 fill stretch;";
    video.style.marginBottom = "180px";
  }
  else{
    video.style.webkitBoxReflect = "none";
    video.style.marginBottom = "10px"; 
  }

  onMirror = !onMirror;
}

var iCurrentVideo;
var links;
var videoList = [
  {
    name: "video/oceans.webm", 
    id: 0
  }, 
  {
    name: "video/sintel_trailer.webm", 
    id: 1
  },
  {
    name: "video/iceage4.ogv", 
    id: 2
  }
];
var playlist;
var protocol;
var hostname;
var video;
var videoLabel;

function initVideoPlayer()
{
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
}
  function onend(e){
    iCurrentVideo++;
    iCurrentVideo = iCurrentVideo%3;
    var iNextVideo = iCurrentVideo;

    playlist.src=links[iCurrentVideo].href;
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

    playlist.src = filename;
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
  for(var i=0; i<4; i++){
      output.appendChild(snapshots[i]);
  }
}
  
