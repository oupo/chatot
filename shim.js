navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia || 
                       function() { throw "navigator.getUserMedia doesn't support navigator.getUserMedia" });


window.AudioContext = window.AudioContext||window.webkitAudioContext;