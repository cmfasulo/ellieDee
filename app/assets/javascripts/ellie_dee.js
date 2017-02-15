$(document).ready(function() {
  buildMatrix();
});

//Creates a function that generates a really long string with entire table HTML
function buildMatrix() {
  var matrixString = "";
  var ledNum = 143;
  for (var i = 11; i >= 0; i--) {
    matrixString += "<tr id='" + i + "'>" //creates opening tag and id for current row
    for (var j = 11; j >= 0; j--) {
      matrixString += "<td class='led' id='" + ledNum + "'><div></div></td>" //adds the current column to the string for the current row; moves onto the next column in the inner "for" loop
      ledNum--;
    }
    matrixString += "</tr>"; //adds a closing tag for the current row; moves onto the next row in the outer "for" loop
  }
  $("#ledMatrix").append(matrixString);
}


// function mouseDown(clicked_id) {
//    var setColor = document.getElementById(clicked_id).backgroundColor;
//    istrue = true;
//    timer = setTimeout(function(){ grabColor(clicked_id);},delay);
// }
//
// function grabColor(clicked_id) {
//       if(timer)
// 	      clearTimeout(timer);
//
//       if(istrue) {
// 	      document.getElementById("currentColor").style.backgroundColor = document.getElementById(clicked_id).style.backgroundColor;
//       }
// }
//
// function reset() {
//    istrue =false;
// }
//
// function applyColor (clicked_id) {
//
// 	var ledID = clicked_id;
// 	var setColor = document.getElementById('currentColor').style.backgroundColor; //example: rgb(0,0,0);
// 	var rgb = setColor.replace(/[^\d,]/g, '').split(','); //strips rgb into values only, example: (0,0,0);
// 	var r = rgb[0];
// 	var g = rgb[1];
// 	var b = rgb[2];
//
// 	document.getElementById(clicked_id).style.backgroundColor = setColor;
// }
//
// // Reset all LED Matrix buttons to default color
// function resetAll () {
// 	for (var i = 1; i <= 144; i++) {
// 		document.getElementById(i).style.backgroundColor = "buttonface";
// 	}
// }
//
// // Reset current color to "black" or "off" to turn off indivdual LEDs
// function resetPicker () {
// 	document.getElementById("currentColor").style.backgroundColor = "#000";
// }
