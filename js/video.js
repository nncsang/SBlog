var onMirror = false;

function playVideo() {
  var url = document.getElementById('videoUrl').value;
  video.src = url;
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
var playlist;
var protocol;
var hostname;
var video;

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
}
  function onend(e){
    iCurrentVideo++;
    var iNextVideo = iCurrentVideo%3;
    playlist.src=links[iCurrentVideo%3].href;
    playlist.load();
    playlist.play();
  }

  function handler(e) {

    e.preventDefault();
    filename = this.getAttribute("href");
    // video.removeAttribute("controls");
    //video.removeAttribute("poster");

    fullname = protocol + '//' + hostname + "/" + filename;

    console.log(fullname);
    for (var i=0; i<links.length; i++) {
      if (links[i].href == fullname){
        iCurrentVideo = i;
        break;
      }
    }

    playlist.src = filename;
    playlist.load();
    playlist.play();
  }
  
