// Set interval for logo flash below (colorChange function)
// var x;
// function colorChange() {
//     x = 1;
//     setInterval(flashLogo, 1000);
// }

// Connection Status indicator light "behind" LED Matrix bottom logo
// function flashLogo () {
// 	if (x === 1) {
//         color = "red";
//         x = 2;
//     } else {
//         color = "green";
//         x = 1;
//     }
//     document.getElementById("logoBackground").style.backgroundColor = color;
// }

// Change LED Matrix buttons to selected color from Color Picker

var timer;
var istrue = false;
var delay = 1000; // how much long u have to hold click in MS

function mouseDown(clicked_id) {
   var setColor = document.getElementById(clicked_id).backgroundColor;
   istrue = true;
   timer = setTimeout(function(){ grabColor(clicked_id);},delay);
}

function grabColor(clicked_id) {
      if(timer)
	      clearTimeout(timer);
      
      if(istrue) {
	      document.getElementById("currentColor").style.backgroundColor = document.getElementById(clicked_id).style.backgroundColor;
      }
}

function reset() {
   istrue =false;
}

function applyColor (clicked_id) {

	var ledID = clicked_id;
	var setColor = document.getElementById('currentColor').style.backgroundColor; //example: rgb(0,0,0);
	var rgb = setColor.replace(/[^\d,]/g, '').split(','); //strips rgb into values only, example: (0,0,0);
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];

	document.getElementById(clicked_id).style.backgroundColor = setColor;
}

// Reset all LED Matrix buttons to default color
function resetAll () {
	for (var i = 1; i <= 144; i++) {
		document.getElementById(i).style.backgroundColor = "buttonface";
	}
}

// Reset current color to "black" or "off" to turn off indivdual LEDs
function resetPicker () {
	document.getElementById("currentColor").style.backgroundColor = "#000";
}