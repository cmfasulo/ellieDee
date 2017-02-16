$(document).ready(function() {
  buildMatrix();

  $(".led").on("click", function() {
    var thisLed = this;
    var ledIndex = "leds[" + this.id.toString() + "]";
    // var drawing = "drawing";
    // var drawingObj = "{ " + ledIndex.toString() + ": " + $("#currentColor").val() + " }";
    var jsonData = { leds: "['test', 'test']" };
    // console.log("EllieDeeObj: " + JSON.stringify(drawingObj));

    // jsonData[ledIndex] = $("#currentColor").val();
    // jsonData[drawing] =  JSON.parse(drawingObj);
    console.log("JSON Data: " + JSON.stringify(jsonData));

    $.ajax({
      dataType: 'json',
      url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
      method: 'PUT',
      contentType: "application/json",
      data: JSON.stringify(jsonData),
      success: function(data) {
        console.log("EllieDee Successfully Updated: " + JSON.stringify(data));
        console.log("This LED: " + data.leds[143]);
        $(this).css('background-color', data.leds[parseInt(thisLed.id)].toString());
      },
      error: function(jqXHR, textStatus, error) {
        console.log("EllieDee Failed to Update: " + error);
      }
    });

  });
});

//Creates a function that generates a really long string with entire table HTML and sends AJAX call to reset LED array in database
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

  var blankArray = [];
  for (var i = 0; i < 145; i++) {
    blankArray.push("#000000");
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
      console.log("EllieDee Successfully Reset: " + JSON.stringify(data));
    },
    error: function(jqXHR, textStatus, error) {
      console.log("EllieDee Failed to Reset: " + error);
    }
  });
}
