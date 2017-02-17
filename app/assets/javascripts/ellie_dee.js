$(document).ready(function() {
  buildMatrix();

  $(".led").on("click", function() {

    $(this).css('background-color', $("#currentColor").val());
    var currentColors = getColors();

    $.ajax({
      dataType: 'json',
      url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
      method: 'PUT',
      contentType: "application/json",
      data: JSON.stringify({
        "leds": currentColors
      }),
      success: function(data) {
        console.log("EllieDee Successfully Updated: " + JSON.stringify(data));
        setColors(data.leds);
      },
      error: function(jqXHR, textStatus, error) {
        console.log("EllieDee Failed to Update: " + error);
      }
    });
  });

  $("#ledOff").on("click", function() {
    $("#currentColor").val("#808080");
  });

  $("#reset").on("click", function() {
    $("#ledMatrix").empty();
    buildMatrix();
  });

  $("#save").on("click", function() {

  });
});

//Creates a function that generates a really long string with entire table HTML and sends AJAX call to reset LED array in database
function buildMatrix() {
  var matrixString = "";
  var ledNum = 143;
  for (var i = 11; i >= 0; i--) {
    matrixString += "<tr id='r" + i + "'>" //creates opening tag and id for current row
    for (var j = 11; j >= 0; j--) {
      matrixString += "<td class='led' id='" + ledNum + "'><div></div></td>" //adds the current column to the string for the current row; moves onto the next column in the inner "for" loop
      ledNum--;
    }
    matrixString += "</tr>"; //adds a closing tag for the current row; moves onto the next row in the outer "for" loop
  }
  $("#ledMatrix").append(matrixString);

  var blankArray = [];
  for (var i = 0; i < 145; i++) {
    blankArray.push("#808080");
  }
  blankArray = "[" + blankArray.toString() + "]";

  $.ajax({
    dataType: 'json',
    url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
    method: 'PUT',
    contentType: "application/json",
    data: JSON.stringify({
      "leds": blankArray
    }),
    success: function(data) {
      console.log("EllieDee Successfully Reset. LEDs: " + data.leds);
      setColors(data.leds);
    },
    error: function(jqXHR, textStatus, error) {
      console.log("EllieDee Failed to Reset: " + error);
    }
  });
}

function getColors() {
  var colors = [];

  for (var i = 0; i <= 143; i++) {
    var currentLed = "#" + i.toString();
    var ledColor = rgb2hex($(currentLed).css('backgroundColor'));
    // console.log("getColor LED: ", ledColor);
    colors.push(ledColor);
  }
  console.log("Colors: ", colors);
  return colors;
}

function setColors(array) {
  for (var i = 0; i < array.length; i++) {
    var currentLed = "#" + i.toString();
    $(currentLed).css('backgroundColor', array[i].toString());
  }
}

//Function to convert hex format to a rgb(a) color
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
